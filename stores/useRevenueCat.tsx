import { create } from "zustand";
import Purchases, { PurchasesOffering, PurchasesPackage } from "react-native-purchases";

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
    if (!iosKey) {
      throw new Error("No RevenueCat key found");
    }
    try {
      Purchases.configure({ apiKey: iosKey });
    } catch (error) {
      throw error;
    }
  },
  offerings: {},
  purchase: async (pkg) => {
    try {
      console.log(pkg.product.identifier);
      const purchase = await Purchases.purchasePackage(pkg);
      const splitted = pkg.product.identifier.split(".");
      const creditBought = parseInt(splitted[1], 10);
      set({ showPaywall: false });
    } catch (error) {
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
