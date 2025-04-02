import { View, Text, Dimensions, TouchableOpacity, Touchable, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import BottomSheet from "./BottomSheet";
import { useRevenueCat } from "../stores/useRevenueCat";
import { PurchasesPackage } from "react-native-purchases";
import * as Haptics from "expo-haptics";
import { X } from "lucide-react-native";

export default function CustomPaywall() {
  const { showPaywall, setShowPaywall, offerings, getOfferings, purchase } = useRevenueCat();
  const [selectedPackage, setSelectedPackage] = React.useState<PurchasesPackage | null>(null);

  const offeringName = "credits";

  useEffect(() => {
    const fetchOfferings = async () => {
      await getOfferings();
    };
    fetchOfferings().then(() => setSelectedPackage(offerings[offeringName]?.availablePackages[0] || null));
  }, []);

  const [isPurchasing, setIsPurchasing] = React.useState(false);
  const handlePurchase = async () => {
    if (!selectedPackage) return;
    setIsPurchasing(true);
    try {
      await purchase(selectedPackage);
    } catch (error) {
      console.error("Purchase error:", error);
      // Handle purchase error
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <BottomSheet isVisible={showPaywall} setIsVisible={setShowPaywall} height={470}>
      <View className="flex flex-col gap-6 pt-6 px-horizontal">
        {/* Header */}
        <View className="w-full flex-row items-top justify-between">
          <Text className="text-3xl font-bold text-white flex-1">Continue generating product photos.</Text>
          <TouchableOpacity
            onPress={() => setShowPaywall(false)}
            className="rounded-full bg-white/5 w-[30px] aspect-square flex items-center justify-center"
          >
            <X size={16} color="white" />
          </TouchableOpacity>
        </View>
        {/* Packages */}
        <View className="w-full flex flex-col gap-2">
          {offerings &&
            offerings[offeringName]?.availablePackages.map((pkg) => (
              <PackageBox
                key={pkg.identifier}
                pkg={pkg}
                isSelected={selectedPackage?.identifier === pkg.identifier}
                onTap={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedPackage(pkg);
                }}
              />
            ))}
        </View>
        {/* Purchase Button */}
        <TouchableOpacity
          onPress={handlePurchase}
          disabled={!selectedPackage || isPurchasing}
          className="w-full h-[50px] rounded-2xl flex items-center justify-center bg-white"
        >
          {isPurchasing ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text className="text-[16px] font-bold text-black">PURCHASE</Text>
          )}
        </TouchableOpacity>
        {/* Footer Links and Restore Button */}
        <View className="w-full flex flex-row items-center">
          <Text className="text-white/40 flex-1 text-center text-[12px]">Privacy Policy</Text>
          <Text className="text-white/40 flex-1 text-center text-[12px]">Restore Purchase</Text>
          <Text className="text-white/40 flex-1 text-center text-[12px]">Terms</Text>
        </View>
      </View>
    </BottomSheet>
  );
}

function PackageBox({ pkg, isSelected, onTap }: { pkg: PurchasesPackage; isSelected: boolean; onTap: () => void }) {
  const pkgName = pkg.product.title;
  return (
    <TouchableOpacity
      onPress={onTap}
      style={{ opacity: isSelected ? 1 : 0.5, backgroundColor: isSelected ? "#FF9900" : "#1E1E1E" }}
      className="w-full flex flex-row relative items-center justify-between p-5 rounded-2xl border border-border"
    >
      {pkg.identifier === "100credits" && (
        <Text className="z-10 text-black font-semibold tracking-tight text-[10px] bg-white rounded-xl px-2 py-1 absolute -top-2 -right-1">
          BEST DEAL
        </Text>
      )}
      <View className="flex flex-col gap-2">
        <Text className="text-white text-[16px] font-semibold">{pkgName}</Text>
        <Text className="text-white opacity-80 text-[12px]">{pkg.product.description}</Text>
      </View>
      <Text className="text-[18px] font-semibold text-white">{pkg.product.priceString}</Text>
    </TouchableOpacity>
  );
}
