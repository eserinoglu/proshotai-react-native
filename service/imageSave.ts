import * as MediaLibrary from "expo-media-library";

export const exportToGallery = async (imageUri: string) => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      await MediaLibrary.requestPermissionsAsync();
    }
    const asset = await MediaLibrary.createAssetAsync(imageUri);
    await MediaLibrary.createAlbumAsync("Generated", asset, false);
  } catch (error) {
    throw error;
  }
};
