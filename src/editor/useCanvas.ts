import { useState, useCallback, useRef, useEffect } from "react";
import { ComponentState } from "../components/types";
import { useEditorStore } from "./useEditorStore";

export const GRID_SIZE = 20;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

interface SelectionBox {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isSelecting: boolean;
}

export function useCanvas(components: ComponentState[]) {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const { zoom, setZoom } = useEditorStore();
  const [isPanning, setIsPanning] = useState(false);
  const [selectionBox, setSelectionBox] = useState<SelectionBox>({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    isSelecting: false,
  });
  const lastPanPosition = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("useCanvas mounted with components:", components);
    return () => {
      console.log("useCanvas unmounted");
    };
  }, [components]);

  useEffect(() => {
    console.log("Canvas state updated:", {
      pan,
      zoom,
      isPanning,
      selectionBox,
      componentsCount: components.length,
    });
  }, [pan, zoom, isPanning, selectionBox, components]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      console.log("useCanvas handleMouseDown:", {
        button: e.button,
        target: e.target,
        clientX: e.clientX,
        clientY: e.clientY,
      });

      // Middle mouse button (button 1) for panning
      if (e.button === 1) {
        console.log("Middle mouse button pressed, starting pan");
        setIsPanning(true);
        lastPanPosition.current = { x: e.clientX, y: e.clientY };
        e.preventDefault();
        return;
      }

      // Left mouse button (button 0) for selection
      if (e.button === 0) {
        console.log("Left mouse button pressed, starting selection");
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          const startX = (e.clientX - rect.left) / zoom - pan.x;
          const startY = (e.clientY - rect.top) / zoom - pan.y;
          console.log("Selection start position:", { startX, startY });
          setSelectionBox({
            startX,
            startY,
            endX: startX,
            endY: startY,
            isSelecting: true,
          });
        }
      }
    },
    [zoom, pan]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        console.log("Panning canvas:", {
          clientX: e.clientX,
          clientY: e.clientY,
          lastX: lastPanPosition.current.x,
          lastY: lastPanPosition.current.y,
        });
        const deltaX = e.clientX - lastPanPosition.current.x;
        const deltaY = e.clientY - lastPanPosition.current.y;
        setPan({
          x: pan.x + deltaX / zoom,
          y: pan.y + deltaY / zoom,
        });
        lastPanPosition.current = { x: e.clientX, y: e.clientY };
      } else if (selectionBox.isSelecting) {
        console.log("Updating selection box:", {
          clientX: e.clientX,
          clientY: e.clientY,
        });
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          const endX = (e.clientX - rect.left) / zoom - pan.x;
          const endY = (e.clientY - rect.top) / zoom - pan.y;
          setSelectionBox({
            ...selectionBox,
            endX,
            endY,
          });
        }
      }
    },
    [isPanning, pan, zoom, selectionBox]
  );

  const handleMouseUp = useCallback(() => {
    console.log("Mouse up event:", {
      wasPanning: isPanning,
      wasSelecting: selectionBox.isSelecting,
    });
    setIsPanning(false);
    setSelectionBox({
      ...selectionBox,
      isSelecting: false,
    });
  }, [isPanning, selectionBox]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      console.log("Wheel event:", {
        deltaY: e.deltaY,
        ctrlKey: e.ctrlKey,
      });
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.min(Math.max(zoom * delta, MIN_ZOOM), MAX_ZOOM);
        console.log("Zoom updated:", { currentZoom: zoom, newZoom });
        setZoom(newZoom);
      } else {
        setPan((prevPan) => {
          const newPan = {
            x: prevPan.x - e.deltaX / zoom,
            y: prevPan.y - e.deltaY / zoom,
          };
          console.log("Pan updated:", { prevPan, newPan });
          return newPan;
        });
      }
    },
    [zoom, setZoom]
  );

  const centerOnComponent = useCallback(
    (component: ComponentState) => {
      console.log("Centering on component:", component);
      const canvasWidth = canvasRef.current?.clientWidth || 0;
      const canvasHeight = canvasRef.current?.clientHeight || 0;
      const newPan = {
        x: -component.x + (canvasWidth / zoom - component.width) / 2,
        y: -component.y + (canvasHeight / zoom - component.height) / 2,
      };
      console.log("New pan position:", newPan);
      setPan(newPan);
    },
    [zoom]
  );

  return {
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
    setPan,
  };
}
