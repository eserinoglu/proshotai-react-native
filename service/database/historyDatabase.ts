import { GenerationHistory } from "@/types/generationHistory";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";

const db = SQLite.openDatabaseSync("history.db");

export const initHistoryDatabase = () => {
  try {
    db.runAsync(
      "CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY AUTOINCREMENT, base64 TEXT ,imageUri TEXT, presentationType TEXT, shotSize TEXT, backgroundType TEXT, userInput TEXT, createdAt TEXT)"
    );
    console.log("Database initialized");
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createHistory = async (history: GenerationHistory) => {
  try {
    db.runAsync(
      "INSERT INTO history (imageUri ,presentationType, shotSize, backgroundType, userInput, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
      [
        history.imageUri,
        history.presentationType,
        history.shotSize,
        history.backgroundType,
        history.userInput ?? null,
        history.createdAt,
      ]
    );
    console.log("History created");
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const clearHistory = async () => {
  try {
    const history: GenerationHistory[] = await db.getAllAsync("SELECT * FROM history");
    for (const item of history) {
      if (item.imageUri) {
        await FileSystem.deleteAsync(item.imageUri);
      }
    }
    await db.runAsync("DELETE FROM history");
    console.log("History cleared");
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteHistory = async (image: GenerationHistory) => {
  try {
    await FileSystem.deleteAsync(image.imageUri).then(async () => {
      await db.runAsync("DELETE FROM history WHERE imageUri = ?", [image.imageUri]);
    });
    console.log("History deleted", image.imageUri);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getHistory = async (): Promise<GenerationHistory[]> => {
  try {
    const history: GenerationHistory[] = await db.getAllAsync("SELECT * FROM history");
    return history;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
