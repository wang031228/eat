import { useRef, useEffect, useState, useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Shuffle, Sparkles } from "lucide-react";

const CONFETTI_COLORS = ["#FF6B35", "#FFA800", "#FFD700", "#FF4D6D", "#00C9A7", "#7B68EE", "#FF69B8", "#00D4FF", "#FF4444", "#44FF88"];
const CONFETTI_SHAPES = ["circle", "square", "rect-h", "rect-v", "star"];

function CelebrationOverlay({ name, onClose }: { name: string; onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const pieces: HTMLDivElement[] = [];
    for (let i = 0; i < 80; i++) {
      const el = document.createElement("div");
      const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      const shape = CONFETTI_SHAPES[Math.floor(Math.random() * CONFETTI_SHAPES.length)];
      const size = 6 + Math.random() * 10;
      const left = Math.random() * 100;
      const delay = Math.random() * 0.8;
      const duration = 1.5 + Math.random() * 2;
      const sway = (Math.random() - 0.5) * 300;
      const spin = Math.random() * 1440;
      const fallDist = 300 + Math.random() * 500;

      el.style.cssText = `
        position: absolute;
        top: -20px;
        left: ${left}%;
        width: ${shape === "rect-h" ? size * 2 : shape === "rect-v" ? size * 0.5 : size}px;
        height: ${shape === "rect-h" ? size * 0.5 : shape === "rect-v" ? size * 2 : size}px;
        border-radius: ${shape === "circle" ? "50%" : shape === "star" ? "50% 50% 0 50%" : "2px"};
        background: ${color};
        box-shadow: 0 0 ${4 + Math.random() * 8}px ${color};
        opacity: 0;
        pointer-events: none;
        z-index: 9999;
        animation: confettiDrop ${duration}s ease-out ${delay}s forwards;
        --sway: ${sway}px;
        --fall: ${fallDist}px;
        --spin: ${spin}deg;
      `;
      container.appendChild(el);
      pieces.push(el);
    }
    return () => pieces.forEach((p) => p.remove());
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto" onClick={onClose}>
      <div
        ref={containerRef}
        className="absolute inset-0 pointer-events-none"
        style={{ position: "fixed", inset: 0, overflow: "hidden" }}
      />
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto"
        style={{ animation: "fadeIn 0.3s ease-out" }}
      />
      <div
        className="relative z-50 pointer-events-auto animate-scale-in cursor-pointer"
        style={{
          animation: "resultPopup 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        }}
        onClick={onClose}
      >
        <div className="relative flex flex-col items-center gap-6 px-12 py-10 rounded-3xl bg-gradient-to-br from-[#2D1F15] via-[#3D2818] to-[#2D1F15] border-2 border-[#FFD700]/40 shadow-[0_0_60px_rgba(255,215,0,0.2),0_0_120px_rgba(255,107,53,0.15)]">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-5xl animate-bounce">
            🎉
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-[#FFD700] animate-spin" style={{ animationDuration: "3s" }} />
            <span className="text-[#FFD700]/60 text-sm font-body tracking-widest uppercase">今晚的幸运选择</span>
            <Sparkles className="w-5 h-5 text-[#FFD700] animate-spin" style={{ animationDuration: "3s", animationDelay: "0.5s" }} />
          </div>
          <span
            className="font-display text-6xl md:text-7xl text-center leading-tight select-none"
            style={{
              animation: "resultGlow 2s ease-in-out infinite",
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
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[#FFD700]/40 text-xs font-body tracking-widest">✦ 点击任意处继续 ✦</span>
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
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

  const handleCloseCelebration = useCallback(() => {
    setResultName(null);
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
        <CelebrationOverlay name={resultName} onClose={handleCloseCelebration} />
      )}

      <style>{`
        @keyframes confettiDrop {
          0% { transform: translateY(0) translateX(0) rotate(0deg) scale(1); opacity: 1; }
          30% { opacity: 1; }
          100% { transform: translateY(var(--fall)) translateX(var(--sway)) rotate(var(--spin)) scale(0.5); opacity: 0; }
        }
        @keyframes resultPopup {
          0% { opacity: 0; transform: scale(0.3) rotateY(90deg); filter: blur(10px); }
          50% { opacity: 1; transform: scale(1.1) rotateY(0deg); filter: blur(0px); }
          70% { transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes resultGlow {
          0%, 100% { text-shadow: 0 0 20px rgba(255, 168, 0, 0.4), 0 0 60px rgba(255, 107, 53, 0.2); }
          50% { text-shadow: 0 0 40px rgba(255, 168, 0, 0.8), 0 0 100px rgba(255, 107, 53, 0.4), 0 0 150px rgba(255, 68, 68, 0.2); }
        }
      `}</style>

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
