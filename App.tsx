
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMotionValue, useAnimationFrame, MotionValue } from 'framer-motion';
import Background from './components/Background';
import FloatingCard from './components/FloatingCard';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import ContextMenu from './components/ContextMenu';
import EditModal from './components/EditModal';
import ArticleModal from './components/ArticleModal';
import { getThemeData, ThemeData } from './data-themes';
import { AppSettings, CardData, CardColor, Language } from './types';
import { generateArticle, saveArticleToFile } from './utils/groq';

// Simple UUID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

const DEFAULT_SETTINGS: AppSettings = {
  scale: 1.0,
  quantity: 10,
  speed: 10, 
  showGrid: true,
  isPaused: false,
  maxTextLength: 60, // Default character limit (CN base)
  theme: 'quit-porn', // Default theme
};

const App: React.FC = () => {
  // --- History State for Undo/Redo ---
  const [history, setHistory] = useState<CardData[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Derived current cards
  const cards = history[historyIndex] || [];

  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [language, setLanguage] = useState<Language>('zh'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- Context Menu & Edit State ---
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, cardId: string } | null>(null);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  
  const [articleModal, setArticleModal] = useState<{ isOpen: boolean, cardText: string, cardText2?: string, article: string, isLoading: boolean }>({
    isOpen: false,
    cardText: '',
    cardText2: '',
    article: '',
    isLoading: false,
  });

  // --- Rotation Logic ---
  const rotation = useMotionValue(0);

  // --- Collision / Occlusion Logic ---
  const collisionOffsets = useRef<Map<string, { x: MotionValue<number>, y: MotionValue<number> }>>(new Map());

  // Helper to ensure motion values exist for a card
  const getCollisionValues = (id: string) => {
    if (!collisionOffsets.current.has(id)) {
      collisionOffsets.current.set(id, {
        x: new MotionValue(0),
        y: new MotionValue(0)
      });
    }
    return collisionOffsets.current.get(id)!;
  };

  useAnimationFrame((time, delta) => {
    // 1. Update Global Rotation
    if (!settings.isPaused && !contextMenu && !editingCardId) {
      const moveAmount = (delta / 1000) * (settings.speed * 0.7); 
      rotation.set(rotation.get() + moveAmount);
    }

    // 2. Physics / Collision Simulation
    const currentRot = rotation.get();
    
    const COLLISION_THRESHOLD_X = 18; 
    const COLLISION_THRESHOLD_Y = 22;
    
    const targets = new Map<string, { x: number, y: number }>();
    cards.forEach(c => targets.set(c.id, { x: 0, y: 0 }));

    const cardPositions = cards.map(c => {
      const rad = ((currentRot + c.angle) % 360) * (Math.PI / 180);
      return {
        id: c.id,
        x: Math.sin(rad) * c.radius, 
        y: c.height,
        z: Math.cos(rad) 
      };
    });

    for (let i = 0; i < cardPositions.length; i++) {
      const back = cardPositions[i];
      if (back.z >= 0) continue; 

      for (let j = 0; j < cardPositions.length; j++) {
        const front = cardPositions[j];
        if (front.z <= 0) continue;

        const dx = Math.abs(back.x - front.x);
        const dy = Math.abs(back.y - front.y);

        if (dx < COLLISION_THRESHOLD_X && dy < COLLISION_THRESHOLD_Y) {
          let pushDirX = back.x - front.x;
          let pushDirY = back.y - front.y;

          if (Math.abs(pushDirX) < 0.1) pushDirX = (back.id.charCodeAt(0) % 2 === 0 ? 1 : -1);
          if (Math.abs(pushDirY) < 0.1) pushDirY = (back.id.charCodeAt(back.id.length-1) % 2 === 0 ? 1 : -1);

          const len = Math.sqrt(pushDirX * pushDirX + pushDirY * pushDirY) || 1;
          const proximityFactor = 1 - (Math.max(dx/COLLISION_THRESHOLD_X, dy/COLLISION_THRESHOLD_Y));
          const pushAmount = 100 * proximityFactor; 

          const target = targets.get(back.id)!;
          target.x += (pushDirX / len) * pushAmount;
          target.y += (pushDirY / len) * pushAmount;
        }
      }
    }

    cards.forEach(c => {
      const mv = getCollisionValues(c.id);
      const target = targets.get(c.id)!;
      const currentX = mv.x.get();
      const currentY = mv.y.get();
      const nextX = currentX + (target.x - currentX) * 0.05;
      const nextY = currentY + (target.y - currentY) * 0.05;
      mv.x.set(nextX);
      mv.y.set(nextY);
    });
  });

  // --- Random Data Helpers ---

  // Pick a random quote avoiding duplicates and respecting length
  const getRandomQuote = (excludeIds: Set<string>, maxLength: number, lang: Language, theme: ThemeType): ThemeData => {
    const SOURCE_DATA = getThemeData(theme);
    
    // For two-line cards, check combined length
    const limit = lang === 'en' ? maxLength * 2.5 : maxLength;

    // 1. Try to find unused items that fit length
    let candidates = SOURCE_DATA.filter(item => {
        if (excludeIds.has(String(item.id))) return false;
        const totalLength = item.text.length + (item.text2?.length || 0);
        return totalLength <= limit;
    });

    // 2. If nothing fits/unused, allow reused items that fit length
    if (candidates.length === 0) {
        candidates = SOURCE_DATA.filter(item => {
            const totalLength = item.text.length + (item.text2?.length || 0);
            return totalLength <= limit;
        });
    }

    // 3. If STILL nothing fits (limit too strict), fallback to shortest available items
    if (candidates.length === 0) {
        const sorted = [...SOURCE_DATA].sort((a, b) => {
             const lenA = a.text.length + (a.text2?.length || 0);
             const lenB = b.text.length + (b.text2?.length || 0);
             return lenA - lenB;
        });
        // Return random from the top 5 shortest to add variety even in fail case
        const top5 = sorted.slice(0, Math.min(5, sorted.length));
        return top5[Math.floor(Math.random() * top5.length)];
    }

    return candidates[Math.floor(Math.random() * candidates.length)];
  };

  const generateRandomCard = (existingIds: Set<string>, maxLength: number, lang: Language, theme: ThemeType): CardData => {
    const quote = getRandomQuote(existingIds, maxLength, lang, theme);
    const angle = Math.random() * 360;
    const height = (Math.random() - 0.5) * 60;
    const colors = Object.values(CardColor).filter(c => c !== CardColor.Glass);
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    return {
      id: generateId(),
      sourceId: quote.id,
      text: quote.text,
      text2: quote.text2,
      color: color,
      angle,
      height,
      radius: 35,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      delay: Math.random() * 2,
    };
  };

  const generateInitialSet = (qty: number, maxLength: number, lang: Language, theme: ThemeType): CardData[] => {
    const newCards: CardData[] = [];
    const usedIds = new Set<string>();
    const SOURCE_DATA = getThemeData(theme);
    
    const angleStep = 360 / qty;

    for (let i = 0; i < qty; i++) {
        const quote = getRandomQuote(usedIds, maxLength, lang, theme);
        usedIds.add(String(quote.id));
        
        const colors = Object.values(CardColor).filter(c => c !== CardColor.Glass);
        const color = colors[Math.floor(Math.random() * colors.length)];

        newCards.push({
            id: generateId(), 
            sourceId: quote.id,
            text: quote.text,
            text2: quote.text2,
            color: color,
            angle: i * angleStep,
            height: (Math.random() - 0.5) * 60,
            radius: 35,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            delay: Math.random() * 2,
        });
    }
    return newCards;
  }

  // --- Handlers ---

  const handleUpdateSetting = (key: keyof AppSettings, value: any) => {
    if (key === 'theme') {
      // When theme changes, regenerate all cards with new theme data
      const newTheme = value as ThemeType;
      const newCards = generateInitialSet(settings.quantity, settings.maxTextLength, language, newTheme);
      updateHistory(newCards);
      setSettings(prev => ({ ...prev, theme: newTheme }));
      return;
    }
    
    if (key === 'quantity') {
      const newQuantity = value as number;
      let newCards = [...cards];
      const usedIds = new Set(newCards.map(c => String(c.sourceId || '')));

      if (newQuantity > cards.length) {
        const countToAdd = newQuantity - cards.length;
        for (let i = 0; i < countToAdd; i++) {
            newCards.push(generateRandomCard(usedIds, settings.maxTextLength, language, settings.theme));
        }
      } else if (newQuantity < cards.length) {
        newCards = newCards.slice(0, newQuantity);
      }
      
      updateHistory(newCards);
    }
    else if (key === 'maxTextLength') {
      const newLimit = value as number;
      // Filter pass: Check if currently displayed cards violate the new limit.
      // If so, replace them with new valid cards.
      const updatedCards = cards.map(card => {
        // Only auto-replace data-sourced cards, preserve user custom cards
        if (card.sourceId !== undefined) {
           const currentLen = card.text.length + (card.text2?.length || 0);
           const allowedLen = language === 'en' ? newLimit * 2.5 : newLimit;
           
           if (currentLen > allowedLen) {
              // Generate replacement reusing position properties
              const usedIds = new Set<string>(cards.map(c => String(c.sourceId || '')));
              const quote = getRandomQuote(usedIds, newLimit, language, settings.theme);
              
              // Only replace if the new quote is actually different or at least valid
              return {
                 ...card,
                 sourceId: quote.id,
                 text: quote.text,
                 text2: quote.text2,
                 // Optionally pick new color or keep old one? Let's keep old one for stability
              };
           }
        }
        return card;
      });
      
      updateHistory(updatedCards);
    }

    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateHistory = (newCards: CardData[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newCards);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleToggleLanguage = () => {
    const newLang = language === 'en' ? 'zh' : 'en';
    setLanguage(newLang);
    
    // For quit-porn theme, update text based on language
    // For other themes (quotes, reading), they already have both lines
    if (settings.theme === 'quit-porn') {
      const SOURCE_DATA = getThemeData(settings.theme);
      const updatedCards = cards.map(card => {
          if (card.sourceId) {
              const sourceItem = SOURCE_DATA.find(item => item.id === card.sourceId);
              if (sourceItem) {
                  return {
                      ...card,
                      text: sourceItem.text,
                      text2: sourceItem.text2
                  };
              }
          }
          return card;
      });
      
      updateHistory(updatedCards);
    }
  };

  const handleAddCard = (text: string, color: CardColor) => {
    const angle = Math.random() * 360;
    const height = (Math.random() - 0.5) * 60;
    
    const newCard: CardData = {
      id: generateId(),
      text,
      text2: undefined, // User custom cards don't have second line by default
      color,
      angle,
      height,
      radius: 35,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      delay: Math.random() * 2,
    };

    const newCards = [...cards, newCard];
    updateHistory(newCards);
    setSettings(prev => ({ ...prev, quantity: newCards.length }));
  };

  const handleCardContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); 
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      cardId: id
    });
  };

  const handleDeleteFromMenu = () => {
    if (contextMenu) {
      const newCards = cards.filter(c => c.id !== contextMenu.cardId);
      updateHistory(newCards);
      setSettings(prev => ({ ...prev, quantity: newCards.length }));
      setContextMenu(null);
    }
  };

  const handleEditFromMenu = () => {
    if (contextMenu) {
        setEditingCardId(contextMenu.cardId);
        setContextMenu(null);
    }
  };

  const handleAIAnalyzeFromMenu = async () => {
    if (contextMenu) {
      const card = cards.find(c => c.id === contextMenu.cardId);
      if (card) {
        setArticleModal({
          isOpen: true,
          cardText: card.text,
          cardText2: card.text2,
          article: '',
          isLoading: true,
        });
        setContextMenu(null);

        const article = await generateArticle(card.text, card.text2);
        setArticleModal(prev => ({
          ...prev,
          article,
          isLoading: false,
        }));
      }
    }
  };

  const handleDownloadArticle = () => {
    saveArticleToFile(articleModal.cardText, articleModal.article);
  };

  const handleCloseArticleModal = () => {
    setArticleModal({
      isOpen: false,
      cardText: '',
      cardText2: '',
      article: '',
      isLoading: false,
    });
  };

  const handleSaveEdit = (newText: string) => {
    if (editingCardId) {
        const newCards = cards.map(c => 
            c.id === editingCardId ? { ...c, text: newText } : c
        );
        updateHistory(newCards);
        setEditingCardId(null);
    }
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleSave = () => {
    localStorage.setItem('mindmap-cards', JSON.stringify(cards));
    localStorage.setItem('mindmap-settings', JSON.stringify(settings));
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    const freshSet = generateInitialSet(DEFAULT_SETTINGS.quantity, DEFAULT_SETTINGS.maxTextLength, language, DEFAULT_SETTINGS.theme);
    setHistory([freshSet]);
    setHistoryIndex(0);
    localStorage.removeItem('mindmap-cards');
    localStorage.removeItem('mindmap-settings');
  };

  // --- Infinite Stream Logic ---
  useEffect(() => {
    if (!hasInitialized || settings.isPaused || cards.length === 0) return;
    
    const swapIntervalMs = 4000; 

    const interval = setInterval(() => {
        if (contextMenu || editingCardId) return;

        setHistory(currentHist => {
            const currentCards = currentHist[currentHist.length - 1];
            if (currentCards.length === 0) return currentHist;

            // STRATEGY: Find the card that is visually furthest away (lowest Z value)
            // to replace, so the transition is seamless to the user.
            const currentRot = rotation.get();
            let farthestIndex = -1;
            let minZ = Infinity;

            currentCards.forEach((card, index) => {
                // Calculate projected Z position based on current rotation
                const deg = (currentRot + card.angle) % 360;
                const rad = (deg * Math.PI) / 180;
                // Z = cos(rad), same as FloatingCard logic. 
                // Z=1 is front, Z=-1 is back.
                const z = Math.cos(rad);

                if (z < minZ) {
                    minZ = z;
                    farthestIndex = index;
                }
            });

            // If for some reason we can't find it (empty array logic handled above), fallback to random
            const indexToReplace = farthestIndex !== -1 ? farthestIndex : Math.floor(Math.random() * currentCards.length);
            const oldCard = currentCards[indexToReplace];

            const currentSourceIds = new Set<string>(currentCards.map(c => String(c.sourceId || '')));
            // Use current length setting for new cards
            const newQuote = getRandomQuote(currentSourceIds, settings.maxTextLength, language, settings.theme);

            const colors = Object.values(CardColor).filter(c => c !== CardColor.Glass);
            const newColor = colors[Math.floor(Math.random() * colors.length)];

            const newCard: CardData = {
                ...oldCard,
                id: generateId(), 
                sourceId: newQuote.id,
                text: newQuote.text,
                text2: newQuote.text2,
                color: newColor,
            };

            const newCardSet = [...currentCards];
            newCardSet[indexToReplace] = newCard;

            const newHistory = [...currentHist];
            newHistory[newHistory.length - 1] = newCardSet;
            return newHistory;
        });

    }, swapIntervalMs);

    return () => clearInterval(interval);
  }, [hasInitialized, settings.isPaused, settings.speed, contextMenu, editingCardId, settings.maxTextLength, settings.theme, language]); // NOTE: rotation is not needed in deps as we read .get()


  // --- Initialization Effect ---
  useEffect(() => {
    if (hasInitialized) return;

    const savedCards = localStorage.getItem('mindmap-cards');
    const savedSettings = localStorage.getItem('mindmap-settings');
    
    let initialSet: CardData[] = [];
    let loadedSettings = DEFAULT_SETTINGS;

    if (savedSettings) {
        try {
            loadedSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
            // Ensure quantity matches merged settings
            setSettings(loadedSettings);
        } catch (e) {}
    }

    if (savedCards) {
      try {
        const parsed = JSON.parse(savedCards);
        if (parsed.length > 0) initialSet = parsed;
        else initialSet = generateInitialSet(loadedSettings.quantity, loadedSettings.maxTextLength, language, loadedSettings.theme);
      } catch (e) { 
          initialSet = generateInitialSet(loadedSettings.quantity, loadedSettings.maxTextLength, language, loadedSettings.theme);
      }
    } else {
        initialSet = generateInitialSet(loadedSettings.quantity, loadedSettings.maxTextLength, language, loadedSettings.theme);
    }

    setHistory([initialSet]);
    setHistoryIndex(0);
    // Sync quantity state just in case loaded cards differ from settings
    setSettings(prev => ({ ...loadedSettings, quantity: initialSet.length }));
    setHasInitialized(true);
  }, [hasInitialized]);

  if (!hasInitialized) return null;

  return (
    <div className="relative w-full h-screen flex overflow-hidden bg-white dark:bg-background font-sans text-gray-900 dark:text-white select-none transition-colors duration-500">
      <Background showGrid={settings.showGrid} />

      <main className="flex-1 relative perspective-scene overflow-hidden">
        <div className="absolute inset-0 z-10">
          {cards.map(card => {
             const offset = getCollisionValues(card.id);
             return (
              <FloatingCard 
                key={card.id} 
                card={card} 
                settings={settings}
                globalRotation={rotation}
                collisionX={offset.x}
                collisionY={offset.y}
                onContextMenu={handleCardContextMenu}
              />
            );
          })}
        </div>
        
        <Toolbar 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {contextMenu && (
          <ContextMenu 
            x={contextMenu.x}
            y={contextMenu.y}
            language={language}
            onDelete={handleDeleteFromMenu}
            onEdit={handleEditFromMenu}
            onAIAnalyze={handleAIAnalyzeFromMenu}
            onClose={handleCloseContextMenu}
          />
        )}

        <EditModal 
            isOpen={!!editingCardId}
            language={language}
            initialText={cards.find(c => c.id === editingCardId)?.text || ''}
            onSave={handleSaveEdit}
            onClose={() => setEditingCardId(null)}
        />

        <ArticleModal
          isOpen={articleModal.isOpen}
          language={language}
          cardText={articleModal.cardText}
          article={articleModal.article}
          isLoading={articleModal.isLoading}
          onClose={handleCloseArticleModal}
          onDownload={handleDownloadArticle}
        />
      </main>

      <Sidebar 
        settings={settings} 
        language={language}
        isOpen={isSidebarOpen}
        onUpdateSettings={handleUpdateSetting} 
        onAddCard={handleAddCard}
        onToggleLanguage={handleToggleLanguage}
        onSave={handleSave}
        onReset={handleReset}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  );
};

export default App;
