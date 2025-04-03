import { ComponentState } from "./types";
import { useCallback } from "react";
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
  } = useEditorStore();

  const {
    pan,
    zoom,
    setZoom,
    isPanning,
    selectionBox,
    canvasRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    centerOnComponent,
  } = useCanvas();

  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(zoom * 1.1, 3);
    setZoom(newZoom);
  }, [zoom, setZoom]);

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(zoom / 1.1, 1);
    setZoom(newZoom);
  }, [zoom, setZoom]);

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Toolbar
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onCenter={() => centerOnComponent(selectedComponent || components[0])}
        />
        <div className="flex-1 flex">
          <div
            ref={canvasRef}
            className="flex-1 relative overflow-hidden bg-gray-950"
            onMouseDown={(e) => {
              // Only handle canvas background clicks
              if (e.target === canvasRef.current) {
                clearSelection();
              }
              handleMouseDown(e);
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={(e) => handleWheel(e.nativeEvent)}
            style={{
              backgroundImage: `
                linear-gradient(to right, #1f2937 1px, transparent 1px),
                linear-gradient(to bottom, #1f2937 1px, transparent 1px)
              `,
              backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            }}
          >
            <ComponentRenderer
              components={components}
              selectedComponent={selectedComponent}
              onSelectComponent={selectComponent}
              onUpdateComponent={updateComponent}
              zoom={zoom}
              pan={pan}
            />
          </div>
          <PropertiesPanel />
        </div>
      </div>
      <ContextMenu />
    </div>
  );
}
