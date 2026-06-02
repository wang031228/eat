import SpinWheel from "@/components/SpinWheel";
import FoodList from "@/components/FoodList";
import ResultModal from "@/components/ResultModal";
import HistoryList from "@/components/HistoryList";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 md:py-12">
      <header className="text-center mb-8 md:mb-12 animate-fade-in">
        <h1 className="font-display text-4xl md:text-5xl text-brand-orange
                       drop-shadow-[0_0_30px_rgba(255,107,53,0.3)]">
          今晚吃什么？
        </h1>
        <p className="mt-2 text-brand-cream/40 font-body text-sm">
          选择困难？让命运来决定
        </p>
      </header>

      <main className="flex flex-col items-center gap-8 md:gap-10 w-full max-w-2xl">
        <section className="animate-slide-up">
          <SpinWheel />
        </section>

        <section className="w-full animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <FoodList />
        </section>

        <section className="w-full animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <HistoryList />
        </section>
      </main>

      <footer className="mt-12 text-brand-cream/15 text-xs font-body">
        转一转，晚餐不纠结
      </footer>

      <ResultModal />
    </div>
  );
}
