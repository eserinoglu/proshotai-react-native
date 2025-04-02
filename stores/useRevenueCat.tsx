import { create } from "zustand";
import Purchases, { PurchasesOffering, PurchasesPackage } from "react-native-purchases";
import { useSupabase } from "./useSupabase";

type RevenueCatStore = {
  showPaywall: boolean;
  setShowPaywall: (show: boolean) => void;
  offerings: { [key: string]: PurchasesOffering };
  purchase: (pkg: PurchasesPackage) => Promise<void>;
  getOfferings: () => Promise<void>;
  restore: () => Promise<void>;
};

export const useRevenueCat = create<RevenueCatStore>((set) => ({
  showPaywall: false,
  setShowPaywall: (show) => set({ showPaywall: show }),
  offerings: {},
  purchase: async (pkg) => {
    try {
      console.log(pkg.product.identifier);
      const purchase = await Purchases.purchasePackage(pkg);
      const splitted = pkg.product.identifier.split(".");
      const creditBought = parseInt(splitted[1], 10);
      await useSupabase.getState().addCredits(creditBought);
      set({ showPaywall: false });
      console.log("Purchase successful:", purchase);
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
      console.error("Error fetching offerings:", error);
      throw error;
    }
  },
  restore: async () => {
    try {
      const restoredPurchases = await Purchases.restorePurchases();
      console.log("Restored purchases:", restoredPurchases);
    } catch (error) {
      console.error("Error restoring purchases:", error);
      throw error;
    }
  },
}));
