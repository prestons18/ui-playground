// please father forgive us

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
    zoom,
    setZoom,
  } = useEditorStore();

  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  useEffect(() => {
    console.log("useShortcuts mounted");
    console.log("Initial state:", {
      selectedComponent,
      components,
      showShortcutsModal,
    });
  }, []);

  useEffect(() => {
    console.log("Selected component updated:", selectedComponent);
  }, [selectedComponent]);

  useEffect(() => {
    console.log("Components updated:", components);
  }, [components]);

  // Define all shortcuts
  const shortcuts: Shortcut[] = [
    {
      key: "Delete",
      description: "Delete selected component",
      handler: () => {
        if (selectedComponent) {
          console.log("Deleting component:", selectedComponent);
          removeComponent(selectedComponent.id);
        }
      },
    },
    {
      key: "Backspace",
      description: "Delete selected component",
      handler: () => {
        if (selectedComponent) {
          console.log("Deleting component:", selectedComponent);
          removeComponent(selectedComponent.id);
        }
      },
    },
    {
      key: "Escape",
      description: "Clear selection",
      handler: () => {
        console.log("Clearing selection");
        clearSelection();
      },
    },
    {
      key: "z",
      ctrl: true,
      description: "Undo",
      handler: () => {
        if (canUndo()) {
          console.log("Undoing last action");
          undo();
        } else {
          console.log("Cannot undo - no actions in history");
        }
      },
    },
    {
      key: "y",
      ctrl: true,
      description: "Redo",
      handler: () => {
        if (canRedo()) {
          console.log("Redoing last undone action");
          redo();
        } else {
          console.log("Cannot redo - no actions to redo");
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
          console.log("Redoing last undone action");
          redo();
        } else {
          console.log("Cannot redo - no actions to redo");
        }
      },
    },
    {
      key: "ArrowUp",
      description: "Move component up",
      handler: () => {
        if (selectedComponent) {
          console.log("Moving component up by 1px");
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
          console.log("Moving component down by 1px");
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
          console.log("Moving component left by 1px");
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
          console.log("Moving component right by 1px");
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
          console.log("Moving component up by 10px");
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
          console.log("Moving component down by 10px");
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
          console.log("Moving component left by 10px");
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
          console.log("Moving component right by 10px");
          updateComponent({
            ...selectedComponent,
            x: selectedComponent.x + 10,
          });
        }
      },
    },
    {
      key: "ArrowUp",
      ctrl: true,
      description: "Move component up by 0.1px",
      handler: () => {
        if (selectedComponent) {
          console.log("Moving component up by 0.1px");
          updateComponent({
            ...selectedComponent,
            y: selectedComponent.y - 0.1,
          });
        }
      },
    },
    {
      key: "ArrowDown",
      ctrl: true,
      description: "Move component down by 0.1px",
      handler: () => {
        if (selectedComponent) {
          console.log("Moving component down by 0.1px");
          updateComponent({
            ...selectedComponent,
            y: selectedComponent.y + 0.1,
          });
        }
      },
    },
    {
      key: "ArrowLeft",
      ctrl: true,
      description: "Move component left by 0.1px",
      handler: () => {
        if (selectedComponent) {
          console.log("Moving component left by 0.1px");
          updateComponent({
            ...selectedComponent,
            x: selectedComponent.x - 0.1,
          });
        }
      },
    },
    {
      key: "ArrowRight",
      ctrl: true,
      description: "Move component right by 0.1px",
      handler: () => {
        if (selectedComponent) {
          console.log("Moving component right by 0.1px");
          updateComponent({
            ...selectedComponent,
            x: selectedComponent.x + 0.1,
          });
        }
      },
    },
    {
      key: "ArrowUp",
      ctrl: true,
      shift: true,
      description: "Move component up by 1px",
      handler: () => {
        if (selectedComponent) {
          console.log("Moving component up by 1px");
          updateComponent({
            ...selectedComponent,
            y: selectedComponent.y - 1,
          });
        }
      },
    },
    {
      key: "ArrowDown",
      ctrl: true,
      shift: true,
      description: "Move component down by 1px",
      handler: () => {
        if (selectedComponent) {
          console.log("Moving component down by 1px");
          updateComponent({
            ...selectedComponent,
            y: selectedComponent.y + 1,
          });
        }
      },
    },
    {
      key: "ArrowLeft",
      ctrl: true,
      shift: true,
      description: "Move component left by 1px",
      handler: () => {
        if (selectedComponent) {
          console.log("Moving component left by 1px");
          updateComponent({
            ...selectedComponent,
            x: selectedComponent.x - 1,
          });
        }
      },
    },
    {
      key: "ArrowRight",
      ctrl: true,
      shift: true,
      description: "Move component right by 1px",
      handler: () => {
        if (selectedComponent) {
          console.log("Moving component right by 1px");
          updateComponent({
            ...selectedComponent,
            x: selectedComponent.x + 1,
          });
        }
      },
    },
    {
      key: "r",
      ctrl: true,
      description: "Rotate component by 5 degrees",
      handler: () => {
        if (selectedComponent) {
          console.log("Rotating component by 5 degrees");
          updateComponent({
            ...selectedComponent,
            rotation: selectedComponent.rotation + 5,
          });
        }
      },
    },
    {
      key: "r",
      ctrl: true,
      shift: true,
      description: "Rotate component by -5 degrees",
      handler: () => {
        if (selectedComponent) {
          console.log("Rotating component by -5 degrees");
          updateComponent({
            ...selectedComponent,
            rotation: selectedComponent.rotation - 5,
          });
        }
      },
    },
    {
      key: "r",
      ctrl: true,
      alt: true,
      description: "Reset component rotation",
      handler: () => {
        if (selectedComponent) {
          console.log("Resetting component rotation");
          updateComponent({
            ...selectedComponent,
            rotation: 0,
          });
        }
      },
    },
    {
      key: "l",
      ctrl: true,
      description: "Toggle component lock",
      handler: () => {
        if (selectedComponent) {
          console.log("Toggling component lock");
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
      description: "Toggle component visibility",
      handler: () => {
        if (selectedComponent) {
          console.log("Toggling component visibility");
          updateComponent({
            ...selectedComponent,
            hidden: !selectedComponent.hidden,
          });
        }
      },
    },
    {
      key: "c",
      ctrl: true,
      description: "Copy component",
      handler: () => {
        if (selectedComponent) {
          console.log("Copying component");
          const newComponent = {
            ...selectedComponent,
            id: crypto.randomUUID(),
            x: selectedComponent.x + 20,
            y: selectedComponent.y + 20,
          };
          useEditorStore.getState().addComponent(newComponent);
        }
      },
    },
    {
      key: "x",
      ctrl: true,
      description: "Cut component",
      handler: () => {
        if (selectedComponent) {
          console.log("Cutting component");
          const newComponent = {
            ...selectedComponent,
            id: crypto.randomUUID(),
            x: selectedComponent.x + 20,
            y: selectedComponent.y + 20,
          };
          useEditorStore.getState().addComponent(newComponent);
          useEditorStore.getState().removeComponent(selectedComponent.id);
        }
      },
    },
    {
      key: "v",
      ctrl: true,
      description: "Paste component",
      handler: () => {
        if (selectedComponent) {
          console.log("Pasting component");
          const newComponent = {
            ...selectedComponent,
            id: crypto.randomUUID(),
            x: selectedComponent.x + 20,
            y: selectedComponent.y + 20,
          };
          useEditorStore.getState().addComponent(newComponent);
        }
      },
    },
    {
      key: "?",
      description: "Show shortcuts",
      handler: () => {
        console.log("Showing shortcuts modal");
        setShowShortcutsModal(true);
      },
    },
  ];

  // Function to check if a keyboard event matches a shortcut
  const matchesShortcut = useCallback(
    (e: KeyboardEvent, shortcut: Shortcut) => {
      const matches =
        e.key.toLowerCase() === shortcut.key.toLowerCase() &&
        !!shortcut.ctrl === e.ctrlKey &&
        !!shortcut.shift === e.shiftKey &&
        !!shortcut.alt === e.altKey &&
        !!shortcut.meta === e.metaKey;

      if (matches) {
        console.log("Shortcut matched:", {
          key: e.key,
          ctrl: e.ctrlKey,
          shift: e.shiftKey,
          alt: e.altKey,
          meta: e.metaKey,
          shortcut,
        });
      }

      return matches;
    },
    []
  );

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log("Key pressed:", {
        key: e.key,
        ctrl: e.ctrlKey,
        shift: e.shiftKey,
        alt: e.altKey,
        meta: e.metaKey,
      });

      // Ignore keyboard events when typing in input fields
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        console.log("Ignoring keyboard event - input field focused");
        return;
      }

      for (const shortcut of shortcuts) {
        if (matchesShortcut(e, shortcut)) {
          console.log("Executing shortcut:", shortcut);
          shortcut.handler(e);
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    console.log("Keyboard event listener added");

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      console.log("Keyboard event listener removed");
    };
  }, [shortcuts, matchesShortcut]);

  // Handle wheel events for zooming
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Only handle wheel events when Ctrl key is pressed
      if (e.ctrlKey) {
        e.preventDefault();

        // Get the current zoom level from the editor store
        const currentZoom = useEditorStore.getState().zoom || 1;

        // Calculate new zoom level based on wheel direction
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.min(Math.max(currentZoom * delta, 1), 3);

        console.log("Zooming with Ctrl+wheel:", {
          deltaY: e.deltaY,
          currentZoom,
          newZoom,
        });

        // Update zoom level in the editor store
        useEditorStore.getState().setZoom(newZoom);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    console.log("Wheel event listener added");

    return () => {
      window.removeEventListener("wheel", handleWheel);
      console.log("Wheel event listener removed");
    };
  }, []);

  return {
    shortcuts,
    showShortcutsModal,
    setShowShortcutsModal,
  };
}
