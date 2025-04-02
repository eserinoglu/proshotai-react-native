import { create } from "zustand";

type ErrorStore = {
  errorMessage: string | null;
  onRetry: (() => void) | null;
  setErrorMessage: (message: string | null, onRetry?: (() => void) | null) => void;
};

export const useError = create<ErrorStore>((set) => ({
  errorMessage: null,
  onRetry: null,
  setErrorMessage: (message, onRetry = null) =>
    set({
      errorMessage: message,
      onRetry: onRetry,
    }),
}));