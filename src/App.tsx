import { useEffect } from "react";
import Canvas from "./components/Canvas";
import { useShortcuts } from "./editor/useShortcuts";
import { ShortcutsModal } from "./components/ShortcutsModal";
import { componentRegistry } from "./utils/componentRegistry";

function App() {
  // Initialize shortcuts and get modal state
  const { showShortcutsModal, setShowShortcutsModal } = useShortcuts();

  useEffect(() => {
    console.log("App component mounted");
    const components = componentRegistry.getAllComponents();
    console.log("Available components:", components);

    // Check if components are registered
    const button = componentRegistry.getComponent("button");
    const input = componentRegistry.getComponent("input");
    const container = componentRegistry.getComponent("container");

    console.log("Registered components:", {
      button,
      input,
      container,
    });

    return () => {
      console.log("App component unmounted");
    };
  }, []);

  return (
    <>
      <Canvas />
      <ShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />
    </>
  );
}

export default App;
