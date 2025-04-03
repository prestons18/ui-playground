import { create } from "zustand";
import { ComponentState } from "../components/types";

// Initial component for testing
const initialComponent: ComponentState = {
  id: crypto.randomUUID(),
  x: 2400, // Center of 5000px canvas
  y: 2400, // Center of 5000px canvas
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
  componentType: "button",
  componentProps: {
    text: "Button",
  },
};

console.log("Initial component:", initialComponent);

interface EditorState {
  components: ComponentState[];
  selectedComponent: ComponentState | null;
  history: {
    past: ComponentState[][];
    future: ComponentState[][];
  };
  zoom: number;
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
  setZoom: (zoom: number) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  components: [initialComponent],
  selectedComponent: null,
  history: {
    past: [],
    future: [],
  },
  zoom: 1,
  selectComponent: (component) => {
    console.log("Selecting component:", component);
    set({ selectedComponent: component });
  },
  addComponent: (component) => {
    const { components, history } = get();
    console.log("Adding component:", component);
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
    console.log("Updating component:", component);
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
    console.log("Removing component:", id);
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
    const { components, history } = get();
    console.log("Reordering components:", newOrder);
    set({
      components: newOrder,
      history: {
        past: [...history.past, components],
        future: [],
      },
    });
  },
  undo: () => {
    const { components, history } = get();
    console.log("Undoing last action");
    if (history.past.length > 0) {
      const previousState = history.past[history.past.length - 1];
      set({
        components: previousState,
        history: {
          past: history.past.slice(0, -1),
          future: [components, ...history.future],
        },
      });
    }
  },
  redo: () => {
    const { components, history } = get();
    console.log("Redoing last undone action");
    if (history.future.length > 0) {
      const nextState = history.future[0];
      set({
        components: nextState,
        history: {
          past: [...history.past, components],
          future: history.future.slice(1),
        },
      });
    }
  },
  clearSelection: () => {
    console.log("Clearing selection");
    set({ selectedComponent: null });
  },
  canUndo: () => {
    const { history } = get();
    return history.past.length > 0;
  },
  canRedo: () => {
    const { history } = get();
    return history.future.length > 0;
  },
  setZoom: (zoom) => {
    console.log("Setting zoom:", zoom);
    set({ zoom });
  },
}));
