import * as MediaLibrary from "expo-media-library";
import { Alert, Linking } from "react-native";

export const exportToGallery = async (imageUri: string) => {
  try {
    const { status, canAskAgain } = await MediaLibrary.getPermissionsAsync();

    if (status !== "granted") {
      if (!canAskAgain) {
        Alert.alert(
          "Permission Required",
          "You have denied access to the media library. Please enable permissions from settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ]
        );
        throw new Error("Media library access denied permanently.");
      }
      const { status: newStatus } = await MediaLibrary.requestPermissionsAsync();
      if (newStatus !== "granted") {
        throw new Error("Permission to access media library is required.");
      }
    }

    const asset = await MediaLibrary.createAssetAsync(imageUri);
    await MediaLibrary.createAlbumAsync("Generated", asset, false);
  } catch (error) {
    throw error;
  }
};
