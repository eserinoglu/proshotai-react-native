import { getHistory, clearHistory, deleteHistory, createHistory } from "@/service/database/historyDatabase";
import { GenerationHistory } from "@/types/generationHistory";
import { createContext, useContext, useState } from "react";

interface HistoryDatabaseContextProps {
  allHistory: GenerationHistory[];
  fetchHistory: () => Promise<void>;
  newHistory: (image: GenerationHistory) => Promise<void>;
  deleteAllHistory: () => Promise<void>;
  deleteHistoryByImage: (image: GenerationHistory) => Promise<void>;
}

export const HistoryDatabaseContext = createContext<HistoryDatabaseContextProps>({
  allHistory: [],
  fetchHistory: async () => {},
  newHistory: async () => {},
  deleteAllHistory: async () => {},
  deleteHistoryByImage: async () => {},
});

interface HistoryDatabaseProviderProps {
  children: React.ReactNode;
}

export const HistoryDatabaseProvider = ({ children }: HistoryDatabaseProviderProps) => {
  const [allHistory, setAllHistory] = useState<GenerationHistory[]>([]);
  const fetchHistory = async () => {
    const history = await getHistory();
    setAllHistory(history);
  };
  const newHistory = async (image: GenerationHistory) => {
    const newHistory = await createHistory(image);
    if (newHistory) {
      setAllHistory((prev) => [newHistory, ...prev]);
    }
  };
  const deleteAllHistory = async () => {
    await clearHistory();
    setAllHistory([]);
  };
  const deleteHistoryByImage = async (image: GenerationHistory) => {
    await deleteHistory(image);
    setAllHistory((prev) => prev.filter((item) => item.imageUri !== image.imageUri));
  };

  return (
    <HistoryDatabaseContext.Provider
      value={{ allHistory, fetchHistory, newHistory, deleteAllHistory, deleteHistoryByImage }}
    >
      {children}
    </HistoryDatabaseContext.Provider>
  );
};

export const useHistoryDatabase = () => {
  const context = useContext(HistoryDatabaseContext);
  if (!context) {
    throw new Error("useHistoryDatabase must be used within a HistoryDatabaseProvider");
  }
  return context;
};
