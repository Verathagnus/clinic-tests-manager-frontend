"use client"
// app/page.tsx

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push('/create-invoice');
  }, [])
  return (
    <div className="min-h-screen bg-gray-100">
      Invoice Management Layout
    </div>
  );
}