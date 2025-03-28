import * as FileSystem from "expo-file-system";

export async function base64ToUri(base64: string): Promise<string> {
  try {
    const uri = `${FileSystem.cacheDirectory}image.png`;
    await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
    return uri;
  } catch (error) {
    console.error("Error while converting base64 to uri.", error);
    throw new Error("Error while converting base64 to uri.");
  }
}
