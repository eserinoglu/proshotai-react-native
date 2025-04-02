import * as FileSystem from "expo-file-system";

export async function base64ToUri(base64: string): Promise<string> {
  try {
    const filename = `${new Date().toISOString()}image.png`;
    const uri = `${FileSystem.documentDirectory}${filename}`;
    await FileSystem.writeAsStringAsync(uri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return uri;
  } catch (error) {
    throw error;
  }
}
