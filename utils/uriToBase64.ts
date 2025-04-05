import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";

export const uriToBase64 = async (uri: string): Promise<string> => {
  try {
    const file = await FileSystem.getInfoAsync(uri);
    if (file.exists) {
      const resizedImage = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 512 } }], {
        compress: 0.1,
        format: ImageManipulator.SaveFormat.JPEG,
      });
      const base64String = await FileSystem.readAsStringAsync(resizedImage.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64String;
    } else {
      const base64String = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64String;
    }
  } catch (error) {
    throw error;
  }
};
