import { ZoomIn, ZoomOut, Maximize2, Undo, Redo } from "lucide-react";
import { useEditorStore } from "../editor/useEditorStore";

interface ToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCenter: () => void;
}

export function Toolbar({ zoom, onZoomIn, onZoomOut, onCenter }: ToolbarProps) {
  const { undo, redo, canUndo, canRedo } = useEditorStore();

  return (
    <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4 gap-2">
      <div className="flex items-center gap-1 bg-gray-700 rounded-md p-1">
        <button
          onClick={onZoomOut}
          className="p-1 rounded hover:bg-gray-600 text-gray-300"
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
        <span className="text-gray-300 px-2">{Math.round(zoom * 100)}%</span>
        <button
          onClick={onZoomIn}
          className="p-1 rounded hover:bg-gray-600 text-gray-300"
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
      </div>

      <button
        onClick={onCenter}
        className="p-1 rounded hover:bg-gray-700 text-gray-300"
        title="Center Canvas"
      >
        <Maximize2 size={18} />
      </button>

      <div className="h-6 w-px bg-gray-700 mx-2" />

      <button
        onClick={undo}
        disabled={!canUndo()}
        className={`p-1 rounded hover:bg-gray-700 text-gray-300 ${
          !canUndo() ? "opacity-50 cursor-not-allowed" : ""
        }`}
        title="Undo"
      >
        <Undo size={18} />
      </button>

      <button
        onClick={redo}
        disabled={!canRedo()}
        className={`p-1 rounded hover:bg-gray-700 text-gray-300 ${
          !canRedo() ? "opacity-50 cursor-not-allowed" : ""
        }`}
        title="Redo"
      >
        <Redo size={18} />
      </button>
    </div>
  );
}
