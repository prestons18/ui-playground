import React, { ComponentType } from "react";
import { componentRegistry } from "./componentRegistry";

interface ButtonProps {
  text?: string;
  [key: string]: any;
}

interface InputProps {
  type?: string;
  placeholder?: string;
  [key: string]: any;
}

interface ContainerProps {
  maxWidth?: string;
  padding?: string;
  [key: string]: any;
}

// Button Component
const Button: ComponentType<ButtonProps> = ({ text = "Button", ...props }) => {
  console.log("Button component rendering with props:", { text, ...props });
  return (
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid yellow",
        minHeight: "50px",
        minWidth: "100px",
      }}
      {...props}
    >
      {text}
    </button>
  );
};

// Input Component
const Input: ComponentType<InputProps> = ({
  type = "text",
  placeholder = "Input",
  ...props
}) => {
  console.log("Input component rendering with props:", {
    type,
    placeholder,
    ...props,
  });
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full h-full px-3 py-2 border rounded"
      {...props}
    />
  );
};

// Container Component
const Container: ComponentType<ContainerProps> = ({
  maxWidth = "100%",
  padding = "0",
  ...props
}) => {
  console.log("Container component rendering with props:", {
    maxWidth,
    padding,
    ...props,
  });
  return (
    <div
      className="w-full h-full border border-dashed border-gray-300 flex items-center justify-center"
      style={{
        maxWidth,
        padding,
      }}
      {...props}
    >
      Container
    </div>
  );
};

// Register all components
export function registerComponents() {
  console.log("Starting component registration...");

  try {
    // Register button component
    console.log("Registering button component");
    componentRegistry.registerComponent("button", Button);
    console.log("Button component registered");

    // Register input component
    console.log("Registering input component");
    componentRegistry.registerComponent("input", Input);
    console.log("Input component registered");

    // Register container component
    console.log("Registering container component");
    componentRegistry.registerComponent("container", Container);
    console.log("Container component registered");

    // Verify component registration
    const registeredComponents = {
      button: componentRegistry.getComponent("button"),
      input: componentRegistry.getComponent("input"),
      container: componentRegistry.getComponent("container"),
    };

    console.log("Registered components verification:", {
      button: !!registeredComponents.button,
      input: !!registeredComponents.input,
      container: !!registeredComponents.container,
    });

    // Log component definitions
    const componentDefinitions = componentRegistry.getAllComponents();
    console.log("Component definitions:", componentDefinitions);

    return true;
  } catch (error) {
    console.error("Error registering components:", error);
    return false;
  }
}
