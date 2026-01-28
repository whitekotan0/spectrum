import { 
  MousePointer2, 
  Hand, 
  Square, 
  Circle, 
  Type, 
  ArrowRight,
  Box,
  Layers,
  Cpu,
  GitBranch,
  Link2
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { BlockType } from '../types';

const tools = [
  { id: 'select', icon: MousePointer2, label: 'Select (V)' },
  { id: 'pan', icon: Hand, label: 'Pan (Space)' },
  { id: 'connection', icon: Link2, label: 'Connection (C)' },
];

const basicShapes = [
  { id: 'rectangle', icon: Square, label: 'Rectangle' },
  { id: 'circle', icon: Circle, label: 'Circle' },
  { id: 'text', icon: Type, label: 'Text' },
];

const nnComponents = [
  { id: 'token', icon: Box, label: 'Token Block', color: '#1976d2' },
  { id: 'embedding', icon: Layers, label: 'Embedding Layer', color: '#7b1fa2' },
  { id: 'attention', icon: GitBranch, label: 'Attention Head', color: '#f57c00' },
  { id: 'mlp', icon: Cpu, label: 'MLP Block', color: '#388e3c' },
  { id: 'layernorm', icon: ArrowRight, label: 'Layer Norm', color: '#9e9e9e' },
  { id: 'output', icon: ArrowRight, label: 'Output Head', color: '#d32f2f' },
];

export default function LeftPanel() {
  const { activeTool, setActiveTool, addBlock, canvas, saveHistory } = useStore();

  const handleDragStart = (e: React.DragEvent, type: BlockType) => {
    e.dataTransfer.setData('blockType', type);
  };

  const handleAddBlock = (type: BlockType) => {
    // Add block to center of canvas
    const centerX = (window.innerWidth / 2 - canvas.position.x) / canvas.scale;
    const centerY = (window.innerHeight / 2 - canvas.position.y) / canvas.scale;
    addBlock(type, centerX - 50, centerY - 30);
    saveHistory();
  };

  return (
    <div className="w-56 border-r border-gray-200 bg-white flex flex-col overflow-hidden">
      {/* Tools */}
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-[10px] font-mono uppercase text-gray-400 mb-2 tracking-wider">Tools</h3>
        <div className="flex gap-1">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`p-2 rounded transition-colors ${
                activeTool === tool.id
                  ? 'bg-black text-white'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title={tool.label}
            >
              <tool.icon size={18} />
            </button>
          ))}
        </div>
      </div>

      {/* Basic Shapes */}
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-[10px] font-mono uppercase text-gray-400 mb-2 tracking-wider">Basic Shapes</h3>
        <div className="grid grid-cols-3 gap-1">
          {basicShapes.map((shape) => (
            <button
              key={shape.id}
              draggable
              onDragStart={(e) => handleDragStart(e, shape.id as BlockType)}
              onClick={() => handleAddBlock(shape.id as BlockType)}
              className="p-3 border border-gray-200 rounded hover:border-gray-400 hover:bg-gray-50 transition-colors flex flex-col items-center gap-1"
            >
              <shape.icon size={20} className="text-gray-600" />
              <span className="text-[9px] text-gray-500 font-mono">{shape.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Neural Network Components */}
      <div className="p-3 flex-1 overflow-y-auto">
        <h3 className="text-[10px] font-mono uppercase text-gray-400 mb-2 tracking-wider">NN Components</h3>
        <div className="space-y-1">
          {nnComponents.map((comp) => (
            <button
              key={comp.id}
              draggable
              onDragStart={(e) => handleDragStart(e, comp.id as BlockType)}
              onClick={() => handleAddBlock(comp.id as BlockType)}
              className="w-full p-2 border border-gray-200 rounded hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center gap-2 text-left"
            >
              <div 
                className="w-8 h-8 rounded flex items-center justify-center"
                style={{ backgroundColor: comp.color + '20', border: `1px solid ${comp.color}` }}
              >
                <comp.icon size={16} style={{ color: comp.color }} />
              </div>
              <span className="text-xs text-gray-700 font-mono">{comp.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick tip */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <p className="text-[10px] text-gray-400 font-mono">
          Drag blocks to canvas or click to add
        </p>
      </div>
    </div>
  );
}
