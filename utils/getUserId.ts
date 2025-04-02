import uuid from "react-native-uuid";
import * as SecureStore from "expo-secure-store";

export const getUserId = async (): Promise<string> => {
  try {
    let userId = await SecureStore.getItemAsync("userId");
    if (!userId) {
      userId = uuid.v4();
      await SecureStore.setItemAsync("userId", userId);
    }
    return userId;
  } catch (error) {
    throw error
  }
};
