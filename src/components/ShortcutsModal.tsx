import { useEffect, useRef } from "react";
import { X, Keyboard } from "lucide-react";
import { useShortcuts } from "../editor/useShortcuts";

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  const { shortcuts } = useShortcuts();
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close modal when pressing Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Group shortcuts by category
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    let category = "General";

    if (shortcut.key.startsWith("Arrow")) {
      category = "Navigation";
    } else if (shortcut.ctrl) {
      category = "Commands";
    } else if (shortcut.key === "Delete" || shortcut.key === "Backspace") {
      category = "Editing";
    }

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(shortcut);
    return acc;
  }, {} as Record<string, typeof shortcuts>);

  // Format key combination for display
  const formatKeyCombo = (shortcut: (typeof shortcuts)[0]) => {
    const parts = [];

    if (shortcut.ctrl) parts.push("Ctrl");
    if (shortcut.shift) parts.push("Shift");
    if (shortcut.alt) parts.push("Alt");
    if (shortcut.meta) parts.push("⌘");

    // Format the key
    let key = shortcut.key;
    if (key === "ArrowUp") key = "↑";
    if (key === "ArrowDown") key = "↓";
    if (key === "ArrowLeft") key = "←";
    if (key === "ArrowRight") key = "→";
    if (key === "Escape") key = "Esc";
    if (key === "Backspace") key = "⌫";
    if (key === "Delete") key = "⌦";

    parts.push(key);

    return parts.join("+");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-gray-900 rounded-lg shadow-xl border border-gray-700 w-[600px] max-h-[80vh] flex flex-col overflow-hidden"
      >
        {/* macOS-style title bar */}
        <div className="h-12 bg-gray-800 flex items-center px-4 border-b border-gray-700">
          <div className="flex-1 text-center text-gray-400 text-sm font-medium flex items-center justify-center gap-2">
            <Keyboard size={16} />
            Keyboard Shortcuts
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          {Object.entries(groupedShortcuts).map(
            ([category, categoryShortcuts]) => (
              <div key={category} className="mb-6 last:mb-0">
                <h3 className="text-lg font-medium text-gray-300 mb-3">
                  {category}
                </h3>
                <div className="space-y-2">
                  {categoryShortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 bg-gray-800 rounded-md"
                    >
                      <span className="text-gray-300">
                        {shortcut.description}
                      </span>
                      <kbd className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm font-mono">
                        {formatKeyCombo(shortcut)}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
