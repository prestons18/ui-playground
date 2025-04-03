import { useEffect, useRef, useState } from "react";
import { useEditorStore } from "../editor/useEditorStore";
import {
  Copy,
  Trash2,
  Copy as Duplicate,
  ArrowUp as MoveUp,
  ArrowDown as MoveDown,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowUp as AlignTop,
  Minus as AlignMiddle,
  ArrowDown as AlignBottom,
} from "lucide-react";

type Position = { x: number; y: number };

export function ContextMenu() {
  const {
    components,
    selectedComponent,
    selectComponent,
    removeComponent,
    updateComponent,
    addComponent,
  } = useEditorStore();

  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [targetComponent, setTargetComponent] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle right-click on canvas
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();

      // Check if we clicked on a component
      const target = e.target as HTMLElement;
      const componentElement = target.closest(".draggable-component");

      if (componentElement) {
        const componentId = componentElement.getAttribute("data-component-id");
        if (componentId) {
          setTargetComponent(componentId);
          const component = components.find((c) => c.id === componentId);
          if (component) {
            selectComponent(component);
          }
        }
      } else {
        setTargetComponent(null);
      }

      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsVisible(false);
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("click", handleClick);
    };
  }, [components, selectComponent]);

  // Adjust position if menu would go off screen
  useEffect(() => {
    if (isVisible && menuRef.current) {
      const menu = menuRef.current;
      const rect = menu.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let newX = position.x;
      let newY = position.y;

      if (position.x + rect.width > windowWidth) {
        newX = windowWidth - rect.width;
      }

      if (position.y + rect.height > windowHeight) {
        newY = windowHeight - rect.height;
      }

      if (newX !== position.x || newY !== position.y) {
        setPosition({ x: newX, y: newY });
      }
    }
  }, [isVisible, position]);

  if (!isVisible) return null;

  const handleDuplicate = () => {
    if (targetComponent) {
      const component = components.find((c) => c.id === targetComponent);
      if (component) {
        const newComponent = {
          ...component,
          id: crypto.randomUUID(),
          x: component.x + 20,
          y: component.y + 20,
        };
        addComponent(newComponent);
        selectComponent(newComponent);
      }
    }
  };

  const handleDelete = () => {
    if (targetComponent) {
      removeComponent(targetComponent);
      setIsVisible(false);
    }
  };

  const handleToggleLock = () => {
    if (targetComponent && selectedComponent) {
      const updatedComponent = {
        ...selectedComponent,
        locked: !selectedComponent.locked,
      };
      updateComponent(updatedComponent);
    }
  };

  const handleToggleVisibility = () => {
    if (targetComponent && selectedComponent) {
      const updatedComponent = {
        ...selectedComponent,
        hidden: !selectedComponent.hidden,
      };
      updateComponent(updatedComponent);
    }
  };

  const handleAlign = (
    alignment: "left" | "center" | "right" | "top" | "middle" | "bottom"
  ) => {
    if (targetComponent && selectedComponent) {
      const updatedComponent = { ...selectedComponent };

      if (alignment === "left") {
        updatedComponent.x = 0;
      } else if (alignment === "center") {
        updatedComponent.x = (window.innerWidth - updatedComponent.width) / 2;
      } else if (alignment === "right") {
        updatedComponent.x = window.innerWidth - updatedComponent.width;
      } else if (alignment === "top") {
        updatedComponent.y = 0;
      } else if (alignment === "middle") {
        updatedComponent.y = (window.innerHeight - updatedComponent.height) / 2;
      } else if (alignment === "bottom") {
        updatedComponent.y = window.innerHeight - updatedComponent.height;
      }

      updateComponent(updatedComponent);
    }
  };

  const handleMoveLayer = (direction: "up" | "down") => {
    if (targetComponent) {
      const index = components.findIndex((c) => c.id === targetComponent);
      if (index === -1) return;

      const newIndex = direction === "up" ? index + 1 : index - 1;
      if (newIndex < 0 || newIndex >= components.length) return;

      // Swap components
      const newComponents = [...components];
      const temp = newComponents[index];
      newComponents[index] = newComponents[newIndex];
      newComponents[newIndex] = temp;

      // Update store with new order
      // This would require adding a method to the store to update all components at once
      // For now, we'll just log this action
      console.log(`Move ${direction}: ${targetComponent} to index ${newIndex}`);
    }
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[200px] bg-gray-800/95 rounded-lg shadow-xl border border-gray-700 overflow-hidden backdrop-blur-md"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="py-1">
        <button
          className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
          onClick={handleDuplicate}
        >
          <Duplicate size={16} className="text-blue-400" />
          Duplicate
        </button>

        <button
          className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
          onClick={handleToggleLock}
        >
          {selectedComponent?.locked ? (
            <>
              <Unlock size={16} className="text-green-400" />
              Unlock
            </>
          ) : (
            <>
              <Lock size={16} className="text-yellow-400" />
              Lock
            </>
          )}
        </button>

        <button
          className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
          onClick={handleToggleVisibility}
        >
          {selectedComponent?.hidden ? (
            <>
              <Eye size={16} className="text-purple-400" />
              Show
            </>
          ) : (
            <>
              <EyeOff size={16} className="text-gray-400" />
              Hide
            </>
          )}
        </button>

        <div className="border-t border-gray-700 my-1"></div>

        <div className="px-2 py-1">
          <div className="text-xs text-gray-500 px-2 py-1">Align</div>
          <div className="grid grid-cols-3 gap-1">
            <button
              className="p-1 rounded hover:bg-gray-700 flex items-center justify-center"
              onClick={() => handleAlign("left")}
              title="Align Left"
            >
              <AlignLeft size={16} className="text-gray-400" />
            </button>
            <button
              className="p-1 rounded hover:bg-gray-700 flex items-center justify-center"
              onClick={() => handleAlign("center")}
              title="Align Center"
            >
              <AlignCenter size={16} className="text-gray-400" />
            </button>
            <button
              className="p-1 rounded hover:bg-gray-700 flex items-center justify-center"
              onClick={() => handleAlign("right")}
              title="Align Right"
            >
              <AlignRight size={16} className="text-gray-400" />
            </button>
            <button
              className="p-1 rounded hover:bg-gray-700 flex items-center justify-center"
              onClick={() => handleAlign("top")}
              title="Align Top"
            >
              <AlignTop size={16} className="text-gray-400" />
            </button>
            <button
              className="p-1 rounded hover:bg-gray-700 flex items-center justify-center"
              onClick={() => handleAlign("middle")}
              title="Align Middle"
            >
              <AlignMiddle size={16} className="text-gray-400" />
            </button>
            <button
              className="p-1 rounded hover:bg-gray-700 flex items-center justify-center"
              onClick={() => handleAlign("bottom")}
              title="Align Bottom"
            >
              <AlignBottom size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="border-t border-gray-700 my-1"></div>

        <div className="px-2 py-1">
          <div className="text-xs text-gray-500 px-2 py-1">Layer</div>
          <div className="grid grid-cols-2 gap-1">
            <button
              className="p-1 rounded hover:bg-gray-700 flex items-center justify-center gap-1 text-sm text-gray-300"
              onClick={() => handleMoveLayer("up")}
            >
              <MoveUp size={16} className="text-gray-400" />
              <span>Up</span>
            </button>
            <button
              className="p-1 rounded hover:bg-gray-700 flex items-center justify-center gap-1 text-sm text-gray-300"
              onClick={() => handleMoveLayer("down")}
            >
              <MoveDown size={16} className="text-gray-400" />
              <span>Down</span>
            </button>
          </div>
        </div>

        <div className="border-t border-gray-700 my-1"></div>

        <button
          className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700 flex items-center gap-2"
          onClick={handleDelete}
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}
