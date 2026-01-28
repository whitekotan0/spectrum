import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { Block, Arrow, CanvasState, BlockType, DEFAULT_BLOCK_STYLES, Keyframe } from '../types';

interface StoreState {
  // Canvas
  canvas: CanvasState;
  setCanvasPosition: (x: number, y: number) => void;
  setCanvasScale: (scale: number) => void;
  
  // Blocks
  blocks: Block[];
  selectedBlockIds: string[];
  addBlock: (type: BlockType, x: number, y: number) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  selectBlock: (id: string, multi?: boolean) => void;
  clearSelection: () => void;
  
  // Arrows
  arrows: Arrow[];
  selectedArrowId: string | null;
  addArrow: (x1: number, y1: number, x2: number, y2: number) => void;
  updateArrow: (id: string, updates: Partial<Arrow>) => void;
  deleteArrow: (id: string) => void;
  selectArrow: (id: string | null) => void;
  
  // Timeline
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  keyframes: Keyframe[];
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  togglePlay: () => void;
  addKeyframe: (keyframe: Omit<Keyframe, 'id'>) => void;
  
  // Tool
  activeTool: string;
  setActiveTool: (tool: string) => void;
  
  // History
  history: { blocks: Block[]; arrows: Arrow[] }[];
  historyIndex: number;
  undo: () => void;
  redo: () => void;
  saveHistory: () => void;
}

export const useStore = create<StoreState>()((set, get) => ({
  // Canvas
  canvas: { position: { x: 0, y: 0 }, scale: 1 },
  setCanvasPosition: (x, y) =>
    set({ canvas: { ...get().canvas, position: { x, y } } }),
  setCanvasScale: (scale) =>
    set({ canvas: { ...get().canvas, scale: Math.max(0.1, Math.min(3, scale)) } }),
  
  // Blocks
  blocks: [],
  selectedBlockIds: [],
  addBlock: (type, x, y) => {
    const defaults = DEFAULT_BLOCK_STYLES[type];
    const newBlock: Block = {
      id: uuid(),
      type,
      position: { x, y },
      size: defaults.size || { width: 100, height: 60 },
      style: defaults.style || {
        fill: '#ffffff',
        stroke: '#1a1a1a',
        strokeWidth: 1,
        opacity: 1,
        cornerRadius: 4,
      },
      label: defaults.label || type,
      rotation: 0,
      locked: false,
      visible: true,
    };
    set({ 
      blocks: [...get().blocks, newBlock],
      selectedBlockIds: [newBlock.id]
    });
  },
  updateBlock: (id, updates) =>
    set({
      blocks: get().blocks.map((b) =>
        b.id === id ? { ...b, ...updates } : b
      ),
    }),
  deleteBlock: (id) =>
    set({
      blocks: get().blocks.filter((b) => b.id !== id),
      selectedBlockIds: get().selectedBlockIds.filter((sid) => sid !== id),
    }),
  selectBlock: (id, multi = false) =>
    set({
      selectedBlockIds: multi
        ? get().selectedBlockIds.includes(id)
          ? get().selectedBlockIds.filter((sid) => sid !== id)
          : [...get().selectedBlockIds, id]
        : [id],
    }),
  clearSelection: () => set({ selectedBlockIds: [] }),
  
  // Arrows
  arrows: [],
  selectedArrowId: null,
  addArrow: (x1, y1, x2, y2) => {
    const newArrow: Arrow = {
      id: uuid(),
      from: { x: x1, y: y1 },
      to: { x: x2, y: y2 },
      style: {
        stroke: '#1a1a1a',
        strokeWidth: 2,
        type: 'curved',
        animated: true,
      },
    };
    set({ 
      arrows: [...get().arrows, newArrow],
      selectedArrowId: newArrow.id
    });
  },
  updateArrow: (id, updates) =>
    set({
      arrows: get().arrows.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    }),
  deleteArrow: (id) =>
    set({ 
      arrows: get().arrows.filter((a) => a.id !== id),
      selectedArrowId: get().selectedArrowId === id ? null : get().selectedArrowId
    }),
  selectArrow: (id) => set({ selectedArrowId: id }),
  
  // Timeline
  currentTime: 0,
  duration: 10,
  isPlaying: false,
  keyframes: [],
  setCurrentTime: (time) =>
    set({ currentTime: Math.max(0, Math.min(time, get().duration)) }),
  setDuration: (duration) => set({ duration }),
  togglePlay: () => set({ isPlaying: !get().isPlaying }),
  addKeyframe: (keyframe) =>
    set({ keyframes: [...get().keyframes, { ...keyframe, id: uuid() }] }),
  
  // Tool
  activeTool: 'select',
  setActiveTool: (tool) => set({ activeTool: tool }),
  
  // History
  history: [],
  historyIndex: -1,
  saveHistory: () => {
    const { blocks, arrows, history, historyIndex } = get();
    const snapshot = {
      blocks: JSON.parse(JSON.stringify(blocks)),
      arrows: JSON.parse(JSON.stringify(arrows)),
    };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(snapshot);
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },
  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const snapshot = history[newIndex];
      set({
        historyIndex: newIndex,
        blocks: snapshot.blocks,
        arrows: snapshot.arrows,
      });
    }
  },
  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const snapshot = history[newIndex];
      set({
        historyIndex: newIndex,
        blocks: snapshot.blocks,
        arrows: snapshot.arrows,
      });
    }
  },
}));
