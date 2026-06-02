import { useRef, useEffect, useState, useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Sparkles, Shuffle } from "lucide-react";

export default function SpinWheel() {
  const { foods, isSpinning, setIsSpinning, setCurrentResult, setShowResult, addHistory } = useAppStore();
  const [displayName, setDisplayName] = useState("");
  const [isPulling, setIsPulling] = useState(false);
  const timerRef = useRef<number | null>(null);
  const animSpeedRef = useRef(50);
  const currentIndexRef = useRef(0);
  const phaseRef = useRef<"spinning" | "slowing" | "stopped">("stopped");

  const spin = useCallback(() => {
    if (isSpinning || foods.length < 2) return;

    setIsSpinning(true);
    setCurrentResult(null);
    setShowResult(false);
    setIsPulling(true);
    phaseRef.current = "spinning";
    animSpeedRef.current = 50;

    const targetIndex = Math.floor(Math.random() * foods.length);
    const totalSpinTime = 2500 + Math.random() * 1000;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / totalSpinTime, 1);

      if (progress < 0.7) {
        phaseRef.current = "spinning";
        animSpeedRef.current = 50 + progress * 40;
      } else if (progress < 0.95) {
        phaseRef.current = "slowing";
        const slowProgress = (progress - 0.7) / 0.25;
        animSpeedRef.current = 90 + slowProgress * 250;
      } else {
        phaseRef.current = "stopped";
        setIsPulling(false);
        setDisplayName(foods[targetIndex].name);

        setTimeout(() => {
          setIsSpinning(false);
          setCurrentResult(foods[targetIndex]);
          setShowResult(true);
          addHistory(foods[targetIndex].name);
          setIsPulling(false);
        }, 400);

        return;
      }

      currentIndexRef.current = (currentIndexRef.current + 1) % foods.length;
      setDisplayName(foods[currentIndexRef.current].name);

      timerRef.current = setTimeout(animate, animSpeedRef.current);
    };

    timerRef.current = setTimeout(animate, 50);
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
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center gap-1 text-brand-orange/60 text-xs font-body tracking-widest">
            <Sparkles className="w-3 h-3" />
            <span>?</span>
            <Sparkles className="w-3 h-3" />
          </div>
        </div>

        <div
          className="relative w-[340px] h-[200px] rounded-2xl overflow-hidden
                     bg-gradient-to-b from-brand-brown/80 to-brand-dark
                     border-2 border-brand-orange/20
                     shadow-[inset_0_0_60px_rgba(0,0,0,0.5),0_0_40px_rgba(255,107,53,0.15)]"
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_4px,rgba(255,255,255,0.02)_4px,rgba(255,255,255,0.02)_8px)]" />

          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-brand-dark/60 to-transparent z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-brand-dark/60 to-transparent z-10" />

          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-brand-dark/40 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-brand-dark/40 to-transparent z-10" />

          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-brand-orange/30 z-10 shadow-[0_0_8px_rgba(255,107,53,0.3)]" />

          <div className="flex items-center justify-center h-full">
            <div
              className={`
                text-center px-6 py-4
                ${isPulling || isSpinning ? "animate-shimmer" : ""}
              `}
            >
              <span
                className={`
                  font-display text-5xl md:text-6xl tracking-wide
                  transition-all duration-100
                  ${isPulling || isSpinning
                    ? "text-brand-orange drop-shadow-[0_0_20px_rgba(255,107,53,0.6)]"
                    : "text-brand-cream"
                  }
                `}
              >
                {displayName || "添加食物"}
              </span>
            </div>
          </div>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {foods.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndexRef.current && (isPulling || isSpinning)
                    ? "bg-brand-orange scale-125"
                    : "bg-brand-cream/15"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-2 px-2">
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex gap-1.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: `rgba(255,${107 + row * 30},${53 + row * 20},${0.15 + i * 0.05})`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-8">
        <button
          onClick={spin}
          disabled={isSpinning || foods.length < 2}
          className={`
            relative px-14 py-4 rounded-full font-display text-xl tracking-wider
            transition-all duration-300 select-none
            ${isSpinning || foods.length < 2
              ? "bg-brand-brown text-brand-cream/40 cursor-not-allowed opacity-60"
              : "bg-gradient-to-r from-brand-orange to-orange-500 text-brand-dark font-bold shadow-lg hover:shadow-[0_0_30px_rgba(255,107,53,0.5)] hover:scale-105 active:scale-95"
            }
          `}
        >
          {isSpinning ? (
            <span className="flex items-center gap-2">
              <Shuffle className="w-5 h-5 animate-spin" />
              抽选中...
            </span>
          ) : foods.length < 2 ? (
            "至少添加2个食物"
          ) : (
            <span className="flex items-center gap-2">
              <Shuffle className="w-5 h-5" />
              开始抽选
            </span>
          )}
        </button>

        {!isSpinning && foods.length >= 2 && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="text-[10px] text-brand-cream/20 font-body tracking-widest">
              PULL
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
