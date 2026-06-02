import { useRef, useEffect, useCallback, useState } from "react";
import { useAppStore } from "@/store/useAppStore";

const WHEEL_COLORS = [
  "#FF6B35",
  "#E85D26",
  "#C4723A",
  "#D4845A",
  "#FF8C5A",
  "#B5623A",
  "#FF9F6B",
  "#A65B30",
  "#FFB088",
  "#8B4513",
  "#FFC4A8",
  "#6B3410",
  "#FFD5BF",
  "#5A2D0C",
  "#FFE8D6",
];

const POINTER_ANGLE = 270;

export default function SpinWheel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const { foods, isSpinning, setIsSpinning, setCurrentResult, setShowResult, addHistory } = useAppStore();
  const [rotation, setRotation] = useState(0);
  const animationRef = useRef<number>(0);
  const spinStartRef = useRef({ startRotation: 0, targetRotation: 0, startTime: 0, duration: 0 });

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 400;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 8;
    const items = foods;
    const count = items.length;

    if (count === 0) {
      ctx.clearRect(0, 0, size, size);
      ctx.fillStyle = "#2D1F15";
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FFF8F0";
      ctx.font = '20px "ZCOOL KuaiLe", cursive';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("请添加食物", cx, cy);
      return;
    }

    const sliceAngle = (Math.PI * 2) / count;

    ctx.clearRect(0, 0, size, size);

    ctx.save();
    ctx.shadowColor = "rgba(255, 107, 53, 0.3)";
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#1A1210";
    ctx.fill();
    ctx.restore();

    for (let i = 0; i < count; i++) {
      const startAngle = i * sliceAngle - Math.PI / 2;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();

      const colorIndex = i % WHEEL_COLORS.length;
      ctx.fillStyle = WHEEL_COLORS[colorIndex];
      ctx.fill();

      ctx.strokeStyle = "rgba(26, 18, 16, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#FFF8F0";
      ctx.font = `bold ${Math.min(16, 200 / count)}px "ZCOOL KuaiLe", cursive`;

      const textRadius = radius * 0.68;
      const name = items[i].name;
      const maxWidth = radius * 0.5;
      ctx.fillText(name, textRadius, 0, maxWidth);
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    ctx.fillStyle = "#1A1210";
    ctx.fill();
    ctx.strokeStyle = "#FF6B35";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 20, 0, Math.PI * 2);
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 20);
    gradient.addColorStop(0, "#FF8C5A");
    gradient.addColorStop(1, "#FF6B35");
    ctx.fillStyle = gradient;
    ctx.fill();
  }, [foods]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  useEffect(() => {
    const handleResize = () => drawWheel();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawWheel]);

  const spin = useCallback(() => {
    if (isSpinning || foods.length < 2) return;

    setIsSpinning(true);
    setCurrentResult(null);
    setShowResult(false);

    const count = foods.length;
    const targetIndex = Math.floor(Math.random() * count);
    const sliceAngle = 360 / count;
    const targetSliceCenter = targetIndex * sliceAngle + sliceAngle / 2;
    const targetAngleFromPointer = (POINTER_ANGLE - targetSliceCenter + 360) % 360;
    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const totalRotation = extraSpins * 360 + targetAngleFromPointer;

    const startRotation = rotation;
    const targetRotation = startRotation + totalRotation;
    const duration = 4000 + Math.random() * 1500;

    spinStartRef.current = {
      startRotation,
      targetRotation,
      startTime: performance.now(),
      duration,
    };

    const animate = (now: number) => {
      const { startRotation: sR, targetRotation: tR, startTime, duration: dur } = spinStartRef.current;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / dur, 1);

      const eased = 1 - Math.pow(1 - progress, 4);
      const currentRotation = sR + (tR - sR) * eased;

      setRotation(currentRotation);

      if (wheelRef.current) {
        wheelRef.current.style.transform = `rotate(${currentRotation}deg)`;
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setCurrentResult(foods[targetIndex]);
        setShowResult(true);
        addHistory(foods[targetIndex].name);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [isSpinning, foods, rotation, setIsSpinning, setCurrentResult, setShowResult, addHistory]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center">
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
        <div
          className="w-0 h-0"
          style={{
            borderLeft: "14px solid transparent",
            borderRight: "14px solid transparent",
            borderTop: "28px solid #FF6B35",
            filter: "drop-shadow(0 2px 6px rgba(255, 107, 53, 0.6))",
          }}
        />
      </div>

      <div
        ref={wheelRef}
        className="relative rounded-full"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <canvas
          ref={canvasRef}
          className="rounded-full"
          style={{ width: 400, height: 400 }}
        />
      </div>

      <button
        onClick={spin}
        disabled={isSpinning || foods.length < 2}
        className={`
          mt-8 px-10 py-4 rounded-full font-display text-xl tracking-wider
          transition-all duration-300 select-none
          ${
            isSpinning || foods.length < 2
              ? "bg-brand-brown text-brand-cream/40 cursor-not-allowed"
              : "bg-brand-orange text-brand-dark hover:scale-105 hover:shadow-[0_0_30px_rgba(255,107,53,0.5)] active:scale-95 animate-pulse-glow"
          }
        `}
      >
        {isSpinning ? "抽选中..." : foods.length < 2 ? "至少添加2个食物" : "开始抽选"}
      </button>
    </div>
  );
}
