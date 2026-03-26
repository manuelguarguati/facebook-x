"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext<{
  user: any;
  session: any;
  loading: boolean;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      const { data: { session: initialSession }, error } = await supabase.auth.getSession();
      
      console.log("DEBUG [AuthProvider]: Initial session fetch", { 
        hasSession: !!initialSession, 
        error: error?.message,
        pathname
      });

      if (initialSession) {
        setSession(initialSession);
        setUser(initialSession.user);
        
        // If on public auth pages, redirect to dashboard
        if (pathname === "/login" || pathname === "/register" || pathname === "/") {
          console.log("DEBUG [AuthProvider]: Redirecting to /dashboard (session active)");
          router.push("/dashboard");
        }
      }
      setLoading(false);
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log(`DEBUG [AuthProvider]: Auth state change [${event}]`, { 
        hasSession: !!newSession,
        pathname
      });

      setSession(newSession);
      setUser(newSession?.user || null);
      setLoading(false);

      if (event === "SIGNED_IN" && (pathname === "/login" || pathname === "/register")) {
        router.push("/dashboard");
      }

      if (event === "SIGNED_OUT") {
        router.push("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router, pathname]);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
