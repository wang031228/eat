import { useRef, useEffect, useState, useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Shuffle, Sparkles } from "lucide-react";

const CONFETTI_COLORS = ["#FF6B35", "#FFA800", "#FFD700", "#FF4D6D", "#00C9A7", "#7B68EE", "#FF69B8", "#00D4FF", "#FF4444", "#44FF88"];

function ConfettiPiece({ index }: { index: number }) {
  const style = useMemo(() => {
    const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
    const size = 6 + (index * 3) % 10;
    const isCircle = (index % 5) === 0;
    const isRectH = (index % 7) === 0;
    const isRectV = (index % 9) === 0;
    return {
      left: `${((index * 17 + 3) % 100)}%`,
      animationDelay: `${(index % 10) * 0.08}s`,
      animationDuration: `${1.5 + (index % 5) * 0.15}s`,
      width: isRectH ? `${size * 2.5}px` : isRectV ? `${size * 0.5}px` : `${size}px`,
      height: isRectH ? `${size * 0.4}px` : isRectV ? `${size * 2.5}px` : `${size}px`,
      borderRadius: isCircle ? "50%" : "2px",
      backgroundColor: color,
      boxShadow: `0 0 ${4 + (index % 6)}px ${color}`,
      "--sway": `${((index * 13) % 200) - 100}px`,
      "--spin": `${(index * 37) % 1440}deg`,
    } as React.CSSProperties;
  }, [index]);

  return <div className="confetti-piece" style={style} />;
}

function CelebrationOverlay({ name, onClose }: { name: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" style={{ animation: "fade-in 0.3s ease-out" }} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 80 }, (_, i) => (
          <ConfettiPiece key={i} index={i} />
        ))}
      </div>

      <div
        className="relative z-50 cursor-pointer"
        style={{ animation: "result-popup 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}
        onClick={onClose}
      >
        <div className="relative flex flex-col items-center gap-6 px-14 py-12 rounded-3xl
                        bg-gradient-to-br from-[#2D1F15] via-[#3D2818] to-[#2D1F15]
                        border-2 border-[#FFD700]/40
                        shadow-[0_0_60px_rgba(255,215,0,0.2),0_0_120px_rgba(255,107,53,0.15)]">
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-5xl animate-bounce">
            🎉
          </div>

          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-[#FFD700]" style={{ animation: "spin 3s linear infinite" }} />
            <span className="text-[#FFD700]/60 text-xs font-body tracking-widest uppercase">今晚的幸运选择</span>
            <Sparkles className="w-4 h-4 text-[#FFD700]" style={{ animation: "spin 3s linear infinite", animationDelay: "0.5s" }} />
          </div>

          <span
            className="font-display text-6xl md:text-7xl text-center leading-tight select-none"
            style={{
              animation: "result-glow-pulse 2s ease-in-out infinite",
              background: "linear-gradient(135deg, #FFD700, #FFA800, #FF6B35, #FFD700)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 30px rgba(255, 168, 0, 0.4))",
            }}
          >
            {name}
          </span>

          <div className="flex items-center gap-3 mt-1">
            <span className="w-12 h-px bg-[#FFD700]/20" />
            <span className="text-[#FFD700]/30 text-xs font-body tracking-widest">点击关闭</span>
            <span className="w-12 h-px bg-[#FFD700]/20" />
          </div>

          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
            {["🌟", "🎊", "✨"].map((e, i) => (
              <span key={i} className="text-2xl animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}>{e}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SpinWheel() {
  const foods = useAppStore((s) => s.foods);
  const isSpinning = useAppStore((s) => s.isSpinning);
  const setIsSpinning = useAppStore((s) => s.setIsSpinning);
  const [resultName, setResultName] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const timerRef = useRef<number | null>(null);
  const currentIndexRef = useRef(0);
  const foodsRef = useRef(foods);

  useEffect(() => { foodsRef.current = foods; }, [foods]);

  useEffect(() => {
    if (foods.length > 0 && !isSpinning && !resultName && !displayName) {
      setDisplayName(foods[0].name);
    }
  }, [foods, displayName, isSpinning, resultName]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSpin = () => {
    if (isSpinning || foodsRef.current.length < 2) return;

    setResultName(null);
    setIsSpinning(true);

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
          setResultName(result.name);
        }, 300);
      }
    };

    timerRef.current = window.setTimeout(() => animate(performance.now()), 30);
  };

  return (
    <>
      {resultName && (
        <CelebrationOverlay name={resultName} onClose={() => setResultName(null)} />
      )}

      <div className="flex flex-col items-center gap-8 w-full max-w-sm mx-auto">
        <div className="w-full relative">
          <div
            className={`
              relative w-full h-44 rounded-2xl overflow-hidden
              transition-all duration-500
              ${resultName
                ? "border-2 border-[#FFD700]/50 shadow-[0_0_40px_rgba(255,215,0,0.2),inset_0_0_40px_rgba(255,215,0,0.05)]"
                : isSpinning
                  ? "border-2 border-brand-orange/50 shadow-[0_0_30px_rgba(255,107,53,0.2)]"
                  : "border-2 border-brand-warm/40"
              }
              bg-gradient-to-br from-brand-dark via-[#1E1510] to-brand-dark
              shadow-[inset_0_0_50px_rgba(0,0,0,0.6)]
            `}
          >
            <div className="relative flex items-center justify-center h-full px-6">
              <span
                className={`
                  font-display text-center leading-tight select-none
                  transition-all duration-100
                  ${isSpinning
                    ? "text-brand-orange text-5xl md:text-6xl drop-shadow-[0_0_15px_rgba(255,107,53,0.5)] animate-shimmer"
                    : resultName
                      ? "text-5xl md:text-6xl bg-gradient-to-r from-[#FFD700] via-[#FFA800] to-[#FF6B35] bg-clip-text text-transparent"
                      : `text-brand-cream text-5xl md:text-6xl ${foods.length === 0 ? "text-brand-cream/20 text-xl md:text-2xl" : ""}`
                  }
                `}
              >
                {resultName || displayName || (foods.length === 0 ? "添加些食物吧" : "")}
              </span>
            </div>

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
              <Shuffle className="w-5 h-5" />
              开始抽选
            </span>
          )}
        </button>
      </div>
    </>
  );
}
