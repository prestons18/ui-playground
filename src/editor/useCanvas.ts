import { useState, useCallback, useRef } from "react";
import { ComponentState } from "../components/types";

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

export function useCanvas() {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
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

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 1) {
        setIsPanning(true);
        lastPanPosition.current = { x: e.clientX, y: e.clientY };
        document.body.style.cursor = "grabbing";
      } else if (e.button === 0) {
        const target = e.target as HTMLElement;
        if (
          target === canvasRef.current ||
          target.closest(".grid-background")
        ) {
          const rect = canvasRef.current?.getBoundingClientRect();
          if (rect) {
            const x = (e.clientX - rect.left) / zoom - pan.x;
            const y = (e.clientY - rect.top) / zoom - pan.y;
            setSelectionBox({
              startX: x,
              startY: y,
              endX: x,
              endY: y,
              isSelecting: true,
            });
          }
        }
      }
    },
    [pan, zoom]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        const dx = (e.clientX - lastPanPosition.current.x) / zoom;
        const dy = (e.clientY - lastPanPosition.current.y) / zoom;

        setPan((prev) => ({
          x: prev.x + dx,
          y: prev.y + dy,
        }));

        lastPanPosition.current = { x: e.clientX, y: e.clientY };
      } else if (selectionBox.isSelecting) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          const x = (e.clientX - rect.left) / zoom - pan.x;
          const y = (e.clientY - rect.top) / zoom - pan.y;
          setSelectionBox((prev) => ({
            ...prev,
            endX: x,
            endY: y,
          }));
        }
      }
    },
    [isPanning, zoom, pan, selectionBox.isSelecting]
  );

  const handleMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      document.body.style.cursor = "default";
    } else if (selectionBox.isSelecting) {
      setSelectionBox((prev) => ({
        ...prev,
        isSelecting: false,
      }));
    }
  }, [isPanning, selectionBox.isSelecting]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      if (!canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const cursorX = (mouseX - pan.x * zoom) / zoom;
      const cursorY = (mouseY - pan.y * zoom) / zoom;

      const delta = e.deltaY > 0 ? 0.95 : 1.05;
      const newZoom = Math.min(Math.max(zoom * delta, MIN_ZOOM), MAX_ZOOM);

      if (newZoom !== zoom) {
        const newPanX = mouseX / newZoom - cursorX;
        const newPanY = mouseY / newZoom - cursorY;

        setZoom(newZoom);
        setPan({ x: newPanX, y: newPanY });
      }
    },
    [zoom, pan]
  );

  const centerOnComponent = useCallback(
    (component: ComponentState) => {
      if (!canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const targetX =
        centerX - (component.x * zoom + (component.width * zoom) / 2);
      const targetY =
        centerY - (component.y * zoom + (component.height * zoom) / 2);

      setPan({ x: targetX, y: targetY });
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
  };
}
