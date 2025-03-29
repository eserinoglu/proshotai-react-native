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
  // State to hold all history
  const [allHistory, setAllHistory] = useState<GenerationHistory[]>([]);
  // Functions to interact with the history database
  // Fetch all history from the database
  const fetchHistory = async () => {
    const history = await getHistory();
    setAllHistory(history);
  };
  // Add a new history entry to the database
  // This function is called when a new image is generated
  const newHistory = async (image: GenerationHistory) => {
    const newHistory = await createHistory(image);
    if (newHistory) {
      setAllHistory((prev) => [newHistory, ...prev]);
    }
  };
  // Delete all history from the database
  // This function is called when the user wants to clear all history
  const deleteAllHistory = async () => {
    await clearHistory();
    setAllHistory([]);
  };
  // Delete a specific history entry from the database
  // This function is called when the user wants to delete a specific image
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
