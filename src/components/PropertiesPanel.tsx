import { ComponentState } from "./types";
import { useEditorStore } from "../editor/useEditorStore";
import { useState, useRef, useEffect } from "react";
import {
  Layout,
  Palette,
  Square,
  Box,
  ChevronDown,
  ChevronRight,
  Settings,
  Code,
  Layers,
  Type,
  Component,
  Grid,
  Image,
  Package,
  GripVertical,
} from "lucide-react";

type Tab = "layout" | "style" | "border" | "shadow" | "css";

export function PropertiesPanel() {
  const { selectedComponent, updateComponent } = useEditorStore();
  const [activeTab, setActiveTab] = useState<Tab>("layout");
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    position: true,
    size: true,
    background: true,
    border: true,
    shadow: true,
  });

  // Resizable panel state
  const [panelWidth, setPanelWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("PropertiesPanel mounted");
    console.log("Initial state:", {
      selectedComponent,
      activeTab,
      expandedSections,
      panelWidth,
    });
  }, []);

  useEffect(() => {
    console.log("Selected component updated:", selectedComponent);
  }, [selectedComponent]);

  // Handle resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = window.innerWidth - e.clientX;
        if (newWidth >= 200 && newWidth <= 600) {
          console.log("Resizing panel to width:", newWidth);
          setPanelWidth(newWidth);
        }
      }
    };

    const handleMouseUp = () => {
      console.log("Stopped resizing panel");
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  if (!selectedComponent) {
    console.log("No component selected");
    return (
      <div
        ref={panelRef}
        className="bg-gray-900 flex flex-col h-full border-l border-gray-800 relative"
        style={{ width: `${panelWidth}px` }}
      >
        {/* macOS-style title bar */}
        <div className="h-12 bg-gray-800 flex items-center px-4 border-b border-gray-700">
          <div className="flex-1 text-center text-gray-400 text-sm font-medium">
            Properties
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400 text-center">No component selected</p>
        </div>

        {/* Resize handle */}
        <div
          ref={resizeHandleRef}
          className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 transition-colors"
          onMouseDown={() => {
            console.log("Started resizing panel");
            setIsResizing(true);
          }}
        >
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-16 bg-gray-700 rounded-full opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <GripVertical size={12} className="text-gray-400" />
          </div>
        </div>
      </div>
    );
  }

  const handlePropertyChange = (
    property: keyof ComponentState,
    value: string
  ) => {
    console.log(`Changing property '${property}' to:`, value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const updatedComponent = { ...selectedComponent };
      (updatedComponent as any)[property] = numValue;
      console.log("Updated component:", updatedComponent);
      updateComponent(updatedComponent);
    } else {
      console.log("Invalid numeric value:", value);
    }
  };

  const handleShadowChange = (
    property: keyof ComponentState["shadow"],
    value: string | number
  ) => {
    console.log(`Changing shadow property '${property}' to:`, value);
    const updatedComponent = { ...selectedComponent };
    if (typeof value === "string") {
      (updatedComponent.shadow as any)[property] = parseFloat(value);
    } else {
      (updatedComponent.shadow as any)[property] = value;
    }
    console.log("Updated component shadow:", updatedComponent.shadow);
    updateComponent(updatedComponent);
  };

  const handleBorderChange = (
    property: keyof ComponentState["border"],
    value: string
  ) => {
    console.log(`Changing border property '${property}' to:`, value);
    const updatedComponent = { ...selectedComponent };
    if (property === "style") {
      updatedComponent.border.style = value as "solid" | "dashed" | "dotted";
    } else if (property === "width" || property === "color") {
      (updatedComponent.border as any)[property] = value;
    }
    console.log("Updated component border:", updatedComponent.border);
    updateComponent(updatedComponent);
  };

  const toggleSection = (section: string) => {
    console.log(`Toggling section '${section}'`);
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "layout", label: "Layout", icon: <Layout size={16} /> },
    { id: "style", label: "Style", icon: <Palette size={16} /> },
    { id: "border", label: "Border", icon: <Square size={16} /> },
    { id: "shadow", label: "Shadow", icon: <Box size={16} /> },
    { id: "css", label: "CSS", icon: <Code size={16} /> },
  ];

  return (
    <div
      ref={panelRef}
      className="bg-gray-900 flex flex-col h-full border-l border-gray-800 relative"
      style={{ width: `${panelWidth}px` }}
    >
      {/* macOS-style title bar */}
      <div className="h-12 bg-gray-800 flex items-center px-4 border-b border-gray-700">
        <div className="flex-1 text-center text-gray-400 text-sm font-medium">
          Properties
        </div>
      </div>

      {/* Component Info */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-2">
          {selectedComponent.id.startsWith("rectangle") && (
            <Box size={18} className="text-blue-400" />
          )}
          {selectedComponent.id.startsWith("image") && (
            <Image size={18} className="text-green-400" />
          )}
          {selectedComponent.id.startsWith("text") && (
            <Type size={18} className="text-purple-400" />
          )}
          {selectedComponent.id.startsWith("button") && (
            <Component size={18} className="text-yellow-400" />
          )}
          {selectedComponent.id.startsWith("grid") && (
            <Grid size={18} className="text-indigo-400" />
          )}
          <span className="text-white font-medium truncate">
            {selectedComponent.id.split("-")[0].charAt(0).toUpperCase() +
              selectedComponent.id.split("-")[0].slice(1)}
          </span>
        </div>
        <div className="text-xs text-gray-400 truncate">
          ID: {selectedComponent.id.substring(0, 8)}...
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              console.log(`Switching to tab '${tab.id}'`);
              setActiveTab(tab.id);
            }}
            className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 ${
              activeTab === tab.id
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            {tab.icon}
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 custom-scrollbar">
        {activeTab === "layout" && (
          <div className="space-y-4">
            {/* Position Section */}
            <div>
              <div
                className="flex items-center justify-between p-2 text-gray-300 hover:bg-gray-800 rounded cursor-pointer"
                onClick={() => toggleSection("position")}
              >
                <div className="flex items-center gap-2">
                  <Layout size={16} />
                  <span className="text-sm font-medium">Position</span>
                </div>
                {expandedSections.position ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </div>

              {expandedSections.position && (
                <div className="pl-6 space-y-2 mt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">
                        X
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={selectedComponent.x}
                          onChange={(e) =>
                            handlePropertyChange("x", e.target.value)
                          }
                          className="w-full bg-gray-800 text-white rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                          px
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">
                        Y
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={selectedComponent.y}
                          onChange={(e) =>
                            handlePropertyChange("y", e.target.value)
                          }
                          className="w-full bg-gray-800 text-white rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                          px
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Size Section */}
            <div>
              <div
                className="flex items-center justify-between p-2 text-gray-300 hover:bg-gray-800 rounded cursor-pointer"
                onClick={() => toggleSection("size")}
              >
                <div className="flex items-center gap-2">
                  <Box size={16} />
                  <span className="text-sm font-medium">Size</span>
                </div>
                {expandedSections.size ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </div>

              {expandedSections.size && (
                <div className="pl-6 space-y-2 mt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">
                        Width
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={selectedComponent.width}
                          onChange={(e) =>
                            handlePropertyChange("width", e.target.value)
                          }
                          className="w-full bg-gray-800 text-white rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                          px
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">
                        Height
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={selectedComponent.height}
                          onChange={(e) =>
                            handlePropertyChange("height", e.target.value)
                          }
                          className="w-full bg-gray-800 text-white rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                          px
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Rotation Section */}
            <div>
              <div
                className="flex items-center justify-between p-2 text-gray-300 hover:bg-gray-800 rounded cursor-pointer"
                onClick={() => toggleSection("rotation")}
              >
                <div className="flex items-center gap-2">
                  <Settings size={16} />
                  <span className="text-sm font-medium">Rotation</span>
                </div>
                {expandedSections.rotation ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </div>

              {expandedSections.rotation && (
                <div className="pl-6 space-y-2 mt-2">
                  <div className="relative">
                    <input
                      type="number"
                      value={selectedComponent.rotation}
                      onChange={(e) =>
                        handlePropertyChange("rotation", e.target.value)
                      }
                      className="w-full bg-gray-800 text-white rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                      °
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "style" && (
          <div className="space-y-4">
            {/* Background Section */}
            <div>
              <div
                className="flex items-center justify-between p-2 text-gray-300 hover:bg-gray-800 rounded cursor-pointer"
                onClick={() => toggleSection("background")}
              >
                <div className="flex items-center gap-2">
                  <Palette size={16} />
                  <span className="text-sm font-medium">Background</span>
                </div>
                {expandedSections.background ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </div>

              {expandedSections.background && (
                <div className="pl-6 space-y-2 mt-2">
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={selectedComponent.backgroundColor}
                      onChange={(e) =>
                        handlePropertyChange("backgroundColor", e.target.value)
                      }
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedComponent.backgroundColor}
                      onChange={(e) =>
                        handlePropertyChange("backgroundColor", e.target.value)
                      }
                      className="flex-1 bg-gray-800 text-white rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Border Radius Section */}
            <div>
              <div
                className="flex items-center justify-between p-2 text-gray-300 hover:bg-gray-800 rounded cursor-pointer"
                onClick={() => toggleSection("borderRadius")}
              >
                <div className="flex items-center gap-2">
                  <Square size={16} />
                  <span className="text-sm font-medium">Border Radius</span>
                </div>
                {expandedSections.borderRadius ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </div>

              {expandedSections.borderRadius && (
                <div className="pl-6 space-y-2 mt-2">
                  <div className="relative">
                    <input
                      type="number"
                      value={selectedComponent.borderRadius}
                      onChange={(e) =>
                        handlePropertyChange("borderRadius", e.target.value)
                      }
                      className="w-full bg-gray-800 text-white rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                      px
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Opacity Section */}
            <div>
              <div
                className="flex items-center justify-between p-2 text-gray-300 hover:bg-gray-800 rounded cursor-pointer"
                onClick={() => toggleSection("opacity")}
              >
                <div className="flex items-center gap-2">
                  <Box size={16} />
                  <span className="text-sm font-medium">Opacity</span>
                </div>
                {expandedSections.opacity ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </div>

              {expandedSections.opacity && (
                <div className="pl-6 space-y-2 mt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={selectedComponent.opacity * 100}
                      onChange={(e) =>
                        handlePropertyChange(
                          "opacity",
                          (parseInt(e.target.value) / 100).toString()
                        )
                      }
                      className="flex-1"
                    />
                    <span className="text-gray-300 text-sm w-10 text-right">
                      {Math.round(selectedComponent.opacity * 100)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "border" && (
          <div className="space-y-4">
            {/* Border Width Section */}
            <div>
              <div
                className="flex items-center justify-between p-2 text-gray-300 hover:bg-gray-800 rounded cursor-pointer"
                onClick={() => toggleSection("borderWidth")}
              >
                <div className="flex items-center gap-2">
                  <Square size={16} />
                  <span className="text-sm font-medium">Width</span>
                </div>
                {expandedSections.borderWidth ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </div>

              {expandedSections.borderWidth && (
                <div className="pl-6 space-y-2 mt-2">
                  <div className="relative">
                    <input
                      type="number"
                      value={selectedComponent.border.width}
                      onChange={(e) =>
                        handleBorderChange("width", e.target.value)
                      }
                      className="w-full bg-gray-800 text-white rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                      px
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Border Color Section */}
            <div>
              <div
                className="flex items-center justify-between p-2 text-gray-300 hover:bg-gray-800 rounded cursor-pointer"
                onClick={() => toggleSection("borderColor")}
              >
                <div className="flex items-center gap-2">
                  <Palette size={16} />
                  <span className="text-sm font-medium">Color</span>
                </div>
                {expandedSections.borderColor ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </div>

              {expandedSections.borderColor && (
                <div className="pl-6 space-y-2 mt-2">
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={selectedComponent.border.color}
                      onChange={(e) =>
                        handleBorderChange("color", e.target.value)
                      }
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedComponent.border.color}
                      onChange={(e) =>
                        handleBorderChange("color", e.target.value)
                      }
                      className="flex-1 bg-gray-800 text-white rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Border Style Section */}
            <div>
              <div
                className="flex items-center justify-between p-2 text-gray-300 hover:bg-gray-800 rounded cursor-pointer"
                onClick={() => toggleSection("borderStyle")}
              >
                <div className="flex items-center gap-2">
                  <Square size={16} />
                  <span className="text-sm font-medium">Style</span>
                </div>
                {expandedSections.borderStyle ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </div>

              {expandedSections.borderStyle && (
                <div className="pl-6 space-y-2 mt-2">
                  <select
                    value={selectedComponent.border.style}
                    onChange={(e) =>
                      handleBorderChange("style", e.target.value)
                    }
                    className="w-full bg-gray-800 text-white rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "shadow" && (
          <div className="space-y-4">
            {/* Shadow Color Section */}
            <div>
              <div
                className="flex items-center justify-between p-2 text-gray-300 hover:bg-gray-800 rounded cursor-pointer"
                onClick={() => toggleSection("shadowColor")}
              >
                <div className="flex items-center gap-2">
                  <Palette size={16} />
                  <span className="text-sm font-medium">Color</span>
                </div>
                {expandedSections.shadowColor ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </div>

              {expandedSections.shadowColor && (
                <div className="pl-6 space-y-2 mt-2">
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={selectedComponent.shadow.color}
                      onChange={(e) =>
                        handleShadowChange("color", e.target.value)
                      }
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedComponent.shadow.color}
                      onChange={(e) =>
                        handleShadowChange("color", e.target.value)
                      }
                      className="flex-1 bg-gray-800 text-white rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Blur & Spread Section */}
            <div>
              <div
                className="flex items-center justify-between p-2 text-gray-300 hover:bg-gray-800 rounded cursor-pointer"
                onClick={() => toggleSection("blurSpread")}
              >
                <div className="flex items-center gap-2">
                  <Box size={16} />
                  <span className="text-sm font-medium">Blur & Spread</span>
                </div>
                {expandedSections.blurSpread ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </div>

              {expandedSections.blurSpread && (
                <div className="pl-6 space-y-2 mt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">
                        Blur
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={selectedComponent.shadow.blur}
                          onChange={(e) =>
                            handleShadowChange("blur", e.target.value)
                          }
                          className="w-full bg-gray-800 text-white rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                          px
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">
                        Spread
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={selectedComponent.shadow.spread}
                          onChange={(e) =>
                            handleShadowChange("spread", e.target.value)
                          }
                          className="w-full bg-gray-800 text-white rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                          px
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Offset Section */}
            <div>
              <div
                className="flex items-center justify-between p-2 text-gray-300 hover:bg-gray-800 rounded cursor-pointer"
                onClick={() => toggleSection("offset")}
              >
                <div className="flex items-center gap-2">
                  <Layout size={16} />
                  <span className="text-sm font-medium">Offset</span>
                </div>
                {expandedSections.offset ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </div>

              {expandedSections.offset && (
                <div className="pl-6 space-y-2 mt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">
                        X
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={selectedComponent.shadow.x}
                          onChange={(e) =>
                            handleShadowChange("x", e.target.value)
                          }
                          className="w-full bg-gray-800 text-white rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                          px
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">
                        Y
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={selectedComponent.shadow.y}
                          onChange={(e) =>
                            handleShadowChange("y", e.target.value)
                          }
                          className="w-full bg-gray-800 text-white rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                          px
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "css" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-300">CSS Classes</h3>
              <div className="space-y-2">
                <div className="p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">
                      Tailwind Classes
                    </span>
                    <button className="text-xs text-blue-400 hover:text-blue-300">
                      Edit
                    </button>
                  </div>
                  <div className="text-xs text-gray-400 bg-gray-900 p-2 rounded">
                    bg-blue-500 text-white px-4 py-2 rounded-lg
                  </div>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Custom CSS</span>
                    <button className="text-xs text-blue-400 hover:text-blue-300">
                      Edit
                    </button>
                  </div>
                  <div className="text-xs text-gray-400 bg-gray-900 p-2 rounded">
                    .custom-button {`{`}
                    transition: all 0.2s; box-shadow: 0 4px 6px rgba(0, 0, 0,
                    0.1);
                    {`}`}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-300">
                CSS Variables
              </h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">
                      --primary-color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value="#3b82f6"
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value="#3b82f6"
                        className="flex-1 bg-gray-800 text-white rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">
                      --border-radius
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={8}
                        className="w-full bg-gray-800 text-white rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                        px
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resize handle */}
      <div
        ref={resizeHandleRef}
        className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 transition-colors"
        onMouseDown={() => {
          console.log("Started resizing panel");
          setIsResizing(true);
        }}
      >
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-16 bg-gray-700 rounded-full opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <GripVertical size={12} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}
