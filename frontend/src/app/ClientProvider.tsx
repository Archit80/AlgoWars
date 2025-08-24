"use client";
import { UserProvider } from "@/contexts/userContext";

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      {children}
    </UserProvider>
  );
}
