import { Rnd } from "react-rnd";
import { ComponentState } from "./types";
import { componentRegistry } from "../utils/componentRegistry";
import { ComponentDefinition } from "../utils/componentRegistry";

interface DraggableComponentProps {
  component: ComponentState;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (component: ComponentState) => void;
  zoom: number;
}

// Component renderers for different component types
const renderComponent = (component: ComponentState) => {
  if (!component.componentType) {
    return <div className="text-center">Component</div>;
  }

  // Get the component definition from the registry
  const componentDef = componentRegistry
    .getAllComponents()
    .find((c) => c.id === component.componentType);

  if (!componentDef) {
    return <div className="text-center">Unknown Component</div>;
  }

  // Render based on component type
  switch (component.componentType) {
    case "button":
      return (
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {component.componentProps?.text || "Button"}
        </button>
      );
    case "input":
      return (
        <input
          type={component.componentProps?.type || "text"}
          placeholder={component.componentProps?.placeholder || "Input"}
          className="w-full h-full px-3 py-2 border rounded"
        />
      );
    case "container":
      return (
        <div
          className="w-full h-full border border-dashed border-gray-300 flex items-center justify-center"
          style={{
            maxWidth: component.componentProps?.maxWidth || "100%",
            padding: component.componentProps?.padding || "0",
          }}
        >
          Container
        </div>
      );
    default:
      return <div className="text-center">{componentDef.name}</div>;
  }
};

export function DraggableComponent({
  component,
  isSelected,
  onSelect,
  onUpdate,
  zoom,
}: DraggableComponentProps) {
  return (
    <Rnd
      position={{ x: component.x * zoom, y: component.y * zoom }}
      size={{ width: component.width * zoom, height: component.height * zoom }}
      onDragStart={() => {
        if (!isSelected) {
          onSelect();
        }
      }}
      onDragStop={(e, d) => {
        onUpdate({
          ...component,
          x: d.x / zoom,
          y: d.y / zoom,
        });
      }}
      onResizeStart={() => {
        if (!isSelected) {
          onSelect();
        }
      }}
      onResize={(e, direction, ref, delta, position) => {
        // This is intentionally empty to prevent updates during resize
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        onUpdate({
          ...component,
          x: position.x / zoom,
          y: position.y / zoom,
          width: ref.offsetWidth / zoom,
          height: ref.offsetHeight / zoom,
        });
      }}
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
      style={{
        backgroundColor: component.backgroundColor,
        borderRadius: component.borderRadius,
        opacity: component.opacity,
        transform: `rotate(${component.rotation}deg)`,
        boxShadow: `${component.shadow.x}px ${component.shadow.y}px ${component.shadow.blur}px ${component.shadow.spread}px ${component.shadow.color}`,
        border: `${component.border.width}px ${component.border.style} ${component.border.color}`,
      }}
      className={`rounded-lg flex items-center justify-center relative
        ${isSelected ? "ring-2 ring-blue-500" : ""} draggable-component ${
        isSelected ? "selected" : ""
      }`}
      data-component-id={component.id}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {renderComponent(component)}
      </div>

      {/* Selection Controls */}
      {isSelected && (
        <>
          {/* Corner Handles */}
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-nw-resize pointer-events-auto" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-ne-resize pointer-events-auto" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-sw-resize pointer-events-auto" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-se-resize pointer-events-auto" />

          {/* Edge Handles */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-n-resize pointer-events-auto" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-s-resize pointer-events-auto" />
          <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-w-resize pointer-events-auto" />
          <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-e-resize pointer-events-auto" />
        </>
      )}
    </Rnd>
  );
}
