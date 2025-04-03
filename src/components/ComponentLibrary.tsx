import React, { useState } from "react";
import {
  componentRegistry,
  ComponentDefinition,
} from "../utils/componentRegistry";
import { Component, ChevronDown, ChevronRight } from "lucide-react";

interface ComponentLibraryProps {
  onAddComponent: (component: ComponentDefinition) => void;
}

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  onAddComponent,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  const components = componentRegistry.getAllComponents();
  const providers = componentRegistry.getAllProviders();

  // Group components by category
  const componentsByCategory = components.reduce((acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = [];
    }
    acc[component.category].push(component);
    return acc;
  }, {} as Record<string, ComponentDefinition[]>);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleDragStart = (
    e: React.DragEvent,
    component: ComponentDefinition
  ) => {
    e.dataTransfer.setData("application/json", JSON.stringify(component));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-2">
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Components
          </h3>
          {Object.entries(componentsByCategory).map(
            ([category, components]) => (
              <div key={category} className="mb-2">
                <div
                  className="flex items-center p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer transition-colors"
                  onClick={() => toggleCategory(category)}
                >
                  {expandedCategories[category] ? (
                    <ChevronDown size={16} className="mr-1 text-gray-500" />
                  ) : (
                    <ChevronRight size={16} className="mr-1 text-gray-500" />
                  )}
                  <span className="text-sm font-medium capitalize">
                    {category}
                  </span>
                  <span className="ml-auto text-xs text-gray-500">
                    {components.length}
                  </span>
                </div>

                {expandedCategories[category] && (
                  <div className="ml-4 mt-1 space-y-1">
                    {components.map((component) => (
                      <div
                        key={component.id}
                        className="flex items-center p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer transition-colors"
                        draggable
                        onDragStart={(e) => handleDragStart(e, component)}
                        onClick={() => onAddComponent(component)}
                      >
                        <Component size={14} className="mr-2 text-gray-500" />
                        <span className="text-sm">{component.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          )}
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Providers
          </h3>
          <div className="space-y-1">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="flex items-center p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer transition-colors"
                draggable
                onDragStart={(e) =>
                  handleDragStart(e, provider as unknown as ComponentDefinition)
                }
                onClick={() =>
                  onAddComponent(provider as unknown as ComponentDefinition)
                }
              >
                <Component size={14} className="mr-2 text-gray-500" />
                <span className="text-sm">{provider.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
