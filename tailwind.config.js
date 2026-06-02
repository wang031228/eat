/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        brand: {
          orange: "#FF6B35",
          caramel: "#C4723A",
          cream: "#FFF8F0",
          dark: "#1A1210",
          brown: "#2D1F15",
          warm: "#3D2B1E",
        },
      },
      fontFamily: {
        display: ['"ZCOOL KuaiLe"', "cursive"],
        body: ['"Noto Sans SC"', "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "scale-in": "scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "slide-out-right": "slideOutRight 0.3s ease-in",
        "float": "float 3s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "confetti-fall": "confettiFall 1.5s ease-in forwards",
        "gradient-flow": "gradientFlow 8s ease infinite",
        "shimmer": "shimmer 0.15s ease-in-out infinite",
        "result-reveal": "resultReveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "result-glow": "resultGlow 2s ease-in-out infinite",
        "confetti-piece": "confettiPiece 2s ease-out forwards",
        "emoji-float": "emojiFloat 3s ease-in-out infinite",
        "sparkle": "sparkle 1.5s linear infinite",
        "border-pulse": "borderPulse 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.5)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideOutRight: {
          "0%": { opacity: "1", transform: "translateX(0)" },
          "100%": { opacity: "0", transform: "translateX(30px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 107, 53, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(255, 107, 53, 0.6)" },
        },
        confettiFall: {
          "0%": { opacity: "1", transform: "translateY(0) rotate(0deg)" },
          "100%": { opacity: "0", transform: "translateY(200px) rotate(720deg)" },
        },
        gradientFlow: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        shimmer: {
          "0%, 100%": { opacity: "1", filter: "blur(0px)" },
          "50%": { opacity: "0.6", filter: "blur(2px)" },
        },
        resultReveal: {
          "0%": { opacity: "0", transform: "scale(0.3) rotateY(90deg)", filter: "blur(10px)" },
          "50%": { opacity: "1", transform: "scale(1.15) rotateY(0deg)", filter: "blur(0px)" },
          "70%": { transform: "scale(0.95) rotateY(0deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotateY(0deg)", filter: "blur(0px)" },
        },
        resultGlow: {
          "0%, 100%": { textShadow: "0 0 20px rgba(255, 168, 0, 0.4), 0 0 60px rgba(255, 107, 53, 0.2)" },
          "50%": { textShadow: "0 0 40px rgba(255, 168, 0, 0.8), 0 0 100px rgba(255, 107, 53, 0.4)" },
        },
        confettiPiece: {
          "0%": { opacity: "1", transform: "translateY(0) translateX(0) rotate(0deg) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(var(--fall-distance)) translateX(var(--sway-distance)) rotate(var(--spin)) scale(0.3)" },
        },
        emojiFloat: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)", opacity: "0.6" },
          "50%": { transform: "translateY(-20px) rotate(10deg)", opacity: "1" },
        },
        sparkle: {
          "0%": { transform: "scale(0) rotate(0deg)", opacity: "0" },
          "50%": { transform: "scale(1) rotate(180deg)", opacity: "1" },
          "100%": { transform: "scale(0) rotate(360deg)", opacity: "0" },
        },
        borderPulse: {
          "0%, 100%": { borderColor: "rgba(255, 168, 0, 0.3)", boxShadow: "0 0 20px rgba(255, 168, 0, 0.1), inset 0 0 20px rgba(255, 168, 0, 0.05)" },
          "50%": { borderColor: "rgba(255, 168, 0, 0.8)", boxShadow: "0 0 40px rgba(255, 168, 0, 0.3), inset 0 0 40px rgba(255, 168, 0, 0.1)" },
        },
      },
    },
  },
  plugins: [],
};
