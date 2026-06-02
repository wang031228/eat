import { useAppStore } from "@/store/useAppStore";
import { Clock, Trash2 } from "lucide-react";

export default function HistoryList() {
  const { history, clearHistory } = useAppStore();

  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-caramel" />
          <h3 className="font-display text-sm text-brand-cream/60">
            历史记录
          </h3>
        </div>
        <button
          onClick={clearHistory}
          className="flex items-center gap-1 text-brand-cream/25 hover:text-red-400
                     text-xs font-body transition-colors duration-200"
        >
          <Trash2 className="w-3 h-3" />
          清空
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {history.map((item, index) => (
          <div
            key={item.id}
            className="flex-shrink-0 px-3 py-2 bg-brand-brown/30 border border-brand-warm/10
                       rounded-lg min-w-[100px] animate-slide-in-right"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <p className="font-display text-sm text-brand-cream/80">{item.foodName}</p>
            <p className="text-[10px] text-brand-cream/25 font-body mt-0.5">
              {item.timestamp}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
