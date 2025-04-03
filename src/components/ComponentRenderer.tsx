import { ComponentState } from "./types";
import { DraggableComponent } from "./DraggableComponent";

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
  return (
    <div
      className="absolute inset-0 grid-background"
      style={{
        transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
        transformOrigin: "0 0",
      }}
    >
      {components.map((component, index) => (
        <DraggableComponent
          key={index}
          component={component}
          isSelected={component === selectedComponent}
          onSelect={() => onSelectComponent(component)}
          onUpdate={onUpdateComponent}
          zoom={zoom}
        />
      ))}
    </div>
  );
}
