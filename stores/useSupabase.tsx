import { create } from "zustand";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { getUserId } from "@/utils/getUserId";

// User model
type User = {
  id?: string;
  created_at: string;
  remaining_credits: number;
};

// Supabase store type
type SupabaseStore = {
  supabase: SupabaseClient;
  user: User | null;
  checkUser: () => Promise<void>;
  addCredits: (amount: number) => Promise<void>;
  removeCredits: (amount: number) => Promise<void>;
};

// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_API_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or Key is not defined");
}
const supabase = createClient(supabaseUrl, supabaseKey);

export const useSupabase = create<SupabaseStore>((set, get) => ({
  user: null,
  supabase: supabase,
  checkUser: async () => {
    try {
      const userId = await getUserId();
      const { data, error } = await supabase.from("users").select("*").eq("id", userId).single();
      if (data) {
        set({ user: data });
        return;
      }
      // If user does not exist, create a new user
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          id: userId,
          remaning_credits: 5,
        })
        .select()
        .single();

      if (newUser) {
        set({ user: newUser });
      }
    } catch (error) {
      throw error;
    }
  },
  addCredits: async (amount: number) => {
    const user = get().user;
    if (!user) return;
    try {
      const { error } = await supabase
        .from("users")
        .update({ remaining_credits: user.remaining_credits + amount })
        .eq("id", user.id);

      set({ user: { ...user, remaining_credits: user.remaining_credits + amount } });
      if (error) {
        console.error("Error adding credits to user:", error);
        throw new Error("Error adding credits to user");
      }
    } catch (error) {
      throw error;
    }
  },
  removeCredits: async (amount: number) => {
    const user = get().user;
    if (!user) return;
    try {
      const { error } = await supabase
        .from("users")
        .update({ remaining_credits: user.remaining_credits - amount })
        .eq("id", user.id);

      set({ user: { ...user, remaining_credits: user.remaining_credits - amount } });
      if (error) {
        console.error("Error removing credits from user:", error);
        throw new Error("Error removing credits from user");
      }
    } catch (error) {
      throw error;
    }
  },
}));
