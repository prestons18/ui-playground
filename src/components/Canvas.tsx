import { ComponentState } from "./types";
import { useCallback, useEffect } from "react";
import { useCanvas } from "../editor/useCanvas";
import { useEditorStore } from "../editor/useEditorStore";
import { Sidebar } from "./Sidebar";
import { Toolbar } from "./Toolbar";
import { ComponentRenderer } from "./ComponentRenderer";
import { PropertiesPanel } from "./PropertiesPanel";
import { ContextMenu } from "./ContextMenu";

export default function Canvas() {
  const {
    components,
    selectedComponent,
    updateComponent,
    selectComponent,
    clearSelection,
    zoom,
    setZoom,
  } = useEditorStore();

  const {
    pan,
    isPanning,
    selectionBox,
    canvasRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    centerOnComponent,
    setPan,
  } = useCanvas(components);

  useEffect(() => {
    console.log("Canvas mounted with components:", components);
    return () => {
      console.log("Canvas unmounted");
    };
  }, [components]);

  useEffect(() => {
    console.log("Canvas state updated:", {
      components,
      selectedComponent,
      zoom,
      pan,
      isPanning,
      selectionBox,
    });
  }, [components, selectedComponent, zoom, pan, isPanning, selectionBox]);

  const handleZoomIn = useCallback(() => {
    console.log("Zooming in:", { currentZoom: zoom });
    const newZoom = Math.min(zoom * 1.1, 3);
    console.log("New zoom:", newZoom);
    setZoom(newZoom);
  }, [zoom, setZoom]);

  const handleZoomOut = useCallback(() => {
    console.log("Zooming out:", { currentZoom: zoom });
    const newZoom = Math.max(zoom / 1.1, 1);
    console.log("New zoom:", newZoom);
    setZoom(newZoom);
  }, [zoom, setZoom]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      console.log("Drop event:", {
        clientX: e.clientX,
        clientY: e.clientY,
        dataTransfer: e.dataTransfer.getData("text/plain"),
      });

      const componentType = e.dataTransfer.getData("text/plain");
      if (!componentType) {
        console.log("No component type in drop data");
        return;
      }

      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) {
        console.log("No canvas rect found");
        return;
      }

      const x = (e.clientX - rect.left) / zoom - pan.x;
      const y = (e.clientY - rect.top) / zoom - pan.y;

      console.log("Creating new component:", {
        type: componentType,
        x,
        y,
        zoom,
        pan,
      });

      const newComponent: ComponentState = {
        id: `${componentType}-${Date.now()}`,
        x,
        y,
        width: 100,
        height: 100,
        rotation: 0,
        backgroundColor: "#ffffff",
        borderRadius: 0,
        opacity: 1,
        locked: false,
        hidden: false,
        border: {
          width: 0,
          style: "solid",
          color: "#000000",
        },
        shadow: {
          x: 0,
          y: 0,
          blur: 0,
          spread: 0,
          color: "#000000",
        },
        componentType,
        componentProps: {},
      };

      updateComponent(newComponent);
      console.log("New component created:", newComponent);
    },
    [zoom, pan, updateComponent]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log("Drag over event:", {
      clientX: e.clientX,
      clientY: e.clientY,
    });
  }, []);

  console.log("Canvas rendering with:", {
    components,
    selectedComponent,
    zoom,
    pan,
  });

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Toolbar
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onCenter={() => {
            console.log("Centering canvas");
            setPan({ x: 0, y: 0 });
          }}
        />
        <div className="flex-1 flex">
          <div
            ref={canvasRef}
            className={`flex-1 relative overflow-hidden bg-gray-950 ${
              isPanning ? "cursor-grabbing" : ""
            }`}
            onMouseDown={(e) => {
              console.log("Canvas onMouseDown:", {
                button: e.button,
                target: e.target,
                isCanvas: e.target === canvasRef.current,
              });

              // Handle middle-click for panning
              if (e.button === 1) {
                console.log(
                  "Canvas: Middle click detected, calling handleMouseDown"
                );
                handleMouseDown(e);
                return;
              }

              // Only handle canvas background clicks
              if (e.target === canvasRef.current) {
                console.log("Canvas: Background click, clearing selection");
                clearSelection();
              }
              handleMouseDown(e);
            }}
            onMouseMove={(e) => {
              console.log("Canvas onMouseMove:", {
                isPanning,
                clientX: e.clientX,
                clientY: e.clientY,
              });
              handleMouseMove(e);
            }}
            onMouseUp={(e) => {
              console.log("Canvas onMouseUp");
              handleMouseUp();
            }}
            onWheel={(e) => handleWheel(e.nativeEvent)}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {/* Fixed-size canvas container */}
            <div
              className="absolute"
              style={{
                width: "5000px",
                height: "5000px",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                border: "1px solid purple", // Debug border
              }}
            >
              {/* Content container that transforms with pan */}
              <div
                className="absolute inset-0"
                style={{
                  transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                  transformOrigin: "center center", // Change transform origin to center
                  border: "1px solid red", // Debug border
                }}
              >
                {/* Grid background */}
                <div
                  className="absolute inset-0 grid-background pointer-events-none"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, #1f2937 1px, transparent 1px),
                      linear-gradient(to bottom, #1f2937 1px, transparent 1px)
                    `,
                    backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
                    border: "1px solid blue", // Debug border
                  }}
                />

                <ComponentRenderer
                  components={components}
                  selectedComponent={selectedComponent}
                  onSelectComponent={selectComponent}
                  onUpdateComponent={updateComponent}
                  zoom={zoom}
                  pan={pan}
                />
              </div>
            </div>

            {/* Pan position indicator */}
            <div className="absolute bottom-4 right-4 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-70">
              Pan: {Math.round(pan.x)}, {Math.round(pan.y)}
            </div>
          </div>
          <PropertiesPanel />
        </div>
      </div>
      <ContextMenu />
    </div>
  );
}
