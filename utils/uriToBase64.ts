import * as FileSystem from "expo-file-system";

export const uriToBase64 = async (uri: string): Promise<string> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error("Error converting URI to Base64", error);
    throw new Error("Error converting URI to Base64");
  }
};
