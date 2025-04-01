import Purchases, { LOG_LEVEL, PACKAGE_TYPE, PurchasesPackage } from "react-native-purchases";
import { Platform } from "react-native";

const iosKey = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY;

export const initRevenueCat = async () => {
  try {
    if (!iosKey) {
      throw new Error("RevenueCat key is not defined");
    }
    if (Platform.OS === "ios") {
      Purchases.configure({ apiKey: iosKey });
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      console.log("RevenueCat initialized for iOS");
    }
  } catch (error) {
    console.error("Error initializing RevenueCat:", error);
    throw new Error(error as string);
  }
};


export const purchaseCredit = async (pkg: PurchasesPackage) => {
  await Purchases.purchasePackage(pkg);
};
