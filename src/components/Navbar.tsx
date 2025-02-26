// src/components/Navbar.tsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';
// import { toast } from 'sonner';

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string }>({ username: '' });

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user') || '{}'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <nav className="bg-background border-b shadow-sm">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex space-x-6 items-center">
          <Link href="/dashboard">
            <span className={`text-foreground hover:text-primary font-medium transition-colors cursor-pointer ${router.pathname === '/dashboard' ? 'text-primary' : ''}`}>
              Dashboard
            </span>
          </Link>
          <Link href="/manage-invoices">
            <span className={`text-foreground hover:text-primary font-medium transition-colors cursor-pointer ${router.pathname === '/manage-invoices' ? 'text-primary' : ''}`}>
              Invoices
            </span>
          </Link>
          <Link href="/manage-item-groups">
            <span className={`text-foreground hover:text-primary font-medium transition-colors cursor-pointer ${router.pathname === '/manage-item-groups' ? 'text-primary' : ''}`}>
              Item Groups
            </span>
          </Link>
          <Link href="/manage-items">
            <span className={`text-foreground hover:text-primary font-medium transition-colors cursor-pointer ${router.pathname === '/manage-items' ? 'text-primary' : ''}`}>
              Items
            </span>
          </Link>
          <Link href="/view-patients">
            <span className={`text-foreground hover:text-primary font-medium transition-colors cursor-pointer ${router.pathname === '/view-patients' ? 'text-primary' : ''}`}>
              Patients
            </span>
          </Link>
          <Link href="/utilities">
            <span className={`text-foreground hover:text-primary font-medium transition-colors cursor-pointer ${router.pathname === '/utilities' ? 'text-primary' : ''}`}>
              Utilities
            </span>
          </Link>
          <Button className="bg-primary text-white hover:text-primary font-medium transition-colors cursor-pointer">
            <Link href="/create-invoice">
              <span>
                Create New Invoice
              </span>
            </Link>
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/default.png" alt="User" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.username || 'Guest'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Welcome back!
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;