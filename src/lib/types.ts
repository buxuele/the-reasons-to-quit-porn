
export interface CardData {
  id: string;
  sourceId?: string | number; // Optional ID linking back to source data
  text: string;
  text2?: string; // Optional second line (for translation, etc.)
  color: string;
  angle: number; // Position on the ring (0-360 degrees)
  height: number; // Vertical offset percentage (-50 to 50)
  radius: number; // Distance from center percentage
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  delay: number;
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

export type ThemeType = 'quit-porn' | 'reading' | 'quotes';

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
