import { create } from "zustand";
import { GenerationHistory } from "../types/generationHistory";
import { createHistory, deleteHistory, getHistory, clearHistory } from "../service/database/historyDatabase";

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
    const history = await getHistory();
    set({ allHistory: history });
  },
  newHistory: async (image: GenerationHistory) => {
    const newHistory = await createHistory(image);
    if (newHistory) {
      set((state) => ({ allHistory: [newHistory, ...state.allHistory] }));
    }
  },
  deleteAllHistory: async () => {
    await clearHistory();
    set({ allHistory: [] });
  },
  deleteHistoryByImage: async (image) => {
    await deleteHistory(image);
    set((state) => ({
      allHistory: state.allHistory.filter((item) => item.imageUri !== image.imageUri),
    }));
  },
}));
