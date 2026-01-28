import { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Rect, Circle, Text, Group, Path } from 'react-konva';
import Konva from 'konva';
import { useStore } from '../store/useStore';
import { Block, BlockType, Arrow } from '../types';

export default function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPos, setLastPanPos] = useState({ x: 0, y: 0 });

  const {
    blocks,
    arrows,
    selectedBlockIds,
    selectedArrowId,
    canvas,
    activeTool,
    addBlock,
    updateBlock,
    selectBlock,
    clearSelection,
    setCanvasPosition,
    setCanvasScale,
    addArrow,
    updateArrow,
    deleteArrow,
    selectArrow,
    saveHistory,
    isPlaying,
    currentTime,
  } = useStore();

  // Resize handler
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Wheel zoom
  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = canvas.scale;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - canvas.position.x) / oldScale,
      y: (pointer.y - canvas.position.y) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = direction > 0 ? oldScale * 1.1 : oldScale / 1.1;
    const clampedScale = Math.max(0.1, Math.min(3, newScale));

    setCanvasScale(clampedScale);
    setCanvasPosition(
      pointer.x - mousePointTo.x * clampedScale,
      pointer.y - mousePointTo.y * clampedScale
    );
  }, [canvas, setCanvasScale, setCanvasPosition]);

  // Pan handlers
  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (activeTool === 'pan' || e.evt.button === 1) {
      setIsPanning(true);
      setLastPanPos({ x: e.evt.clientX, y: e.evt.clientY });
    } else if (e.target === e.target.getStage()) {
      if (activeTool === 'connection') {
        // Створюємо нову стрілку при кліку на canvas
        const pointer = stageRef.current?.getPointerPosition();
        if (pointer) {
          const x = (pointer.x - canvas.position.x) / canvas.scale;
          const y = (pointer.y - canvas.position.y) / canvas.scale;
          addArrow(x, y, x + 100, y + 50);
          saveHistory();
        }
      } else {
        clearSelection();
        selectArrow(null);
      }
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isPanning) {
      const dx = e.evt.clientX - lastPanPos.x;
      const dy = e.evt.clientY - lastPanPos.y;
      setCanvasPosition(canvas.position.x + dx, canvas.position.y + dy);
      setLastPanPos({ x: e.evt.clientX, y: e.evt.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Drop handler for drag-and-drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const blockType = e.dataTransfer.getData('blockType') as BlockType;
    if (blockType && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - canvas.position.x) / canvas.scale;
      const y = (e.clientY - rect.top - canvas.position.y) / canvas.scale;
      addBlock(blockType, x, y);
      saveHistory();
    }
  }, [addBlock, canvas, saveHistory]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Calculate path for arrow based on type
  const getArrowPath = (
    from: { x: number; y: number }, 
    to: { x: number; y: number },
    type: 'straight' | 'curved' | 'step'
  ): string => {
    if (type === 'straight') {
      return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
    }
    
    if (type === 'step') {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const midX = from.x + dx * 0.5;
      return `M ${from.x} ${from.y} L ${midX} ${from.y} L ${midX} ${to.y} L ${to.x} ${to.y}`;
    }
    
    // Curved (bezier)
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    
    // Control points for smooth curve
    const cp1x = from.x + dx * 0.5;
    const cp1y = from.y;
    const cp2x = from.x + dx * 0.5;
    const cp2y = to.y;
    
    return `M ${from.x} ${from.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${to.x} ${to.y}`;
  };

  // Get arrow head path
  const getArrowHead = (from: { x: number; y: number }, to: { x: number; y: number }): string => {
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const arrowLength = 12;
    
    const x1 = to.x - arrowLength * Math.cos(angle - Math.PI / 6);
    const y1 = to.y - arrowLength * Math.sin(angle - Math.PI / 6);
    const x2 = to.x - arrowLength * Math.cos(angle + Math.PI / 6);
    const y2 = to.y - arrowLength * Math.sin(angle + Math.PI / 6);
    
    return `M ${to.x} ${to.y} L ${x1} ${y1} M ${to.x} ${to.y} L ${x2} ${y2}`;
  };

  // Calculate point on path at t (0-1)
  const getPointOnPath = (
    from: { x: number; y: number },
    to: { x: number; y: number },
    type: 'straight' | 'curved' | 'step',
    t: number
  ): { x: number; y: number } => {
    if (type === 'straight') {
      return {
        x: from.x + (to.x - from.x) * t,
        y: from.y + (to.y - from.y) * t,
      };
    }
    
    if (type === 'step') {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const midX = from.x + dx * 0.5;
      
      if (t < 0.5) {
        const localT = t * 2;
        return {
          x: from.x + (midX - from.x) * localT,
          y: from.y,
        };
      } else {
        const localT = (t - 0.5) * 2;
        return {
          x: midX,
          y: from.y + (to.y - from.y) * localT,
        };
      }
    }
    
    // Curved (bezier)
    const dx = to.x - from.x;
    const cp1x = from.x + dx * 0.5;
    const cp1y = from.y;
    const cp2x = from.x + dx * 0.5;
    const cp2y = to.y;
    
    // Cubic bezier: (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const t2 = t * t;
    const t3 = t2 * t;
    
    return {
      x: mt3 * from.x + 3 * mt2 * t * cp1x + 3 * mt * t2 * cp2x + t3 * to.x,
      y: mt3 * from.y + 3 * mt2 * t * cp1y + 3 * mt * t2 * cp2y + t3 * to.y,
    };
  };

  // Render block based on type
  const renderBlock = (block: Block) => {
    const isSelected = selectedBlockIds.includes(block.id);
    const commonProps = {
      x: block.position.x,
      y: block.position.y,
      draggable: activeTool === 'select',
      onClick: (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (activeTool !== 'connection') {
          selectBlock(block.id, e.evt.shiftKey);
          selectArrow(null);
        }
      },
      onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => {
        updateBlock(block.id, {
          position: { x: e.target.x(), y: e.target.y() },
        });
        saveHistory();
      },
    };

    if (block.type === 'circle') {
      return (
        <Group key={block.id} {...commonProps}>
          <Circle
            radius={block.size.width / 2}
            fill={block.style.fill}
            stroke={isSelected ? '#58a6ff' : block.style.stroke}
            strokeWidth={isSelected ? 2 : block.style.strokeWidth}
            opacity={block.style.opacity}
          />
          <Text
            text={block.label}
            fontSize={12}
            fill="#333"
            fontFamily="Space Mono"
            align="center"
            verticalAlign="middle"
            width={block.size.width}
            height={block.size.height}
            offsetX={block.size.width / 2}
            offsetY={block.size.height / 2}
          />
        </Group>
      );
    }

    return (
      <Group key={block.id} {...commonProps}>
        <Rect
          width={block.size.width}
          height={block.size.height}
          fill={block.style.fill}
          stroke={isSelected ? '#58a6ff' : block.style.stroke}
          strokeWidth={isSelected ? 2 : block.style.strokeWidth}
          cornerRadius={block.style.cornerRadius}
          opacity={block.style.opacity}
          shadowColor={isSelected ? '#58a6ff' : 'transparent'}
          shadowBlur={isSelected ? 10 : 0}
          shadowOpacity={0.3}
        />
        <Text
          text={block.label}
          fontSize={12}
          fill="#333"
          fontFamily="Space Mono"
          align="center"
          verticalAlign="middle"
          width={block.size.width}
          height={block.size.height}
          padding={8}
        />
      </Group>
    );
  };

  // Render arrows with draggable points
  const renderArrow = (arrow: Arrow) => {
    const isSelected = selectedArrowId === arrow.id;
    const path = getArrowPath(arrow.from, arrow.to, arrow.style.type);
    const arrowHead = getArrowHead(arrow.from, arrow.to);

    // Calculate flow dot position for animation
    const flowProgress = isPlaying ? (currentTime % 2) / 2 : 0;
    const flowPos = getPointOnPath(arrow.from, arrow.to, arrow.style.type, flowProgress);

    return (
      <Group 
        key={arrow.id}
        onClick={(e) => {
          e.cancelBubble = true;
          if (activeTool === 'select') {
            selectArrow(arrow.id);
            clearSelection();
          }
        }}
        onTap={(e) => {
          if (activeTool === 'select') {
            selectArrow(arrow.id);
            clearSelection();
          }
        }}
      >
        {/* Main path */}
        <Path
          data={path}
          stroke={isSelected ? '#58a6ff' : arrow.style.stroke}
          strokeWidth={isSelected ? arrow.style.strokeWidth + 1 : arrow.style.strokeWidth}
          fill="transparent"
          tension={arrow.style.type === 'curved' ? 0.5 : 0}
          lineCap="round"
          lineJoin="round"
          opacity={isSelected ? 1 : 0.8}
          shadowColor={isSelected ? '#58a6ff' : 'transparent'}
          shadowBlur={isSelected ? 8 : 0}
          shadowOpacity={0.4}
        />
        {/* Arrow head */}
        <Path
          data={arrowHead}
          stroke={isSelected ? '#58a6ff' : arrow.style.stroke}
          strokeWidth={isSelected ? arrow.style.strokeWidth + 1 : arrow.style.strokeWidth}
          fill="transparent"
          lineCap="round"
          lineJoin="round"
        />
        {/* Animated flow dot */}
        {arrow.style.animated && isPlaying && (
          <Circle
            radius={5}
            fill={arrow.style.stroke}
            stroke="#fff"
            strokeWidth={1}
            opacity={0.9}
            x={flowPos.x}
            y={flowPos.y}
            shadowBlur={8}
            shadowColor={arrow.style.stroke}
            shadowOpacity={0.6}
          />
        )}
        
        {/* Draggable points - rendered on top */}
        {isSelected && (
          <>
            {/* From point */}
            <Circle
              x={arrow.from.x}
              y={arrow.from.y}
              radius={12}
              fill="#58a6ff"
              stroke="#fff"
              strokeWidth={3}
              draggable={activeTool === 'select'}
              onDragStart={(e) => {
                e.cancelBubble = true;
              }}
              onDragMove={(e) => {
                e.cancelBubble = true;
                const newX = e.target.x();
                const newY = e.target.y();
                updateArrow(arrow.id, { from: { x: newX, y: newY } });
              }}
              onDragEnd={(e) => {
                e.cancelBubble = true;
                const newX = e.target.x();
                const newY = e.target.y();
                updateArrow(arrow.id, { from: { x: newX, y: newY } });
                saveHistory();
              }}
              onMouseEnter={(e) => {
                const container = e.target.getStage()?.container();
                if (container && activeTool === 'select') {
                  container.style.cursor = 'move';
                }
              }}
              onMouseLeave={(e) => {
                const container = e.target.getStage()?.container();
                if (container) {
                  container.style.cursor = 'default';
                }
              }}
              onClick={(e) => {
                e.cancelBubble = true;
              }}
              listening={true}
            />
            {/* To point */}
            <Circle
              x={arrow.to.x}
              y={arrow.to.y}
              radius={12}
              fill="#58a6ff"
              stroke="#fff"
              strokeWidth={3}
              draggable={activeTool === 'select'}
              onDragStart={(e) => {
                e.cancelBubble = true;
              }}
              onDragMove={(e) => {
                e.cancelBubble = true;
                const newX = e.target.x();
                const newY = e.target.y();
                updateArrow(arrow.id, { to: { x: newX, y: newY } });
              }}
              onDragEnd={(e) => {
                e.cancelBubble = true;
                const newX = e.target.x();
                const newY = e.target.y();
                updateArrow(arrow.id, { to: { x: newX, y: newY } });
                saveHistory();
              }}
              onMouseEnter={(e) => {
                const container = e.target.getStage()?.container();
                if (container && activeTool === 'select') {
                  container.style.cursor = 'move';
                }
              }}
              onMouseLeave={(e) => {
                const container = e.target.getStage()?.container();
                if (container) {
                  container.style.cursor = 'default';
                }
              }}
              onClick={(e) => {
                e.cancelBubble = true;
              }}
              listening={true}
            />
          </>
        )}

        {/* Invisible hit area for easier clicking (but not blocking points) */}
        {!isSelected && (
          <Path
            data={path}
            stroke="transparent"
            strokeWidth={20}
            fill="transparent"
            globalCompositeOperation="source-over"
          />
        )}
      </Group>
    );
  };

  return (
    <div 
      ref={containerRef} 
      className="flex-1 bg-[#fafafa] canvas-grid relative overflow-hidden"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{ cursor: activeTool === 'pan' || isPanning ? 'grab' : activeTool === 'connection' ? 'crosshair' : 'default' }}
    >
      {/* Canvas info overlay */}
      <div className="absolute top-3 left-3 text-[10px] font-mono text-gray-400 z-10 pointer-events-none">
        {Math.round(canvas.position.x)}, {Math.round(canvas.position.y)} · {Math.round(canvas.scale * 100)}%
        {activeTool === 'connection' && (
          <span className="ml-2 text-blue-600">Click on canvas to create arrow</span>
        )}
      </div>

      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        x={canvas.position.x}
        y={canvas.position.y}
        scaleX={canvas.scale}
        scaleY={canvas.scale}
      >
        <Layer>
          {/* Arrows first (below blocks) */}
          {arrows.map(renderArrow)}
          
          {/* Blocks */}
          {blocks.map(renderBlock)}
        </Layer>
      </Stage>

      {/* Empty state */}
      {blocks.length === 0 && arrows.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-2xl text-gray-300">+</span>
            </div>
            <p className="text-sm text-gray-400 font-mono">Drag blocks from the left panel</p>
            <p className="text-xs text-gray-300 font-mono mt-1">or click components to add them</p>
          </div>
        </div>
      )}
    </div>
  );
}
