import { GenerationHistory } from "@/types/generationHistory";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("history.db");

export const initHistoryDatabase = () => {
  try {
    db.runAsync(
      "CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY AUTOINCREMENT, imageUri TEXT, presentationType TEXT, shotSize TEXT, backgroundType TEXT, userInput TEXT, createdAt TEXT)"
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
      "INSERT INTO history (imageUri, presentationType, shotSize, backgroundType, userInput, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
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

export const getHistory = async (): Promise<GenerationHistory[]> => {
  try {
    const history: GenerationHistory[] = await db.getAllAsync("SELECT * FROM history");
    return history;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
