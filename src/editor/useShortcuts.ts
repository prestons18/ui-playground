import { useEffect, useCallback, useState } from "react";
import { useEditorStore } from "./useEditorStore";

type ShortcutHandler = (e: KeyboardEvent) => void;

interface Shortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  description: string;
  handler: ShortcutHandler;
}

export function useShortcuts() {
  const {
    selectedComponent,
    removeComponent,
    clearSelection,
    undo,
    redo,
    canUndo,
    canRedo,
    components,
    updateComponent,
  } = useEditorStore();

  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  // Define all shortcuts
  const shortcuts: Shortcut[] = [
    {
      key: "Delete",
      description: "Delete selected component",
      handler: () => {
        if (selectedComponent) {
          removeComponent(selectedComponent.id);
        }
      },
    },
    {
      key: "Backspace",
      description: "Delete selected component",
      handler: () => {
        if (selectedComponent) {
          removeComponent(selectedComponent.id);
        }
      },
    },
    {
      key: "Escape",
      description: "Clear selection",
      handler: () => {
        clearSelection();
      },
    },
    {
      key: "z",
      ctrl: true,
      description: "Undo",
      handler: () => {
        if (canUndo()) {
          undo();
        }
      },
    },
    {
      key: "y",
      ctrl: true,
      description: "Redo",
      handler: () => {
        if (canRedo()) {
          redo();
        }
      },
    },
    {
      key: "z",
      ctrl: true,
      shift: true,
      description: "Redo",
      handler: () => {
        if (canRedo()) {
          redo();
        }
      },
    },
    {
      key: "ArrowUp",
      description: "Move component up",
      handler: () => {
        if (selectedComponent) {
          updateComponent({
            ...selectedComponent,
            y: selectedComponent.y - 1,
          });
        }
      },
    },
    {
      key: "ArrowDown",
      description: "Move component down",
      handler: () => {
        if (selectedComponent) {
          updateComponent({
            ...selectedComponent,
            y: selectedComponent.y + 1,
          });
        }
      },
    },
    {
      key: "ArrowLeft",
      description: "Move component left",
      handler: () => {
        if (selectedComponent) {
          updateComponent({
            ...selectedComponent,
            x: selectedComponent.x - 1,
          });
        }
      },
    },
    {
      key: "ArrowRight",
      description: "Move component right",
      handler: () => {
        if (selectedComponent) {
          updateComponent({
            ...selectedComponent,
            x: selectedComponent.x + 1,
          });
        }
      },
    },
    {
      key: "ArrowUp",
      shift: true,
      description: "Move component up by 10px",
      handler: () => {
        if (selectedComponent) {
          updateComponent({
            ...selectedComponent,
            y: selectedComponent.y - 10,
          });
        }
      },
    },
    {
      key: "ArrowDown",
      shift: true,
      description: "Move component down by 10px",
      handler: () => {
        if (selectedComponent) {
          updateComponent({
            ...selectedComponent,
            y: selectedComponent.y + 10,
          });
        }
      },
    },
    {
      key: "ArrowLeft",
      shift: true,
      description: "Move component left by 10px",
      handler: () => {
        if (selectedComponent) {
          updateComponent({
            ...selectedComponent,
            x: selectedComponent.x - 10,
          });
        }
      },
    },
    {
      key: "ArrowRight",
      shift: true,
      description: "Move component right by 10px",
      handler: () => {
        if (selectedComponent) {
          updateComponent({
            ...selectedComponent,
            x: selectedComponent.x + 10,
          });
        }
      },
    },
    {
      key: "l",
      ctrl: true,
      description: "Toggle lock on selected component",
      handler: () => {
        if (selectedComponent) {
          updateComponent({
            ...selectedComponent,
            locked: !selectedComponent.locked,
          });
        }
      },
    },
    {
      key: "h",
      ctrl: true,
      description: "Toggle visibility on selected component",
      handler: () => {
        if (selectedComponent) {
          updateComponent({
            ...selectedComponent,
            hidden: !selectedComponent.hidden,
          });
        }
      },
    },
    {
      key: "d",
      ctrl: true,
      description: "Duplicate selected component",
      handler: () => {
        if (selectedComponent) {
          const newComponent = {
            ...selectedComponent,
            id: crypto.randomUUID(),
            x: selectedComponent.x + 20,
            y: selectedComponent.y + 20,
          };
          useEditorStore.getState().addComponent(newComponent);
          useEditorStore.getState().selectComponent(newComponent);
        }
      },
    },
    {
      key: "/",
      description: "Show keyboard shortcuts",
      handler: (e) => {
        // Prevent browser's search functionality
        e.preventDefault();
        setShowShortcutsModal(true);
      },
    },
  ];

  // Check if a keyboard event matches a shortcut
  const matchesShortcut = useCallback(
    (e: KeyboardEvent, shortcut: Shortcut): boolean => {
      const keyMatches = e.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatches = !!shortcut.ctrl === e.ctrlKey;
      const shiftMatches = !!shortcut.shift === e.shiftKey;
      const altMatches = !!shortcut.alt === e.altKey;
      const metaMatches = !!shortcut.meta === e.metaKey;

      return (
        keyMatches && ctrlMatches && shiftMatches && altMatches && metaMatches
      );
    },
    []
  );

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts when typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Find and execute matching shortcut
      for (const shortcut of shortcuts) {
        if (matchesShortcut(e, shortcut)) {
          e.preventDefault();
          shortcut.handler(e);
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [matchesShortcut, shortcuts]);

  // Return shortcuts for documentation purposes
  return {
    shortcuts,
    showShortcutsModal,
    setShowShortcutsModal,
  };
}
