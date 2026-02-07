
export interface CardData {
  id: string;
  sourceId?: string | number;
  text: string;
  text2?: string;
  color: string;
  angle: number;
  height: number;
  radius: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  delay: number;
  isRevealed?: boolean;
}

export interface AppSettings {
  scale: number;
  quantity: number; 
  speed: number; // Rotation speed
  showGrid: boolean;
  isPaused: boolean; // Manual pause state
  maxTextLength: number; // New: Maximum characters (based on CN length)
  theme: ThemeType; // Current theme
}

export type ThemeType = 'quit-porn' | 'reading' | 'quotes' | 'poetry';

export enum CardColor {
  Red = 'red',
  Orange = 'orange', // New
  Yellow = 'yellow',
  Green = 'green', // New
  Teal = 'teal',
  Cyan = 'cyan', // New
  Blue = 'blue',
  Purple = 'purple',
  Pink = 'pink', // New
  Slate = 'slate', // New
  Glass = 'glass'
}

export type Language = 'en' | 'zh';
