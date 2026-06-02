import { useRef, useEffect, useState, useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Shuffle, PartyPopper } from "lucide-react";

const CONFETTI_COLORS = ["#FF6B35", "#FFA800", "#FFD700", "#FF4D6D", "#00C9A7", "#7B68EE", "#FF69B4", "#00D4FF"];

function ConfettiExplosion() {
  const pieces = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 0.5}s`,
      duration: `${1.2 + Math.random() * 0.8}s`,
      size: `${6 + Math.random() * 8}px`,
      style: {
        "--fall-distance": `${200 + Math.random() * 300}px`,
        "--sway-distance": `${(Math.random() - 0.5) * 200}px`,
        "--spin": `${Math.random() * 1080}deg`,
      } as React.CSSProperties,
    })),
  []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm animate-confetti-piece"
          style={{
            left: p.left,
            top: "-5px",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDelay: p.delay,
            animationDuration: p.duration,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            ...p.style,
          }}
        />
      ))}
    </div>
  );
}

function SparkleDecorations() {
  const sparkles = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      size: `${4 + Math.random() * 6}px`,
    })),
  []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute animate-sparkle"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            backgroundColor: "#FFD700",
            borderRadius: "50%",
            boxShadow: "0 0 6px #FFD700, 0 0 12px #FFA800",
          }}
        />
      ))}
    </div>
  );
}

export default function SpinWheel() {
  const foods = useAppStore((s) => s.foods);
  const isSpinning = useAppStore((s) => s.isSpinning);
  const setIsSpinning = useAppStore((s) => s.setIsSpinning);
  const setCurrentResult = useAppStore((s) => s.setCurrentResult);
  const setShowResult = useAppStore((s) => s.setShowResult);
  const addHistory = useAppStore((s) => s.addHistory);
  const [displayName, setDisplayName] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);
  const timerRef = useRef<number | null>(null);
  const currentIndexRef = useRef(0);
  const foodsRef = useRef(foods);

  useEffect(() => {
    foodsRef.current = foods;
  }, [foods]);

  useEffect(() => {
    if (foods.length > 0 && !isSpinning && !showCelebration && !displayName) {
      setDisplayName(foods[0].name);
    }
  }, [foods, displayName, isSpinning, showCelebration]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSpin = () => {
    if (isSpinning || foodsRef.current.length < 2) return;

    setShowCelebration(false);
    setIsSpinning(true);
    setCurrentResult(null);
    setShowResult(false);

    const currentFoods = foodsRef.current;
    const targetIndex = Math.floor(Math.random() * currentFoods.length);
    const totalTime = 2000 + Math.random() * 800;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / totalTime, 1);
      const f = foodsRef.current;

      if (progress < 0.65) {
        currentIndexRef.current = (currentIndexRef.current + 1) % f.length;
        setDisplayName(f[currentIndexRef.current].name);
        timerRef.current = window.setTimeout(() => animate(performance.now()), 50 + progress * 60);
      } else if (progress < 0.9) {
        currentIndexRef.current = (currentIndexRef.current + 1) % f.length;
        setDisplayName(f[currentIndexRef.current].name);
        const slowProgress = (progress - 0.65) / 0.25;
        timerRef.current = window.setTimeout(() => animate(performance.now()), 110 + slowProgress * 300);
      } else {
        const result = f[targetIndex];
        setDisplayName(result.name);
        setTimeout(() => {
          setIsSpinning(false);
          setCurrentResult(result);
          addHistory(result.name);
          setShowResult(true);
          setShowCelebration(true);
        }, 300);
      }
    };

    timerRef.current = window.setTimeout(() => animate(performance.now()), 30);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm mx-auto">
      <div className="w-full relative">
        {/* Decorative top bar */}
        <div className="flex justify-center gap-3 mb-3">
          {["✨", "🍽️", "✨"].map((emoji, i) => (
            <span
              key={i}
              className="text-lg animate-emoji-float"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              {emoji}
            </span>
          ))}
        </div>

        <div
          className={`
            relative w-full h-44 rounded-2xl overflow-hidden
            transition-all duration-500
            ${showCelebration && !isSpinning
              ? "animate-border-pulse border-2"
              : isSpinning
                ? "border-2 border-brand-orange/50 shadow-[0_0_30px_rgba(255,107,53,0.2)]"
                : "border-2 border-brand-warm/40"
            }
            bg-gradient-to-br from-brand-dark via-[#1E1510] to-brand-dark
            shadow-[inset_0_0_50px_rgba(0,0,0,0.6)]
          `}
        >
          {showCelebration && !isSpinning && <ConfettiExplosion />}
          {showCelebration && !isSpinning && <SparkleDecorations />}

          <div className="relative flex items-center justify-center h-full px-6 z-30">
            <span
              className={`
                font-display text-center leading-tight select-none
                transition-all duration-100
                ${isSpinning
                  ? "text-brand-orange text-5xl md:text-6xl drop-shadow-[0_0_15px_rgba(255,107,53,0.5)] animate-shimmer"
                  : showCelebration
                    ? "text-5xl md:text-6xl animate-result-reveal"
                    : "text-brand-cream text-5xl md:text-6xl"
                }
                ${showCelebration && !isSpinning
                  ? "bg-gradient-to-r from-[#FFD700] via-[#FFA800] to-[#FF6B35] bg-clip-text text-transparent animate-result-glow"
                  : ""
                }
              `}
            >
              {displayName || (foods.length === 0 ? "添加些食物吧" : "")}
            </span>
          </div>

          {/* Decorative corner accents */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-brand-warm/20 rounded-tl" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-brand-warm/20 rounded-tr" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-brand-warm/20 rounded-bl" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-brand-warm/20 rounded-br" />
        </div>
      </div>

      <button
        onClick={handleSpin}
        disabled={isSpinning || foods.length < 2}
        className={`
          w-full max-w-xs py-4 rounded-2xl font-display text-xl tracking-wider
          transition-all duration-300 select-none relative overflow-hidden group
          ${isSpinning || foods.length < 2
            ? "bg-brand-brown/40 text-brand-cream/30 cursor-not-allowed border border-brand-warm/10"
            : "bg-gradient-to-r from-brand-orange to-[#FF8C42] text-brand-dark font-bold border border-brand-orange/50 shadow-lg hover:shadow-[0_0_30px_rgba(255,107,53,0.5)] hover:scale-[1.02] active:scale-95"
          }
        `}
      >
        {isSpinning ? (
          <span className="flex items-center justify-center gap-2">
            <Shuffle className="w-5 h-5 animate-spin" />
            抽选中
          </span>
        ) : foods.length < 2 ? (
          "至少添加2个食物"
        ) : (
          <span className="flex items-center justify-center gap-2">
            {showCelebration ? <PartyPopper className="w-5 h-5" /> : <Shuffle className="w-5 h-5" />}
            {showCelebration ? "再来一次" : "开始抽选"}
          </span>
        )}
      </button>
    </div>
  );
}
