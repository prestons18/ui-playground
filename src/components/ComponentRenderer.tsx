import { ComponentState } from "./types";
import { DraggableComponent } from "./DraggableComponent";
import { useEffect } from "react";

interface ComponentRendererProps {
  components: ComponentState[];
  selectedComponent: ComponentState | null;
  onSelectComponent: (component: ComponentState) => void;
  onUpdateComponent: (component: ComponentState) => void;
  zoom: number;
  pan: { x: number; y: number };
}

export function ComponentRenderer({
  components,
  selectedComponent,
  onSelectComponent,
  onUpdateComponent,
  zoom,
  pan,
}: ComponentRendererProps) {
  useEffect(() => {
    console.log("ComponentRenderer mounted with components:", components);
    return () => {
      console.log("ComponentRenderer unmounted");
    };
  }, [components]);

  console.log("ComponentRenderer rendering with:", {
    components,
    selectedComponent,
    zoom,
    pan,
  });

  if (!components || components.length === 0) {
    console.log("No components to render");
    return null;
  }

  return (
    <div className="absolute inset-0">
      {components.map((component, index) => {
        console.log(`Rendering component ${index}:`, {
          id: component.id,
          type: component.componentType,
          props: component.componentProps,
          isSelected: component === selectedComponent,
        });
        return (
          <DraggableComponent
            key={component.id}
            component={component}
            isSelected={component === selectedComponent}
            onSelect={() => onSelectComponent(component)}
            onUpdate={onUpdateComponent}
            zoom={zoom}
          />
        );
      })}
    </div>
  );
}
