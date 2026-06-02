import { useRef, useEffect, useState, useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Shuffle } from "lucide-react";

export default function SpinWheel() {
  const { foods, isSpinning, setIsSpinning, setCurrentResult, setShowResult, addHistory } = useAppStore();
  const [displayName, setDisplayName] = useState("");
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<number | null>(null);
  const currentIndexRef = useRef(0);

  const spin = useCallback(() => {
    if (isSpinning || foods.length < 2) return;

    setIsSpinning(true);
    setCurrentResult(null);
    setShowResult(false);
    setIsActive(true);

    const targetIndex = Math.floor(Math.random() * foods.length);
    const totalTime = 2000 + Math.random() * 800;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / totalTime, 1);

      if (progress < 0.65) {
        currentIndexRef.current = (currentIndexRef.current + 1) % foods.length;
        setDisplayName(foods[currentIndexRef.current].name);
        const speed = 50 + progress * 60;
        timerRef.current = window.setTimeout(() => animate(performance.now()), speed);
      } else if (progress < 0.9) {
        currentIndexRef.current = (currentIndexRef.current + 1) % foods.length;
        setDisplayName(foods[currentIndexRef.current].name);
        const slowProgress = (progress - 0.65) / 0.25;
        const speed = 110 + slowProgress * 300;
        timerRef.current = window.setTimeout(() => animate(performance.now()), speed);
      } else {
        setIsActive(false);
        setDisplayName(foods[targetIndex].name);

        setTimeout(() => {
          setIsSpinning(false);
          setCurrentResult(foods[targetIndex]);
          addHistory(foods[targetIndex].name);
          setShowResult(true);
        }, 300);
      }
    };

    timerRef.current = window.setTimeout(() => animate(performance.now()), 50);
  }, [isSpinning, foods, setIsSpinning, setCurrentResult, setShowResult, addHistory]);

  useEffect(() => {
    if (foods.length > 0 && !isSpinning) {
      setDisplayName(foods[0].name);
    }
  }, [foods, isSpinning]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm mx-auto">
      <div className="w-full">
        <div className="w-full h-40 rounded-2xl bg-brand-dark border-2 border-brand-warm/40 overflow-hidden
                        shadow-[inset_0_0_50px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-center h-full px-6">
            <span
              className={`
                font-display text-5xl md:text-6xl text-center leading-tight
                transition-all duration-100 select-none
                ${isSpinning
                  ? "text-brand-orange drop-shadow-[0_0_15px_rgba(255,107,53,0.5)] animate-shimmer"
                  : isActive && !isSpinning
                    ? "text-brand-orange drop-shadow-[0_0_20px_rgba(255,107,53,0.6)] animate-scale-in"
                    : "text-brand-cream"
                }
              `}
            >
              {displayName || (foods.length === 0 ? "添加些食物吧" : "")}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={spin}
        disabled={isSpinning || foods.length < 2}
        className={`
          w-full max-w-xs py-4 rounded-2xl font-display text-xl tracking-wider
          transition-all duration-300 select-none
          ${isSpinning || foods.length < 2
            ? "bg-brand-brown/40 text-brand-cream/30 cursor-not-allowed border border-brand-warm/10"
            : "bg-brand-orange text-brand-dark font-bold border border-brand-orange/50 shadow-lg hover:shadow-[0_0_25px_rgba(255,107,53,0.4)] hover:scale-[1.02] active:scale-95"
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
            <Shuffle className="w-5 h-5" />
            开始抽选
          </span>
        )}
      </button>
    </div>
  );
}
