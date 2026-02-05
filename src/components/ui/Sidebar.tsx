
import React, { useState } from 'react';
import { X, SlidersHorizontal, PlusCircle, Save, Globe, RotateCcw, Github } from 'lucide-react';
import { AppSettings, CardColor, Language, ThemeType } from '../../lib/types';
import { COLOR_DOT_MAP, TRANSLATIONS } from '../../lib/constants';
import { THEME_NAMES } from '../../lib/data/data-themes';

interface SidebarProps {
  settings: AppSettings;
  language: Language;
  isOpen: boolean;
  onUpdateSettings: (key: keyof AppSettings, value: any) => void;
  onAddCard: (text: string, color: CardColor) => void;
  onToggleLanguage: () => void;
  onSave: () => void;
  onReset: () => void;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  settings, 
  language,
  isOpen,
  onUpdateSettings, 
  onAddCard,
  onToggleLanguage,
  onSave,
  onReset,
  onClose
}) => {
  const [newCardText, setNewCardText] = useState('');
  const [selectedColor, setSelectedColor] = useState<CardColor>(CardColor.Red);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [saveBtnText, setSaveBtnText] = useState<string | null>(null);
  const [resetBtnText, setResetBtnText] = useState<string | null>(null);

  const t = TRANSLATIONS[language];

  const handleSubmit = () => {
    if (!newCardText.trim()) return;
    onAddCard(newCardText, selectedColor);
    setNewCardText('');
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSave = () => {
    onSave();
    setSaveBtnText(t.saved);
    setTimeout(() => setSaveBtnText(null), 2000);
  };

  const handleReset = () => {
    if (window.confirm(t.resetConfirm)) {
        onReset();
        setResetBtnText(t.resetting);
        setTimeout(() => setResetBtnText(null), 1000);
    }
  };

  return (
    <aside 
      className={`
        fixed top-4 right-4 bottom-4 w-[380px] z-50 
        /* Solid Glass Effect: Higher opacity (95%) and stronger borders */
        bg-gray-50/95 dark:bg-[#0f172a]/95
        backdrop-blur-xl
        border-2 border-white/60 dark:border-white/20
        shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_20px_50px_rgba(0,0,0,0.5)] 
        rounded-3xl
        flex flex-col 
        transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
        text-gray-900 dark:text-white
        ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0 pointer-events-none'}
      `}
    >
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-white/50 dark:bg-white/5 rounded-t-3xl">
        <div>
          <h2 className="text-xl font-bold tracking-tight font-sans bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            {t.editor}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.configure}</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={onToggleLanguage}
                className="w-10 h-8 flex items-center justify-center rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-black/5 dark:hover:bg-white/10 transition-all"
                title="Switch Language"
            >
                <Globe size={16} />
            </button>
            <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 transition-all"
                title="Close"
            >
                <X size={18} />
            </button>
        </div>
      </div>

      {/* Theme Selector */}
      <div className="px-8 py-4 border-b border-gray-200 dark:border-white/10 bg-white/30 dark:bg-white/5">
        <div className="flex gap-2">
          {(['quit-porn', 'reading', 'quotes'] as ThemeType[]).map((theme) => (
            <button
              key={theme}
              onClick={() => onUpdateSettings('theme', theme)}
              className={`
                flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all
                ${settings.theme === theme 
                  ? 'bg-primary text-white shadow-md shadow-primary/25' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }
              `}
            >
              {THEME_NAMES[theme][language]}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 scrollbar-hide">
        
        {/* Appearance Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{t.appearance}</h3>
            <SlidersHorizontal size={14} className="text-gray-400 dark:text-gray-500" />
          </div>

          <div className="space-y-6">
            {/* Controls */}
            {[
              { label: t.quantity, value: settings.quantity, key: 'quantity', min: 1, max: 20, step: 1, format: (v: number) => v },
              { label: t.scale, value: settings.scale, key: 'scale', min: 0.5, max: 1.5, step: 0.1, format: (v: number) => v.toFixed(1) + 'x' },
              { label: t.speed, value: settings.speed, key: 'speed', min: 0, max: 100, step: 5, format: (v: number) => v },
              // New Max Length Slider
              { label: t.maxLength, value: settings.maxTextLength, key: 'maxTextLength', min: 10, max: 150, step: 5, format: (v: number) => v }
            ].map((control) => (
              <div key={control.key} className="group">
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">{control.label}</label>
                  <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                    {control.format(control.value as number)}
                  </span>
                </div>
                <input
                  type="range"
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  value={control.value as number}
                  onChange={(e) => onUpdateSettings(control.key as keyof AppSettings, parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-primary hover:accent-indigo-400 transition-colors"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Separator */}
        <div className="h-px bg-gray-200 dark:bg-white/10" />

        {/* Add New Thought Section */}
        <section className="space-y-5">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{t.addThought}</h3>
          
          <div className="bg-white dark:bg-black/30 rounded-2xl p-1 border border-gray-200 dark:border-white/10 shadow-sm focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <textarea
              value={newCardText}
              onChange={(e) => setNewCardText(e.target.value)}
              maxLength={150}
              className="w-full h-24 bg-transparent rounded-xl p-3 text-sm text-gray-800 dark:text-gray-200 resize-none placeholder-gray-400 dark:placeholder-gray-500 outline-none"
              placeholder={t.placeholder}
            ></textarea>
            <div className="flex justify-between items-center px-3 pb-2">
               {/* Added flex-wrap and max-width to handle many colors gracefully */}
               <div className="flex flex-wrap gap-2 max-w-[240px]">
                  {Object.values(CardColor).filter(c => c !== CardColor.Glass).map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`
                        w-5 h-5 rounded-full transition-all
                        ${COLOR_DOT_MAP[color]}
                        ${selectedColor === color ? 'ring-2 ring-offset-1 ring-offset-white dark:ring-offset-slate-800 ring-gray-400 dark:ring-gray-400 scale-110 shadow-md' : 'hover:scale-110 opacity-70 hover:opacity-100'}
                      `}
                    />
                  ))}
                   <button
                     onClick={() => setSelectedColor(CardColor.Glass)}
                     className={`
                       w-5 h-5 rounded-full transition-all border border-gray-300 dark:border-white/30
                       bg-white/10
                       ${selectedColor === CardColor.Glass ? 'ring-2 ring-offset-1 ring-offset-white dark:ring-offset-slate-800 ring-gray-400 dark:ring-gray-400 scale-110 shadow-md' : 'hover:scale-110 opacity-70 hover:opacity-100'}
                     `}
                   />
                </div>
                <div className="text-[10px] text-gray-400 font-mono whitespace-nowrap self-end ml-1">
                  {newCardText.length}/150
                </div>
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={!newCardText.trim()}
            className="w-full py-3 bg-primary hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <PlusCircle size={16} />
            {t.createBtn}
          </button>
        </section>

        {/* Footer Toggle */}
        <div className="pt-2 space-y-3">
          <button 
            onClick={handleToggleDarkMode}
            className="w-full flex items-center justify-between py-3 px-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors group shadow-sm"
          >
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t.darkMode}</span>
            <div className={`w-9 h-5 ${isDarkMode ? 'bg-indigo-500' : 'bg-gray-300'} rounded-full relative transition-colors`}>
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${isDarkMode ? 'left-[20px]' : 'left-1'}`}></div>
            </div>
          </button>

          <div className="flex gap-2">
            <a 
              href="https://x.com/fanchuangwater" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300 text-xs font-medium"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              <span>X</span>
            </a>
            <a 
              href="https://github.com/buxuelezhihu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300 text-xs font-medium"
            >
              <Github size={16} />
              <span>GitHub</span>
            </a>
            <a 
              href="https://www.zhihu.com/people/fanchaung" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300 text-xs font-medium"
            >
              <span className="text-base font-bold">知</span>
            </a>
          </div>
        </div>
      </div>

       {/* Bottom Actions */}
       <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-gray-100/50 dark:bg-black/30 rounded-b-3xl flex gap-3">
          <button 
            onClick={handleReset}
            className="flex-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
            title={language === 'en' ? "Reset to Defaults" : "恢复默认设置"}
          >
             <RotateCcw size={14} />
             {resetBtnText || t.reset}
          </button>
          <div className="w-px bg-gray-300 dark:bg-white/10 my-1"></div>
          <button 
            onClick={handleSave}
            className="flex-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
            title={language === 'en' ? "Save to LocalStorage" : "保存到本地缓存"}
          >
             <Save size={14} />
             {saveBtnText || t.save}
          </button>
       </div>
    </aside>
  );
};

export default Sidebar;
