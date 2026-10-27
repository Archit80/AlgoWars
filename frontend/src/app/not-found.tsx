
"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, FileQuestion } from "lucide-react";
import Link from "next/link";

const NotFound: React.FC = () => {
  const pathname = usePathname();

  useEffect(() => {
    console.error(
      `404 Error: User attempted to access non-existent route: ${pathname}`
    );
  }, [pathname]);

  return (
    <div className="min-h-screen bg-white paper-grid flex items-center justify-center p-4">
      <div className="w-full max-w-lg p-8 space-y-6 text-center paper-card">
        <div className="flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
            <FileQuestion className="text-blue-700 w-7 h-7" />
          </div>
          <p className="section-label">Error 404</p>
          <h1 className="text-5xl font-bold text-slate-900 mt-2">Page Not Found</h1>
        </div>

        <div className="space-y-3 border-t border-slate-200 pt-6">
          <p className="text-slate-600">
            The page you are looking for does not exist or may have been moved.
          </p>
        </div>

        <div className="flex justify-center pt-2">
          <Link href="/dashboard" passHref>
            <Button
              size="lg"
              className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white font-semibold hover:cursor-pointer"
            >
              <Home className="w-5 h-5 mr-2" />
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
