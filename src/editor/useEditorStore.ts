import { create } from "zustand";
import { ComponentState } from "../components/types";

// Initial component for testing
const initialComponent: ComponentState = {
  id: crypto.randomUUID(),
  x: 100,
  y: 100,
  width: 200,
  height: 100,
  rotation: 0,
  backgroundColor: "#3b82f6",
  borderRadius: 8,
  opacity: 1,
  locked: false,
  hidden: false,
  border: {
    width: 0,
    color: "#000000",
    style: "solid",
  },
  shadow: {
    color: "rgba(0, 0, 0, 0.2)",
    blur: 10,
    spread: 0,
    x: 0,
    y: 4,
  },
};

interface EditorState {
  components: ComponentState[];
  selectedComponent: ComponentState | null;
  history: {
    past: ComponentState[][];
    future: ComponentState[][];
  };
  selectComponent: (component: ComponentState | null) => void;
  addComponent: (component: ComponentState) => void;
  updateComponent: (component: ComponentState) => void;
  removeComponent: (id: string) => void;
  reorderComponents: (newOrder: ComponentState[]) => void;
  undo: () => void;
  redo: () => void;
  clearSelection: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  components: [initialComponent],
  selectedComponent: null,
  history: {
    past: [],
    future: [],
  },
  selectComponent: (component) => {
    set({ selectedComponent: component });
  },
  addComponent: (component) => {
    const { components, history } = get();
    const newComponents = [...components, component];
    set({
      components: newComponents,
      history: {
        past: [...history.past, components],
        future: [],
      },
    });
  },
  updateComponent: (component) => {
    const { components, history } = get();
    const newComponents = components.map((c) =>
      c.id === component.id ? component : c
    );
    set({
      components: newComponents,
      history: {
        past: [...history.past, components],
        future: [],
      },
    });
  },
  removeComponent: (id) => {
    const { components, history, selectedComponent } = get();
    const newComponents = components.filter((c) => c.id !== id);
    set({
      components: newComponents,
      selectedComponent:
        selectedComponent?.id === id ? null : selectedComponent,
      history: {
        past: [...history.past, components],
        future: [],
      },
    });
  },
  reorderComponents: (newOrder) => {
    const { history } = get();
    set({
      components: newOrder,
      history: {
        past: [...history.past, get().components],
        future: [],
      },
    });
  },
  undo: () => {
    const { components, history } = get();
    if (history.past.length === 0) return;

    const previousState = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, -1);

    set({
      components: previousState,
      history: {
        past: newPast,
        future: [components, ...history.future],
      },
    });
  },
  redo: () => {
    const { components, history } = get();
    if (history.future.length === 0) return;

    const nextState = history.future[0];
    const newFuture = history.future.slice(1);

    set({
      components: nextState,
      history: {
        past: [...history.past, components],
        future: newFuture,
      },
    });
  },
  clearSelection: () => {
    set({ selectedComponent: null });
  },
  canUndo: () => get().history.past.length > 0,
  canRedo: () => get().history.future.length > 0,
}));
