import SpinWheel from "@/components/SpinWheel";
import FoodList from "@/components/FoodList";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 md:py-12 relative">
      {/* Top decorative gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-orange/60 to-transparent" />

      {/* Top decorative corners */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-brand-orange/20 rounded-tl-lg hidden md:block" />
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-brand-orange/20 rounded-tr-lg hidden md:block" />

      <header className="text-center mb-8 md:mb-10 animate-fade-in relative">
        {/* Decorative sparkles around header */}
        <div className="absolute -top-4 -left-8 text-brand-orange/30 text-2xl animate-emoji-float hidden md:block">✦</div>
        <div className="absolute -top-2 -right-8 text-brand-orange/20 text-xl animate-emoji-float hidden md:block" style={{ animationDelay: "0.5s" }}>✦</div>

        <h1 className="font-display text-4xl md:text-5xl text-brand-orange
                       drop-shadow-[0_0_30px_rgba(255,107,53,0.3)]
                       relative inline-block">
          今晚吃什么？
          {/* Underline decoration */}
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-transparent via-brand-orange/40 to-transparent rounded-full" />
        </h1>
        <p className="mt-4 text-brand-cream/40 font-body text-sm tracking-widest uppercase">
          交给命运吧
        </p>
      </header>

      <main className="flex flex-col items-center gap-8 md:gap-10 w-full max-w-2xl">
        <section className="w-full max-w-sm animate-slide-up">
          {/* Section label */}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange/60" />
            <span className="text-brand-cream/30 text-xs font-body tracking-widest uppercase">抽选</span>
            <span className="flex-1 h-px bg-gradient-to-r from-brand-warm/30 to-transparent" />
          </div>
          <SpinWheel />
        </section>

        <section className="w-full animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {/* Section label */}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange/60" />
            <span className="text-brand-cream/30 text-xs font-body tracking-widest uppercase">菜单</span>
            <span className="flex-1 h-px bg-gradient-to-r from-brand-warm/30 to-transparent" />
          </div>
          <FoodList />
        </section>
      </main>

      {/* Bottom decorative elements */}
      <footer className="mt-12 text-brand-cream/15 text-xs font-body tracking-wider text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="w-8 h-px bg-brand-warm/20" />
          <span className="text-brand-cream/10">✦</span>
          <span className="w-8 h-px bg-brand-warm/20" />
        </div>
        摇一摇，决定今晚吃什么
      </footer>

      {/* Bottom decorative gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent" />
    </div>
  );
}
