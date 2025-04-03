import { Rnd } from "react-rnd";
import { ComponentState } from "./types";
import { componentRegistry } from "../utils/componentRegistry";
import { ComponentDefinition } from "../utils/componentRegistry";
import { useEffect } from "react";

interface DraggableComponentProps {
  component: ComponentState;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (component: ComponentState) => void;
  zoom: number;
}

// Component renderers for different component types
const renderComponent = (component: ComponentState) => {
  try {
    console.log("Rendering component:", component);

    if (!component.componentType) {
      console.log("No componentType specified");
      return <div className="text-center">Component</div>;
    }

    // Get the component definition from the registry
    const componentDef = componentRegistry
      .getAllComponents()
      .find((c) => c.id === component.componentType);

    console.log("Component definition:", componentDef);

    if (!componentDef) {
      console.log("Component definition not found");
      return <div className="text-center">Unknown Component</div>;
    }

    // Get the actual React component from the registry
    const ReactComponent = componentRegistry.getComponent(
      component.componentType
    );

    console.log("React component:", ReactComponent);

    if (!ReactComponent) {
      console.log("React component not found in registry");
      return <div className="text-center">{componentDef.name}</div>;
    }

    // Render the component with its props
    console.log("Rendering with props:", component.componentProps);
    return <ReactComponent {...component.componentProps} />;
  } catch (error) {
    console.error("Error rendering component:", error);
    return <div className="text-center">Error</div>;
  }
};

export function DraggableComponent({
  component,
  isSelected,
  onSelect,
  onUpdate,
  zoom,
}: DraggableComponentProps) {
  useEffect(() => {
    console.log("DraggableComponent mounted:", {
      id: component.id,
      type: component.componentType,
      props: component.componentProps,
    });
    return () => {
      console.log("DraggableComponent unmounted:", component.id);
    };
  }, [component]);

  console.log("DraggableComponent rendering:", {
    id: component.id,
    type: component.componentType,
    props: component.componentProps,
    isSelected,
  });

  return (
    <Rnd
      size={{
        width: component.width,
        height: component.height,
      }}
      position={{
        x: component.x,
        y: component.y,
      }}
      onDragStop={(e, d) => {
        console.log("Component dragged:", {
          id: component.id,
          newX: d.x,
          newY: d.y,
        });
        onUpdate({
          ...component,
          x: d.x,
          y: d.y,
        });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        console.log("Component resized:", {
          id: component.id,
          newWidth: ref.offsetWidth,
          newHeight: ref.offsetHeight,
          newX: position.x,
          newY: position.y,
        });
        onUpdate({
          ...component,
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          x: position.x,
          y: position.y,
        });
      }}
      style={{
        opacity: component.opacity,
        backgroundColor: component.backgroundColor,
        borderRadius: component.borderRadius,
        border: `${component.border.width}px ${component.border.style} ${component.border.color}`,
        boxShadow: `${component.shadow.x}px ${component.shadow.y}px ${component.shadow.blur}px ${component.shadow.spread}px ${component.shadow.color}`,
        transform: `rotate(${component.rotation}deg)`,
        display: component.hidden ? "none" : "block",
        cursor: component.locked ? "not-allowed" : "move",
        outline: "2px solid green",
      }}
      onClick={(e: React.MouseEvent) => {
        console.log("Component clicked:", {
          id: component.id,
          type: component.componentType,
        });
        e.stopPropagation();
        onSelect();
      }}
      disableDragging={component.locked}
      enableResizing={!component.locked}
      scale={zoom}
    >
      {renderComponent(component)}
    </Rnd>
  );
}
