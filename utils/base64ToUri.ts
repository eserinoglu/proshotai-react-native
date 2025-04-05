import * as FileSystem from "expo-file-system";

export async function base64ToUri(base64: string): Promise<string> {
  try {
    const filename = `${new Date().toISOString()}.jpg`;
    const uri = `${FileSystem.documentDirectory}${filename}`;

    // "file://" prefix'ini eklememiz gerek
    const fileUri = uri.startsWith("file://") ? uri : `file://${uri}`;

    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return fileUri;
  } catch (error) {
    throw error;
  }
}
