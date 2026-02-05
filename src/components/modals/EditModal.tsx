
import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Language } from '../../lib/types';
import { TRANSLATIONS } from '../../lib/constants';

interface EditModalProps {
  initialText: string;
  isOpen: boolean;
  language: Language;
  onSave: (newText: string) => void;
  onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ initialText, isOpen, language, onSave, onClose }) => {
  const [text, setText] = useState(initialText);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900 dark:text-white">{t.edit}</h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
        </div>
        <div className="p-4">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={150}
                className="w-full h-40 p-3 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-primary/50 outline-none resize-none text-gray-900 dark:text-white"
                autoFocus
                placeholder={t.placeholder}
            />
            <div className="text-right mt-2 text-xs text-gray-500 dark:text-gray-400 font-mono">
                {text.length}/150
            </div>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3 bg-gray-50 dark:bg-white/5">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                {t.cancel}
            </button>
            <button onClick={() => onSave(text)} className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-[#0f4a63] transition-colors flex items-center gap-2">
                <Save size={16} />
                {t.saveChanges}
            </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
