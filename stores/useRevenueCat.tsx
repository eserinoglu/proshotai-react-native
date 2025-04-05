import { create } from "zustand";
import Purchases, { PurchasesOffering, PurchasesPackage } from "react-native-purchases";
import { useUser } from "./useUser";

type RevenueCatStore = {
  showPaywall: boolean;
  setShowPaywall: (show: boolean) => void;
  initRevenueCat: () => Promise<void>;
  offerings: { [key: string]: PurchasesOffering };
  purchase: (pkg: PurchasesPackage) => Promise<void>;
  getOfferings: () => Promise<void>;
  restore: () => Promise<void>;
};

const iosKey = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY;

export const useRevenueCat = create<RevenueCatStore>((set) => ({
  showPaywall: false,
  setShowPaywall: (show) => set({ showPaywall: show }),
  initRevenueCat: async () => {
    const user = useUser.getState().user;
    if (!iosKey || !user) {
      throw new Error("No RevenueCat key found");
    }
    try {
      Purchases.configure({ apiKey: iosKey, appUserID: user.id });
    } catch (error) {
      throw error;
    }
  },
  offerings: {},
  purchase: async (pkg) => {
    try {
      await Purchases.purchasePackage(pkg);
      let creditBought = 0;
      switch (pkg.product.identifier) {
        case "rc.20credits":
          creditBought = 20;
          break;
        case "rc.50credits":
          creditBought = 50;
          break;
        case "rc.100credits":
          creditBought = 100;
          break;
      }
      useUser.getState().addCredits(creditBought);
      set({ showPaywall: false });
    } catch (error) {
      console.error("Error purchasing package:", error);
      throw error;
    }
  },
  getOfferings: async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null) {
        set({ offerings: offerings.all });
      }
    } catch (error) {
      throw error;
    }
  },
  restore: async () => {
    try {
      const _ = await Purchases.restorePurchases();
    } catch (error) {
      throw error;
    }
  },
}));
