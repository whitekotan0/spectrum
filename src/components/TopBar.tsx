import { 
  Download, 
  Undo2, 
  Redo2, 
  ZoomIn, 
  ZoomOut,
  Grid3X3,
  Eye
} from 'lucide-react';
import { useStore } from '../store/useStore';

export default function TopBar() {
  const { canvas, setCanvasScale, undo, redo } = useStore();

  return (
    <div className="h-12 border-b border-gray-200 bg-white flex items-center px-4 justify-between">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
            <span className="text-white text-xs font-bold font-mono">S</span>
          </div>
          <span className="font-mono font-bold text-sm tracking-wide">SPECTRA STUDIO</span>
        </div>
        
        <div className="h-4 w-px bg-gray-300 mx-2" />
        
        {/* Menu */}
        <nav className="flex items-center gap-1">
          {['File', 'Edit', 'View', 'Export'].map((item) => (
            <button
              key={item}
              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded font-mono"
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      {/* Center - Project Name */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <span className="text-sm text-gray-500 font-mono">Untitled Project</span>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-2">
        {/* History */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <button
            onClick={undo}
            className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={redo}
            className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 size={16} />
          </button>
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <button
            onClick={() => setCanvasScale(canvas.scale - 0.1)}
            className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-xs font-mono w-12 text-center text-gray-600">
            {Math.round(canvas.scale * 100)}%
          </span>
          <button
            onClick={() => setCanvasScale(canvas.scale + 0.1)}
            className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
          >
            <ZoomIn size={16} />
          </button>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600" title="Toggle Grid">
            <Grid3X3 size={16} />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600" title="Preview">
            <Eye size={16} />
          </button>
        </div>

        {/* Export */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-sm rounded hover:bg-gray-800 font-mono">
          <Download size={14} />
          Export
        </button>
      </div>
    </div>
  );
}
