import { useEditorStore } from "../editor/useEditorStore";
import {
  Box,
  Image,
  Type,
  Layers,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Copy,
  Component,
  Search,
  Library,
  Plus,
  File,
  Code,
  Palette,
  Grid,
  Layout,
  Package,
  GripVertical,
} from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
import { ComponentState } from "./types";
import { ComponentLibrary } from "./ComponentLibrary";
import { ComponentDefinition } from "../utils/componentRegistry";

type ComponentCategory =
  | "basic"
  | "media"
  | "text"
  | "interactive"
  | "layout"
  | "css";

interface ComponentTemplate {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: ComponentCategory;
  defaultProps: {
    width: number;
    height: number;
    backgroundColor: string;
    borderRadius: number;
  };
  tags?: string[];
  cssLibrary?: string;
}

const componentTemplates: Record<ComponentCategory, ComponentTemplate[]> = {
  basic: [
    {
      id: "rectangle",
      name: "Rectangle",
      icon: <Box size={18} />,
      category: "basic",
      defaultProps: {
        width: 200,
        height: 100,
        backgroundColor: "#3b82f6",
        borderRadius: 8,
      },
      tags: ["shape", "container"],
    },
  ],
  media: [
    {
      id: "image",
      name: "Image",
      icon: <Image size={18} />,
      category: "media",
      defaultProps: {
        width: 300,
        height: 200,
        backgroundColor: "#e5e7eb",
        borderRadius: 0,
      },
      tags: ["picture", "photo"],
    },
  ],
  text: [
    {
      id: "text",
      name: "Text",
      icon: <Type size={18} />,
      category: "text",
      defaultProps: {
        width: 200,
        height: 40,
        backgroundColor: "transparent",
        borderRadius: 0,
      },
      tags: ["typography", "label"],
    },
  ],
  interactive: [
    {
      id: "button",
      name: "Button",
      icon: <Component size={18} />,
      category: "interactive",
      defaultProps: {
        width: 120,
        height: 40,
        backgroundColor: "#3b82f6",
        borderRadius: 6,
      },
      tags: ["click", "action"],
      cssLibrary: "tailwind",
    },
  ],
  layout: [
    {
      id: "grid",
      name: "Grid",
      icon: <Grid size={18} />,
      category: "layout",
      defaultProps: {
        width: 400,
        height: 300,
        backgroundColor: "transparent",
        borderRadius: 0,
      },
      tags: ["container", "structure"],
      cssLibrary: "tailwind",
    },
    {
      id: "flex",
      name: "Flex Container",
      icon: <Layout size={18} />,
      category: "layout",
      defaultProps: {
        width: 400,
        height: 200,
        backgroundColor: "transparent",
        borderRadius: 0,
      },
      tags: ["container", "structure"],
      cssLibrary: "tailwind",
    },
  ],
  css: [
    {
      id: "tailwind-button",
      name: "Tailwind Button",
      icon: <Package size={18} />,
      category: "css",
      defaultProps: {
        width: 120,
        height: 40,
        backgroundColor: "#3b82f6",
        borderRadius: 6,
      },
      tags: ["tailwind", "button", "component"],
      cssLibrary: "tailwind",
    },
    {
      id: "material-button",
      name: "Material Button",
      icon: <Package size={18} />,
      category: "css",
      defaultProps: {
        width: 120,
        height: 40,
        backgroundColor: "#1976d2",
        borderRadius: 4,
      },
      tags: ["material", "button", "component"],
      cssLibrary: "material-ui",
    },
  ],
};

export function Sidebar() {
  const {
    components,
    selectedComponent,
    selectComponent,
    removeComponent,
    addComponent,
    updateComponent,
  } = useEditorStore();

  const [expandedCategories, setExpandedCategories] = useState<
    Record<ComponentCategory, boolean>
  >({
    basic: true,
    media: true,
    text: true,
    interactive: true,
    layout: true,
    css: true,
  });

  const [expandedLayers, setExpandedLayers] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"components" | "layers" | "css">(
    "components"
  );

  // Resizable sidebar state
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);

  // Handle resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = e.clientX;
        if (newWidth >= 200 && newWidth <= 600) {
          setSidebarWidth(newWidth);
        }
      }
    };

    const handleMouseUp = () => {
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

  const toggleCategory = (category: ComponentCategory) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleLayers = () => {
    setExpandedLayers((prev) => !prev);
  }; // Todo: Use

  const handleAddComponent = (template: ComponentTemplate) => {
    const newComponent: ComponentState = {
      id: crypto.randomUUID(),
      x: 100,
      y: 100,
      width: template.defaultProps.width,
      height: template.defaultProps.height,
      backgroundColor: template.defaultProps.backgroundColor,
      borderRadius: template.defaultProps.borderRadius,
      rotation: 0,
      opacity: 1,
      locked: false,
      hidden: false,
      border: {
        width: 0,
        color: "#000000",
        style: "solid",
      },
      shadow: {
        color: "rgba(0, 0, 0, 0.2)",
        blur: 10,
        spread: 0,
        x: 0,
        y: 4,
      },
    };

    addComponent(newComponent);
  };

  const handleAddRegistryComponent = (component: ComponentDefinition) => {
    const newComponent: ComponentState = {
      id: `${component.id}-${Date.now()}`,
      x: 100,
      y: 100,
      width: 200,
      height: 100,
      rotation: 0,
      backgroundColor: "#ffffff",
      borderRadius: 0,
      opacity: 1,
      locked: false,
      hidden: false,
      border: {
        width: 0,
        color: "#000000",
        style: "solid",
      },
      shadow: {
        color: "#000000",
        blur: 0,
        spread: 0,
        x: 0,
        y: 0,
      },
      componentType: component.id,
      componentProps: component.props,
    };

    addComponent(newComponent);
  };

  const toggleComponentVisibility = (component: ComponentState) => {
    updateComponent({
      ...component,
      hidden: !component.hidden,
    });
  };

  const toggleComponentLock = (component: ComponentState) => {
    updateComponent({
      ...component,
      locked: !component.locked,
    });
  };

  const duplicateComponent = (component: ComponentState) => {
    const newComponent: ComponentState = {
      ...component,
      id: crypto.randomUUID(),
      x: component.x + 20,
      y: component.y + 20,
    };
    addComponent(newComponent);
  };

  const filteredComponents = useMemo(() => {
    if (!searchQuery) return componentTemplates;

    const query = searchQuery.toLowerCase();
    const filtered: Record<ComponentCategory, ComponentTemplate[]> = {
      basic: [],
      media: [],
      text: [],
      interactive: [],
      layout: [],
      css: [],
    };

    Object.entries(componentTemplates).forEach(([category, templates]) => {
      filtered[category as ComponentCategory] = templates.filter(
        (template) =>
          template.name.toLowerCase().includes(query) ||
          template.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
          template.cssLibrary?.toLowerCase().includes(query)
      );
    });

    return filtered;
  }, [searchQuery]);

  const groupedComponents = components.reduce((acc, component) => {
    const category = component.id.startsWith("rectangle")
      ? "basic"
      : component.id.startsWith("image")
      ? "media"
      : component.id.startsWith("text")
      ? "text"
      : component.id.startsWith("grid")
      ? "layout"
      : "interactive";

    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(component);
    return acc;
  }, {} as Record<ComponentCategory, ComponentState[]>);

  return (
    <div
      ref={sidebarRef}
      className="bg-gray-900 flex flex-col h-full border-r border-gray-800 relative"
      style={{ width: `${sidebarWidth}px` }}
    >
      {/* macOS-style title bar */}
      <div className="h-12 bg-gray-800 flex items-center px-4 border-b border-gray-700">
        <div className="flex-1 text-center text-gray-400 text-sm font-medium">
          UI Playground
        </div>
      </div>

      {/* Search bar */}
      <div className="p-4 border-b border-gray-800">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 text-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab("components")}
          className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 ${
            activeTab === "components"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <Library size={16} />
          Components
        </button>
        <button
          onClick={() => setActiveTab("layers")}
          className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 ${
            activeTab === "layers"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <Layers size={16} />
          Layers
        </button>
        <button
          onClick={() => setActiveTab("css")}
          className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 ${
            activeTab === "css"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <Code size={16} />
          CSS
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === "components" && (
          <div className="p-4 space-y-4">
            <ComponentLibrary onAddComponent={handleAddRegistryComponent} />
          </div>
        )}

        {activeTab === "layers" && (
          <div className="p-4">
            <div className="space-y-1">
              {components.map((component, index) => (
                <div
                  key={component.id}
                  className={`p-2 rounded flex items-center justify-between ${
                    component === selectedComponent
                      ? "bg-blue-600"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  <div
                    className="flex items-center gap-2 cursor-pointer flex-1"
                    onClick={() => selectComponent(component)}
                  >
                    <Box size={16} />
                    <span className="text-white text-sm truncate">
                      {component.id.split("-")[0]} {index + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      className="p-1 text-gray-300 hover:text-white"
                      onClick={() => toggleComponentVisibility(component)}
                      title={component.hidden ? "Show" : "Hide"}
                    >
                      {component.hidden ? (
                        <EyeOff size={14} />
                      ) : (
                        <Eye size={14} />
                      )}
                    </button>
                    <button
                      className="p-1 text-gray-300 hover:text-white"
                      onClick={() => toggleComponentLock(component)}
                      title={component.locked ? "Unlock" : "Lock"}
                    >
                      {component.locked ? (
                        <Lock size={14} />
                      ) : (
                        <Unlock size={14} />
                      )}
                    </button>
                    <button
                      className="p-1 text-gray-300 hover:text-white"
                      onClick={() => duplicateComponent(component)}
                      title="Duplicate"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      className="p-1 text-red-400 hover:text-red-300"
                      onClick={() => removeComponent(component.id)}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "css" && (
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-300">
                CSS Libraries
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 flex flex-col items-center gap-2">
                  <Package size={24} className="text-blue-400" />
                  <span className="text-sm text-gray-300">Tailwind CSS</span>
                </button>
                <button className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 flex flex-col items-center gap-2">
                  <Package size={24} className="text-blue-400" />
                  <span className="text-sm text-gray-300">Material UI</span>
                </button>
                <button className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 flex flex-col items-center gap-2">
                  <Package size={24} className="text-blue-400" />
                  <span className="text-sm text-gray-300">Bootstrap</span>
                </button>
                <button className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 flex flex-col items-center gap-2">
                  <Plus size={24} className="text-gray-400" />
                  <span className="text-sm text-gray-300">Add Library</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-300">Custom CSS</h3>
              <div className="space-y-2">
                <button className="w-full p-3 bg-gray-800 rounded-lg hover:bg-gray-700 flex items-center gap-2">
                  <File size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-300">styles.css</span>
                </button>
                <button className="w-full p-3 bg-gray-800 rounded-lg hover:bg-gray-700 flex items-center gap-2">
                  <Plus size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-300">New CSS File</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resize handle */}
      <div
        ref={resizeHandleRef}
        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 transition-colors"
        onMouseDown={() => setIsResizing(true)}
      >
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-16 bg-gray-700 rounded-full opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <GripVertical size={12} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}
