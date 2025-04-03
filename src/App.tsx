import Canvas from "./components/Canvas";
import { useShortcuts } from "./editor/useShortcuts";
import { ShortcutsModal } from "./components/ShortcutsModal";

function App() {
  // Initialize shortcuts and get modal state
  const { showShortcutsModal, setShowShortcutsModal } = useShortcuts();

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
