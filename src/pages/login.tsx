import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "../utils/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [usernames, setUsernames] = useState<string[]>([]);
  const router = useRouter();

  // Fetch usernames on component mount
  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const response = await api.get("/users");
        if (response.data.length === 0) {
          setError("No users found in the database. Please contact the administrator.");
        } else {
          setUsernames(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch usernames:", error);
        setError("Failed to fetch user data. Please try again later.");
      }
    };

    fetchUsernames();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any previous errors

    try {
      const response = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Select onValueChange={(value) => setUsername(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a username" />
                  </SelectTrigger>
                  <SelectContent>
                    {usernames.map((username) => (
                      <SelectItem key={username} value={username}>
                        {username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={usernames.length === 0}>
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;