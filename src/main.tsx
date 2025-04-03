import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerComponents } from "./utils/registerComponents";

console.log("Starting application initialization...");

// Register all components before rendering
console.log("Registering components...");
registerComponents();
console.log("Components registered, initializing React app...");

const rootElement = document.getElementById("root");
console.log("Root element:", rootElement);

if (!rootElement) {
  console.error("Root element not found!");
} else {
  const root = createRoot(rootElement);
  console.log("React root created, rendering app...");

  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );

  console.log("App rendered");
}
