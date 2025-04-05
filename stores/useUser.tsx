import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import Purchases from "react-native-purchases";

type User = {
  id?: string;
  created_at: string;
  remaining_credits: number;
};

const baseUrl = "https://proshot-api.onrender.com";

type UserStore = {
  user: User | null;
  checkUser: () => Promise<void>;
  addCredits: (credits: number) => void;
  removeCredits: (credits: number) => void;
};

export const useUser = create<UserStore>((set, get) => ({
  user: null,
  checkUser: async () => {
    const userId = await SecureStore.getItemAsync("userId");
    if (userId) {
      const response = await fetch(`${baseUrl}/user/getUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      if (response.ok) {
        const user = await response.json();
        set({ user });
        Purchases.logIn(user.id);
      } else {
        console.error("Failed to fetch user data");
      }
    } else {
      const response = await fetch(`${baseUrl}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const user = await response.json();
        set({ user });
        Purchases.logIn(user.id);
        await SecureStore.setItemAsync("userId", user.id);
      } else {
        console.error("Failed to register user");
      }
    }
  },
  addCredits: (credits) => {
    const user = get().user;
    if (user) {
      set({ user: { ...user, remaining_credits: user.remaining_credits + credits } });
    }
  },
  removeCredits: (credits) => {
    const user = get().user;
    if (user) {
      set({ user: { ...user, remaining_credits: user.remaining_credits - credits } });
    }
  },
}));
