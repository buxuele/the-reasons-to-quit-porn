
import { CardColor } from './types';

// Enhanced Glassmorphism:
// OPTIMIZATION: Shadows are expensive. reduced spread radius slightly for better FPS.
const baseCardStyle = "text-white backdrop-blur-md border shadow-[0_4px_24px_0_rgba(0,0,0,0.25)] shadow-inner drop-shadow-lg text-shadow-sm";

export const COLOR_MAP: Record<string, string> = {
  [CardColor.Red]:    `${baseCardStyle} bg-gradient-to-br from-rose-500/80 to-red-900/80 border-rose-400/30`,
  [CardColor.Orange]: `${baseCardStyle} bg-gradient-to-br from-orange-500/80 to-red-800/80 border-orange-400/30`,
  [CardColor.Yellow]: `${baseCardStyle} bg-gradient-to-br from-amber-400/80 to-orange-700/80 border-amber-300/30`,
  [CardColor.Green]:  `${baseCardStyle} bg-gradient-to-br from-lime-500/80 to-green-900/80 border-lime-400/30`,
  [CardColor.Teal]:   `${baseCardStyle} bg-gradient-to-br from-emerald-400/80 to-teal-900/80 border-emerald-400/30`,
  [CardColor.Cyan]:   `${baseCardStyle} bg-gradient-to-br from-cyan-500/80 to-blue-900/80 border-cyan-400/30`,
  [CardColor.Blue]:   `${baseCardStyle} bg-gradient-to-br from-blue-500/80 to-indigo-900/80 border-blue-400/30`,
  [CardColor.Purple]: `${baseCardStyle} bg-gradient-to-br from-fuchsia-500/80 to-purple-900/80 border-fuchsia-400/30`,
  [CardColor.Pink]:   `${baseCardStyle} bg-gradient-to-br from-pink-500/80 to-rose-900/80 border-pink-400/30`,
  [CardColor.Slate]:  `${baseCardStyle} bg-gradient-to-br from-slate-500/80 to-gray-900/80 border-slate-400/30`,
  [CardColor.Glass]:  `${baseCardStyle} bg-gradient-to-br from-white/10 to-white/5 border-white/20`,
};

export const COLOR_DOT_MAP: Record<string, string> = {
  [CardColor.Red]:    'bg-gradient-to-r from-rose-500 to-red-600 shadow-lg shadow-rose-500/40',
  [CardColor.Orange]: 'bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/40',
  [CardColor.Yellow]: 'bg-gradient-to-r from-amber-400 to-orange-600 shadow-lg shadow-amber-500/40',
  [CardColor.Green]:  'bg-gradient-to-r from-lime-500 to-green-700 shadow-lg shadow-lime-500/40',
  [CardColor.Teal]:   'bg-gradient-to-r from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/40',
  [CardColor.Cyan]:   'bg-gradient-to-r from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/40',
  [CardColor.Blue]:   'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/40',
  [CardColor.Purple]: 'bg-gradient-to-r from-fuchsia-500 to-purple-600 shadow-lg shadow-fuchsia-500/40',
  [CardColor.Pink]:   'bg-gradient-to-r from-pink-500 to-rose-600 shadow-lg shadow-pink-500/40',
  [CardColor.Slate]:  'bg-gradient-to-r from-slate-500 to-gray-700 shadow-lg shadow-slate-500/40',
  [CardColor.Glass]:  'bg-slate-400 shadow-lg shadow-slate-400/40',
};

export const TRANSLATIONS = {
  en: {
    editor: "Editor",
    configure: "Configure your workspace",
    appearance: "Appearance",
    scale: "Card Scale",
    speed: "Rotation Speed",
    addThought: "Add New Thought",
    cardTint: "Card Tint",
    placeholder: "What's on your mind today?",
    createBtn: "Create Card",
    darkMode: "Dark Mode",
    save: "Save Layout",
    saved: "Saved!",
    reset: "Reset Defaults",
    resetting: "Resetting...",
    resetConfirm: "Are you sure you want to reset everything to default? All current cards will be lost.",
    language: "Language",
    quantity: "Quantity",
    close: "Close",
    languageLabel: "Language",
    delete: "Delete",
    edit: "Edit",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    maxLength: "Max Length",
    theme: "Theme",
  },
  zh: {
    editor: "编辑器",
    configure: "配置你的工作空间",
    appearance: "外观设置",
    scale: "卡片缩放",
    speed: "旋转速度",
    addThought: "添加新想法",
    cardTint: "卡片色调",
    placeholder: "今天在想什么？",
    createBtn: "创建卡片",
    darkMode: "深色模式",
    save: "保存布局",
    saved: "已保存!",
    reset: "恢复默认",
    resetting: "重置中...",
    resetConfirm: "确定要将所有内容重置为默认值吗？当前所有自定义卡片都将丢失。",
    language: "语言",
    quantity: "卡片数量",
    close: "关闭",
    languageLabel: "语言",
    delete: "删除",
    edit: "编辑",
    saveChanges: "保存更改",
    cancel: "取消",
    maxLength: "最大字数",
    theme: "主题",
  }
};
