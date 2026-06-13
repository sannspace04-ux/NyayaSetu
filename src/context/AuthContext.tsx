"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase, type AppUser, getCurrentUser } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

type AuthContextType = {
  user: AppUser | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const u = await getCurrentUser();
    setUser(u);
  }, []);

  useEffect(() => {
    let mounted = true;

    // Single initialisation: get session once, then listen for changes.
    // We intentionally do NOT call getCurrentUser inside onAuthStateChange
    // on the initial SIGNED_IN event to avoid a double call.
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      if (data.session) {
        const u = await getCurrentUser();
        if (mounted) setUser(u);
      }
      if (mounted) setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;
      setSession(newSession);

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
        const u = await getCurrentUser();
        if (mounted) setUser(u);
      }
      if (event === "SIGNED_OUT") {
        if (mounted) setUser(null);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut: handleSignOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
