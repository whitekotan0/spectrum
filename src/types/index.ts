export type BlockType = 
  | 'rectangle'
  | 'circle'
  | 'token'
  | 'embedding'
  | 'attention'
  | 'mlp'
  | 'layernorm'
  | 'output'
  | 'text';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface BlockStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  cornerRadius: number;
}

export interface Block {
  id: string;
  type: BlockType;
  position: Position;
  size: Size;
  style: BlockStyle;
  label: string;
  rotation: number;
  locked: boolean;
  visible: boolean;
}

export interface Arrow {
  id: string;
  from: Position;  // Вільна точка "від"
  to: Position;      // Вільна точка "до"
  style: {
    stroke: string;
    strokeWidth: number;
    type: 'straight' | 'curved' | 'step';
    animated: boolean;
  };
}

// Старий тип для сумісності (буде видалено)
export interface Connection extends Arrow {}

export interface Keyframe {
  id: string;
  time: number;
  blockId: string;
  property: string;
  value: number | string;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

export interface CanvasState {
  position: Position;
  scale: number;
}

export interface ToolType {
  name: 'select' | 'pan' | 'rectangle' | 'circle' | 'text' | 'connection' | 'token' | 'attention' | 'mlp';
}

export const DEFAULT_BLOCK_STYLES: Record<BlockType, Partial<Block>> = {
  rectangle: {
    size: { width: 120, height: 80 },
    style: {
      fill: '#ffffff',
      stroke: '#1a1a1a',
      strokeWidth: 1,
      opacity: 1,
      cornerRadius: 4,
    },
  },
  circle: {
    size: { width: 60, height: 60 },
    style: {
      fill: '#ffffff',
      stroke: '#1a1a1a',
      strokeWidth: 1,
      opacity: 1,
      cornerRadius: 30,
    },
  },
  token: {
    size: { width: 80, height: 40 },
    style: {
      fill: '#e3f2fd',
      stroke: '#1976d2',
      strokeWidth: 2,
      opacity: 1,
      cornerRadius: 8,
    },
    label: 'Token',
  },
  embedding: {
    size: { width: 140, height: 60 },
    style: {
      fill: '#f3e5f5',
      stroke: '#7b1fa2',
      strokeWidth: 2,
      opacity: 1,
      cornerRadius: 4,
    },
    label: 'Embedding',
  },
  attention: {
    size: { width: 160, height: 80 },
    style: {
      fill: '#fff3e0',
      stroke: '#f57c00',
      strokeWidth: 2,
      opacity: 1,
      cornerRadius: 8,
    },
    label: 'Multi-Head Attention',
  },
  mlp: {
    size: { width: 140, height: 70 },
    style: {
      fill: '#e8f5e9',
      stroke: '#388e3c',
      strokeWidth: 2,
      opacity: 1,
      cornerRadius: 4,
    },
    label: 'Feed Forward',
  },
  layernorm: {
    size: { width: 120, height: 30 },
    style: {
      fill: '#fafafa',
      stroke: '#9e9e9e',
      strokeWidth: 1,
      opacity: 1,
      cornerRadius: 4,
    },
    label: 'LayerNorm',
  },
  output: {
    size: { width: 120, height: 60 },
    style: {
      fill: '#ffebee',
      stroke: '#d32f2f',
      strokeWidth: 2,
      opacity: 1,
      cornerRadius: 4,
    },
    label: 'Output',
  },
  text: {
    size: { width: 100, height: 30 },
    style: {
      fill: 'transparent',
      stroke: 'transparent',
      strokeWidth: 0,
      opacity: 1,
      cornerRadius: 0,
    },
    label: 'Text',
  },
};
