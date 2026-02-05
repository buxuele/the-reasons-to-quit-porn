import React from 'react';
import { Menu } from 'lucide-react';

interface ToolbarProps {
  onToggleSidebar: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  onToggleSidebar,
}) => {
  return (
    <div className="absolute top-6 right-6 z-40">
      <button 
        onClick={onToggleSidebar}
        className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white shadow-lg hover:bg-white/20 hover:scale-105 active:scale-95 transition-all"
        title="Open Menu"
      >
        <Menu size={24} />
      </button>
    </div>
  );
};

export default Toolbar;
