import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import uuid from "react-native-uuid"
import * as SecureStore from "expo-secure-store";

export interface User {
  id?: string;
  created_at: string;
  remaining_credits: number;
}

interface SupabaseContextType {
  supabase: SupabaseClient;
  user: User | null;
  checkUser: () => Promise<void>;
  addCredits: (amount: number) => Promise<void>;
  removeCredits: (amount: number) => Promise<void>;
}

export const SupabaseContext = createContext<SupabaseContextType | null>(null);

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_API_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL or Key is not defined");
  }
  const supabase = createClient(supabaseUrl, supabaseKey);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const check = async () => {
      await checkUser();
    };
    check();
  }, []);

  const addCredits = async (amount: number) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("users")
        .update({ remaining_credits: user.remaining_credits + amount })
        .eq("id", user.id);
      if (error) {
        console.error("Error adding credits to user:", error);
        throw new Error("Error adding credits to user");
      }
    } catch {
      console.error("Error adding credits to user");
      throw new Error("Error adding credits to user");
    }
  };

  const removeCredits = async (amount: number) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("users")
        .update({ remaining_credits: user.remaining_credits - amount })
        .eq("id", user.id);
      if (error) {
        console.error("Error removing credits from user:", error);
        throw new Error("Error removing credits from user");
      }
    } catch {
      console.error("Error removing credits from user");
      throw new Error("Error removing credits from user");
    }
  };

  // If user id exists in secure store, get it
  const getUserId = async (): Promise<string> => {
    try {
      let userId = await SecureStore.getItemAsync("userId");
      if (!userId) {
        userId = uuid.v4()
        await SecureStore.setItemAsync("userId", userId);
      }
      return userId;
    } catch (error) {
      console.error("Error getting user ID:", error);
      throw new Error("Error getting user ID");
    }
  };

  const checkUser = async () => {
    const userId = await getUserId();
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", userId).single();
      if (data) {
        setUser(data);
      } else {
        // Create a new user if not found
        const { data, error } = await supabase
          .from("users")
          .insert({
            id: userId,
            remaining_credits: 5,
          })
          .select()
          .single();
        if (data) {
          setUser(data);
          console.log("User created:", data);
        }
        if (error) {
          console.error("Error creating user:", error);
          throw new Error("Error creating user");
        }
      }

      if (error) {
        console.error("Error fetching user:", error);
        throw new Error("Error fetching user");
      }
    } catch (error) {
      console.error("Error checking user:", error);
      throw new Error("Error checking user");
    }
  };

  return (
    <SupabaseContext.Provider value={{ supabase, user, checkUser, addCredits, removeCredits }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
};
