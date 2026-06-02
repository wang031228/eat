import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { PartyPopper, RotateCcw } from "lucide-react";

const CONFETTI_COLORS = [
  "#FF6B35",
  "#FFD700",
  "#FF4081",
  "#00E676",
  "#40C4FF",
  "#FF9100",
  "#E040FB",
  "#FFEB3B",
];

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  size: number;
  shape: "square" | "circle";
}

export default function ResultModal() {
  const { showResult, currentResult, setShowResult, setIsSpinning } = useAppStore();
  const [isVisible, setIsVisible] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (showResult && currentResult) {
      setIsVisible(true);
      const pieces: ConfettiPiece[] = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        delay: Math.random() * 0.8,
        size: 6 + Math.random() * 8,
        shape: Math.random() > 0.5 ? "square" : "circle",
      }));
      setConfetti(pieces);
    } else {
      setIsVisible(false);
      setConfetti([]);
    }
  }, [showResult, currentResult]);

  const handleClose = () => {
    setShowResult(false);
    setIsSpinning(false);
  };

  const handleRespin = () => {
    setShowResult(false);
    setIsSpinning(false);
  };

  if (!isVisible || !currentResult) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-brand-dark/70 backdrop-blur-sm animate-fade-in" />

      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.x}%`,
            top: "-20px",
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: piece.shape === "circle" ? "50%" : "2px",
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}

      <div
        className="relative z-10 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative px-12 py-10 rounded-3xl
                      bg-gradient-to-br from-brand-brown via-brand-warm to-brand-brown
                      border border-brand-orange/20
                      shadow-[0_0_60px_rgba(255,107,53,0.2)]"
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <PartyPopper className="w-12 h-12 text-brand-orange animate-float" />
          </div>

          <p className="text-center text-brand-cream/60 font-body text-sm mb-3 mt-2">
            今晚就吃
          </p>

          <h2 className="text-center font-display text-5xl text-brand-orange mb-2
                         drop-shadow-[0_0_20px_rgba(255,107,53,0.4)]">
            {currentResult.name}
          </h2>

          <p className="text-center text-brand-cream/40 font-body text-xs mb-8">
            {currentResult.category}
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRespin}
              className="flex items-center gap-2 px-5 py-2.5
                         bg-brand-brown/60 border border-brand-warm/30
                         rounded-xl text-brand-cream/70 font-body text-sm
                         hover:bg-brand-brown/80 hover:text-brand-cream
                         transition-all duration-200 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              再转一次
            </button>
            <button
              onClick={handleClose}
              className="px-5 py-2.5 bg-brand-orange rounded-xl
                         text-brand-dark font-body text-sm font-medium
                         hover:bg-brand-orange/90 hover:shadow-[0_0_20px_rgba(255,107,53,0.3)]
                         transition-all duration-200 active:scale-95"
            >
              就它了！
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
