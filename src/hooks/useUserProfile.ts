import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

// Perfil de demonstração para MVP
const DEMO_PROFILE: UserProfile = {
  id: "demo-user",
  full_name: "Visitante Demo",
  avatar_url: null,
};

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        // Usar perfil de demonstração quando não houver usuário
        setProfile(DEMO_PROFILE);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          // Em caso de erro, usar perfil demo
          setProfile(DEMO_PROFILE);
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error("Error:", error);
        // Em caso de erro, usar perfil demo
        setProfile(DEMO_PROFILE);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    // Subscribe to profile changes
    const channel = supabase
      .channel("profile-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user?.id}`,
        },
        (payload) => {
          setProfile(payload.new as UserProfile);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  return { profile, loading };
};
