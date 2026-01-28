import { useEffect } from 'react';
import TopBar from './components/TopBar';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import Canvas from './components/Canvas';
import Timeline from './components/Timeline';
import { useStore } from './store/useStore';

function App() {
  const { undo, redo, saveHistory, deleteBlock, deleteArrow, selectedBlockIds, selectedArrowId, setActiveTool } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo/Redo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        e.preventDefault();
      }
      
      // Delete
      if (e.key === 'Backspace' || e.key === 'Delete') {
        if (selectedBlockIds.length > 0) {
          selectedBlockIds.forEach(id => deleteBlock(id));
          e.preventDefault();
        } else if (selectedArrowId) {
          deleteArrow(selectedArrowId);
          e.preventDefault();
        }
      }

      // Tools shortcuts (only if not in input field)
      const target = e.target as HTMLElement;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        if (e.key === 'v' || e.key === 'V') {
          setActiveTool('select');
          e.preventDefault();
        }
        if (e.key === 'c' || e.key === 'C') {
          if (!e.ctrlKey && !e.metaKey) {
            setActiveTool('connection');
            e.preventDefault();
          }
        }
        if (e.key === ' ' && !e.ctrlKey && !e.metaKey) {
          setActiveTool('pan');
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, deleteBlock, deleteArrow, selectedBlockIds, selectedArrowId, setActiveTool]);

  // Save initial history
  useEffect(() => {
    saveHistory();
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#fafafa] overflow-hidden">
      {/* Top Bar */}
      <TopBar />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Tools & Blocks */}
        <LeftPanel />
        
        {/* Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Canvas />
          {/* Timeline */}
          <Timeline />
        </div>
        
        {/* Right Panel - Properties */}
        <RightPanel />
      </div>
    </div>
  );
}

export default App;
