
import React, { useState, useRef, memo } from 'react';
import { motion, useTransform, MotionValue, useMotionValue, useAnimationFrame } from 'framer-motion';
import { CardData, AppSettings } from '../types';
import { COLOR_MAP } from '../constants';

interface FloatingCardProps {
  card: CardData;
  settings: AppSettings;
  globalRotation: MotionValue<number>;
  collisionX: MotionValue<number>;
  collisionY: MotionValue<number>;
  onContextMenu: (e: React.MouseEvent, id: string) => void;
}

// React.memo is crucial here. It prevents re-rendering all cards 
// when the parent App state changes (like when typing in the sidebar).
const FloatingCard: React.FC<FloatingCardProps> = memo(({ 
  card, 
  settings, 
  globalRotation,
  collisionX,
  collisionY,
  onContextMenu
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const styleClass = COLOR_MAP[card.color] || COLOR_MAP['glass'];

  // --- Local Pause Logic ---
  // We maintain an offset that counteracts the global rotation when hovered
  const pauseOffset = useMotionValue(0);
  const lastGlobalRef = useRef(globalRotation.get());

  useAnimationFrame(() => {
    const currentGlobal = globalRotation.get();
    const delta = currentGlobal - lastGlobalRef.current;
    lastGlobalRef.current = currentGlobal;

    if (isHovered) {
      // Subtract the delta so the net rotation for this card stays constant
      pauseOffset.set(pauseOffset.get() - delta);
    }
  });

  // --- 3D Ring Math ---
  const rotationRad = useTransform([globalRotation, pauseOffset], (values) => {
    const [g, o] = values as [number, number];
    // Add the local pause offset to the calculation
    const degree = (g + card.angle + o) % 360;
    return (degree * Math.PI) / 180;
  });

  const x = useTransform(rotationRad, (rad) => {
    return 50 + Math.sin(rad) * card.radius;
  });

  const z = useTransform(rotationRad, (rad) => Math.cos(rad));

  const scale = useTransform(z, (zVal) => {
    const depthScale = 0.5 + (zVal + 1) * 0.25; 
    return depthScale * settings.scale;
  });

  const opacity = useTransform(z, (zVal) => {
    return 0.3 + (zVal + 1) * 0.35; 
  });

  const zIndex = useTransform(z, (zVal) => Math.round((zVal + 1) * 50));

  const blur = useTransform(z, (zVal) => {
    const blurAmount = (1 - zVal) * 2; 
    return `blur(${blurAmount}px)`;
  });

  // Combine standard centering with collision offsets
  const finalX = useTransform(collisionX, (val) => `calc(-50% + ${val}px)`);
  const finalY = useTransform(collisionY, (val) => `calc(-50% + ${val}px)`);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onContextMenu(e, card.id);
  };

  return (
    <motion.div
      className="absolute top-0 left-0 will-change-transform"
      style={{
        left: useTransform(x, val => `${val}%`),
        top: `${50 + card.height}%`, 
        zIndex,
        scale,
        opacity,
        filter: blur,
        transformPerspective: 1000,
        x: finalX, 
        y: finalY,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        animate={{
          y: [0, -15, 0], 
        }}
        transition={{
          duration: 4 + Math.random() * 2,
          ease: "easeInOut",
          repeat: Infinity,
          delay: card.delay,
        }}
      >
        <motion.div
          className={`
            relative p-8 rounded-3xl 
            backdrop-blur-xl border border-white/10
            shadow-[0_20px_50px_rgba(0,0,0,0.5)]
            group cursor-pointer
            ${styleClass}
          `}
          style={{
            width: '320px',
            // Rotations forced to 0 for horizontal placement
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
          }}
          whileHover={{
            scale: 1.05,
            y: -15, 
            boxShadow: "0 30px 60px -12px rgba(0,0,0,0.6)", // Optimized shadow
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          onContextMenu={handleContextMenu}
        >
           {/* Text Content */}
          <div className="space-y-2">
            <p className="text-lg font-normal leading-relaxed text-left drop-shadow-md select-none">
              {card.text}
            </p>
            {card.text2 && (
              <p className="text-base font-normal leading-relaxed text-left drop-shadow-md select-none opacity-90">
                {card.text2}
              </p>
            )}
          </div>
          
          {/* Shine effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
});

export default FloatingCard;
