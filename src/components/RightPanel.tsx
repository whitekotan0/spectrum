import { useStore } from '../store/useStore';
import { Block, Arrow } from '../types';

export default function RightPanel() {
  const { 
    blocks, 
    arrows,
    selectedBlockIds, 
    selectedArrowId,
    updateBlock, 
    updateArrow,
    deleteArrow,
    saveHistory 
  } = useStore();
  
  const selectedBlock = selectedBlockIds.length === 1 
    ? blocks.find(b => b.id === selectedBlockIds[0]) 
    : null;

  const selectedArrow = selectedArrowId
    ? arrows.find(a => a.id === selectedArrowId)
    : null;

  const handleBlockUpdate = (updates: Partial<Block>) => {
    if (selectedBlock) {
      updateBlock(selectedBlock.id, updates);
    }
  };

  const handleArrowUpdate = (updates: Partial<Arrow>) => {
    if (selectedArrow) {
      updateArrow(selectedArrow.id, updates);
    }
  };

  const handleBlur = () => {
    saveHistory();
  };

  // Show arrow properties if arrow is selected
  if (selectedArrow && !selectedBlock) {
    return (
      <div className="w-64 border-l border-gray-200 bg-white overflow-y-auto">
        {/* Arrow Info */}
        <div className="p-3 border-b border-gray-200">
          <h3 className="text-[10px] font-mono uppercase text-gray-400 mb-2 tracking-wider">Arrow</h3>
          <div className="space-y-2">
            <div>
              <label className="text-[10px] text-gray-500 font-mono block mb-1">From Point</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-gray-400 font-mono">X</label>
                  <input
                    type="number"
                    value={Math.round(selectedArrow.from.x)}
                    onChange={(e) => handleArrowUpdate({ 
                      from: { ...selectedArrow.from, x: Number(e.target.value) } 
                    })}
                    onBlur={handleBlur}
                    className="w-full px-2 py-1 text-sm border border-gray-200 rounded font-mono focus:outline-none focus:border-gray-400"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-gray-400 font-mono">Y</label>
                  <input
                    type="number"
                    value={Math.round(selectedArrow.from.y)}
                    onChange={(e) => handleArrowUpdate({ 
                      from: { ...selectedArrow.from, y: Number(e.target.value) } 
                    })}
                    onBlur={handleBlur}
                    className="w-full px-2 py-1 text-sm border border-gray-200 rounded font-mono focus:outline-none focus:border-gray-400"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 font-mono block mb-1">To Point</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-gray-400 font-mono">X</label>
                  <input
                    type="number"
                    value={Math.round(selectedArrow.to.x)}
                    onChange={(e) => handleArrowUpdate({ 
                      to: { ...selectedArrow.to, x: Number(e.target.value) } 
                    })}
                    onBlur={handleBlur}
                    className="w-full px-2 py-1 text-sm border border-gray-200 rounded font-mono focus:outline-none focus:border-gray-400"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-gray-400 font-mono">Y</label>
                  <input
                    type="number"
                    value={Math.round(selectedArrow.to.y)}
                    onChange={(e) => handleArrowUpdate({ 
                      to: { ...selectedArrow.to, y: Number(e.target.value) } 
                    })}
                    onBlur={handleBlur}
                    className="w-full px-2 py-1 text-sm border border-gray-200 rounded font-mono focus:outline-none focus:border-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Arrow Style */}
        <div className="p-3 border-b border-gray-200">
          <h3 className="text-[10px] font-mono uppercase text-gray-400 mb-2 tracking-wider">Style</h3>
          <div className="space-y-2">
            <div>
              <label className="text-[10px] text-gray-500 font-mono block mb-1">Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={selectedArrow.style.stroke}
                  onChange={(e) => handleArrowUpdate({ 
                    style: { ...selectedArrow.style, stroke: e.target.value } 
                  })}
                  onBlur={handleBlur}
                  className="w-8 h-8 border border-gray-200 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedArrow.style.stroke}
                  onChange={(e) => handleArrowUpdate({ 
                    style: { ...selectedArrow.style, stroke: e.target.value } 
                  })}
                  onBlur={handleBlur}
                  className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded font-mono focus:outline-none focus:border-gray-400"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 font-mono block mb-1">Width</label>
              <input
                type="number"
                min="1"
                max="10"
                value={selectedArrow.style.strokeWidth}
                onChange={(e) => handleArrowUpdate({ 
                  style: { ...selectedArrow.style, strokeWidth: Number(e.target.value) } 
                })}
                onBlur={handleBlur}
                className="w-full px-2 py-1 text-sm border border-gray-200 rounded font-mono focus:outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 font-mono block mb-1">Type</label>
              <select
                value={selectedArrow.style.type}
                onChange={(e) => handleArrowUpdate({ 
                  style: { ...selectedArrow.style, type: e.target.value as 'straight' | 'curved' | 'step' } 
                })}
                onBlur={handleBlur}
                className="w-full px-2 py-1 text-sm border border-gray-200 rounded font-mono focus:outline-none focus:border-gray-400"
              >
                <option value="straight">Straight</option>
                <option value="curved">Curved</option>
                <option value="step">Step</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedArrow.style.animated}
                onChange={(e) => handleArrowUpdate({ 
                  style: { ...selectedArrow.style, animated: e.target.checked } 
                })}
                onBlur={handleBlur}
                className="w-4 h-4"
              />
              <label className="text-[10px] text-gray-500 font-mono">Animated Flow</label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-3">
          <h3 className="text-[10px] font-mono uppercase text-gray-400 mb-2 tracking-wider">Actions</h3>
          <button 
            onClick={() => {
              deleteArrow(selectedArrow.id);
              saveHistory();
            }}
            className="w-full px-3 py-2 text-xs border border-red-200 text-red-600 rounded hover:bg-red-50 font-mono text-left"
          >
            Delete Arrow
          </button>
        </div>
      </div>
    );
  }

  if (!selectedBlock) {
    return (
      <div className="w-64 border-l border-gray-200 bg-white p-4">
        <div className="text-center text-gray-400 mt-10">
          <p className="text-sm font-mono">No selection</p>
          <p className="text-xs mt-2">Select a block or arrow to edit properties</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 border-l border-gray-200 bg-white overflow-y-auto">
      {/* Block Info */}
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-[10px] font-mono uppercase text-gray-400 mb-2 tracking-wider">Block</h3>
        <div className="space-y-2">
          <div>
            <label className="text-[10px] text-gray-500 font-mono block mb-1">Type</label>
            <div className="text-sm font-mono text-gray-700 capitalize">{selectedBlock.type}</div>
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-mono block mb-1">Label</label>
            <input
              type="text"
              value={selectedBlock.label}
              onChange={(e) => handleBlockUpdate({ label: e.target.value })}
              onBlur={handleBlur}
              className="w-full px-2 py-1 text-sm border border-gray-200 rounded font-mono focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Position */}
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-[10px] font-mono uppercase text-gray-400 mb-2 tracking-wider">Position</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-gray-500 font-mono block mb-1">X</label>
            <input
              type="number"
              value={Math.round(selectedBlock.position.x)}
              onChange={(e) => handleBlockUpdate({ position: { ...selectedBlock.position, x: Number(e.target.value) } })}
              onBlur={handleBlur}
              className="w-full px-2 py-1 text-sm border border-gray-200 rounded font-mono focus:outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-mono block mb-1">Y</label>
            <input
              type="number"
              value={Math.round(selectedBlock.position.y)}
              onChange={(e) => handleBlockUpdate({ position: { ...selectedBlock.position, y: Number(e.target.value) } })}
              onBlur={handleBlur}
              className="w-full px-2 py-1 text-sm border border-gray-200 rounded font-mono focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Size */}
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-[10px] font-mono uppercase text-gray-400 mb-2 tracking-wider">Size</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-gray-500 font-mono block mb-1">Width</label>
            <input
              type="number"
              value={Math.round(selectedBlock.size.width)}
              onChange={(e) => handleBlockUpdate({ size: { ...selectedBlock.size, width: Number(e.target.value) } })}
              onBlur={handleBlur}
              className="w-full px-2 py-1 text-sm border border-gray-200 rounded font-mono focus:outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-mono block mb-1">Height</label>
            <input
              type="number"
              value={Math.round(selectedBlock.size.height)}
              onChange={(e) => handleBlockUpdate({ size: { ...selectedBlock.size, height: Number(e.target.value) } })}
              onBlur={handleBlur}
              className="w-full px-2 py-1 text-sm border border-gray-200 rounded font-mono focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Style */}
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-[10px] font-mono uppercase text-gray-400 mb-2 tracking-wider">Style</h3>
        <div className="space-y-2">
          <div>
            <label className="text-[10px] text-gray-500 font-mono block mb-1">Fill Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={selectedBlock.style.fill}
                onChange={(e) => handleBlockUpdate({ style: { ...selectedBlock.style, fill: e.target.value } })}
                onBlur={handleBlur}
                className="w-8 h-8 border border-gray-200 rounded cursor-pointer"
              />
              <input
                type="text"
                value={selectedBlock.style.fill}
                onChange={(e) => handleBlockUpdate({ style: { ...selectedBlock.style, fill: e.target.value } })}
                onBlur={handleBlur}
                className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded font-mono focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-mono block mb-1">Stroke Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={selectedBlock.style.stroke}
                onChange={(e) => handleBlockUpdate({ style: { ...selectedBlock.style, stroke: e.target.value } })}
                onBlur={handleBlur}
                className="w-8 h-8 border border-gray-200 rounded cursor-pointer"
              />
              <input
                type="text"
                value={selectedBlock.style.stroke}
                onChange={(e) => handleBlockUpdate({ style: { ...selectedBlock.style, stroke: e.target.value } })}
                onBlur={handleBlur}
                className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded font-mono focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-mono block mb-1">Stroke Width</label>
            <input
              type="number"
              min="0"
              max="10"
              value={selectedBlock.style.strokeWidth}
              onChange={(e) => handleBlockUpdate({ style: { ...selectedBlock.style, strokeWidth: Number(e.target.value) } })}
              onBlur={handleBlur}
              className="w-full px-2 py-1 text-sm border border-gray-200 rounded font-mono focus:outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-mono block mb-1">Corner Radius</label>
            <input
              type="number"
              min="0"
              max="50"
              value={selectedBlock.style.cornerRadius}
              onChange={(e) => handleBlockUpdate({ style: { ...selectedBlock.style, cornerRadius: Number(e.target.value) } })}
              onBlur={handleBlur}
              className="w-full px-2 py-1 text-sm border border-gray-200 rounded font-mono focus:outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-mono block mb-1">Opacity</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={selectedBlock.style.opacity}
              onChange={(e) => handleBlockUpdate({ style: { ...selectedBlock.style, opacity: Number(e.target.value) } })}
              onBlur={handleBlur}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-3">
        <h3 className="text-[10px] font-mono uppercase text-gray-400 mb-2 tracking-wider">Actions</h3>
        <div className="space-y-1">
          <button className="w-full px-3 py-2 text-xs border border-gray-200 rounded hover:bg-gray-50 font-mono text-left">
            Duplicate Block
          </button>
          <button className="w-full px-3 py-2 text-xs border border-gray-200 rounded hover:bg-gray-50 font-mono text-left">
            Add Animation
          </button>
          <button className="w-full px-3 py-2 text-xs border border-red-200 text-red-600 rounded hover:bg-red-50 font-mono text-left">
            Delete Block
          </button>
        </div>
      </div>
    </div>
  );
}
