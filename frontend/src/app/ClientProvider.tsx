"use client";
import { UserProvider } from "@/contexts/userContext";

// The auth logic has been moved to the /auth/callback page.
// This provider is now a simple wrapper for the UserProvider.
export default function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      {children}
    </UserProvider>
  );
}
