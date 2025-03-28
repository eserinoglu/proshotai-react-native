import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

export const exportToGallery = async (imageBase64: string) => {
  try {
    if (MediaLibrary.PermissionStatus.DENIED || MediaLibrary.PermissionStatus.UNDETERMINED) {
      await MediaLibrary.requestPermissionsAsync();
    }
    // Base64 verisini cihazın geçici dosya dizinine kaydet
    const fileUri = FileSystem.cacheDirectory + `photo_${Date.now()}.png`;
    await FileSystem.writeAsStringAsync(fileUri, imageBase64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Dosyayı galeriye ekle
    const asset = await MediaLibrary.createAssetAsync(fileUri);
    await MediaLibrary.createAlbumAsync("ProductPhoto", asset, false);

    return asset;
  } catch (error) {
    console.error("Fotoğrafı kaydederken hata oluştu:", error);
    return null;
  }
};
