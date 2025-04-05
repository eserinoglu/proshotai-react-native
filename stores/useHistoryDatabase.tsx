import { create } from "zustand";
import { GenerationHistory } from "../types/generationHistory";
import { createHistory, deleteHistory, getHistory, clearHistory } from "../database/historyDatabase";

type HistoryDatabase = {
  allHistory: GenerationHistory[];
  fetchHistory: () => Promise<void>;
  newHistory: (image: GenerationHistory) => Promise<void>;
  deleteAllHistory: () => Promise<void>;
  deleteHistoryByImage: (image: GenerationHistory) => Promise<void>;
};

export const useHistoryDatabase = create<HistoryDatabase>((set) => ({
  allHistory: [],
  fetchHistory: async () => {
    try {
      const history = await getHistory();
      set({ allHistory: history });
    } catch (error) {
      throw error;
    }
  },
  newHistory: async (image: GenerationHistory) => {
    try {
      const newHistory = await createHistory(image);
      if (newHistory) {
        set((state) => ({ allHistory: [newHistory, ...state.allHistory] }));
      }
    } catch (error) {
      throw error;
    }
  },
  deleteAllHistory: async () => {
    try {
      await clearHistory();
      set({ allHistory: [] });
    } catch (error) {
      throw error;
    }
  },
  deleteHistoryByImage: async (image) => {
    try {
      await deleteHistory(image);
      set((state) => ({
        allHistory: state.allHistory.filter((item) => item.imageUri !== image.imageUri),
      }));
    } catch (error) {
      throw error;
    }
  },
}));
