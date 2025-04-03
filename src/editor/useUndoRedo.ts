import { useState, useCallback } from "react";
import { ComponentState } from "../components/types";

export function useUndoRedo(initialState: ComponentState) {
  const [history, setHistory] = useState<ComponentState[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const pushState = useCallback(
    (newState: ComponentState) => {
      setHistory((prev) => [...prev.slice(0, currentIndex + 1), newState]);
      setCurrentIndex((prev) => prev + 1);
    },
    [currentIndex]
  );

  const undo = useCallback(() => {
    if (canUndo) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [canUndo]);

  const redo = useCallback(() => {
    if (canRedo) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [canRedo]);

  return {
    currentState: history[currentIndex],
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
