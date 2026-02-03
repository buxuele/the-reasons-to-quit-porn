import React, { useEffect, useRef } from 'react';
import { Trash2, Pencil, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface ContextMenuProps {
  x: number;
  y: number;
  language: Language;
  onEdit: () => void;
  onDelete: () => void;
  onAIAnalyze: () => void;
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, language, onEdit, onDelete, onAIAnalyze, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    // Use mousedown to capture the click before it might trigger other things
    document.addEventListener('mousedown', handleClickOutside);
    // Also close on scroll or window resize for better UX
    window.addEventListener('scroll', onClose);
    window.addEventListener('resize', onClose);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', onClose);
      window.removeEventListener('resize', onClose);
    };
  }, [onClose]);

  const t = TRANSLATIONS[language];

  return (
    <div 
      ref={menuRef}
      className="fixed z-[100] min-w-[160px] bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top-left ring-1 ring-black/5"
      style={{ top: y, left: x }}
    >
      <div className="p-1">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAIAnalyze();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-left group"
        >
          <Sparkles size={16} className="group-hover:scale-110 transition-transform" />
          {language === 'zh' ? 'AI 解读' : 'AI Analysis'}
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-left group"
        >
          <Pencil size={16} className="text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors" />
          {t.edit || 'Edit'}
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left group"
        >
          <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
          {t.delete || 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default ContextMenu;
