
import React from 'react';

interface BackgroundProps {
  showGrid: boolean;
}

const Background: React.FC<BackgroundProps> = ({ showGrid }) => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-background transition-colors duration-500">
      
      {/* 1. The Light Source (Spotlight) - Fixes the "empty" feeling */}
      <div 
        className="absolute top-[-20%] left-1/2 transform -translate-x-1/2 w-[120%] h-[80%] opacity-40 dark:opacity-30 pointer-events-none"
        style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.6) 0%, rgba(99, 102, 241, 0.1) 40%, transparent 70%)'
        }}
      ></div>

      {/* 2. Grid Pattern - Subtle */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${showGrid ? 'opacity-[0.04]' : 'opacity-0'}`}
        style={{ 
          backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }}
      ></div>

      {/* 3. Atmospheric Orbs - Deeper and more spread out */}
      <div className="absolute top-[10%] left-[-10%] w-[800px] h-[800px] bg-purple-900/30 rounded-full blur-[120px] animate-pulse-glow"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-blue-950/40 rounded-full blur-[140px] animate-pulse-glow" style={{ animationDelay: '3s' }}></div>
      
      {/* 4. Vignette for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80"></div>
    </div>
  );
};

export default Background;
