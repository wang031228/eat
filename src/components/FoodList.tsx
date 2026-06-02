import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Plus, X, UtensilsCrossed } from "lucide-react";

export default function FoodList() {
  const { foods, addFood, removeFood } = useAppStore();
  const [inputValue, setInputValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);

  const handleAdd = () => {
    const name = inputValue.trim();
    if (!name) return;
    if (foods.some((f) => f.name === name)) {
      setInputValue("");
      return;
    }
    addFood(name);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 mb-4 group"
      >
        <UtensilsCrossed className="w-5 h-5 text-brand-orange" />
        <h2 className="font-display text-lg text-brand-cream">
          食物列表
          <span className="ml-2 text-sm font-body text-brand-cream/50">
            ({foods.length}项)
          </span>
        </h2>
        <span
          className={`ml-auto text-brand-cream/40 transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {isExpanded && (
        <div className="animate-slide-up">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入食物名称..."
              className="flex-1 px-4 py-2.5 bg-brand-brown/60 border border-brand-warm/30
                         rounded-xl text-brand-cream font-body text-sm
                         focus:outline-none focus:border-brand-orange/50 focus:ring-1 focus:ring-brand-orange/30
                         transition-all duration-200 placeholder:text-brand-cream/25"
            />
            <button
              onClick={handleAdd}
              disabled={!inputValue.trim()}
              className="px-4 py-2.5 bg-brand-orange/20 border border-brand-orange/30
                         rounded-xl text-brand-orange hover:bg-brand-orange/30
                         disabled:opacity-30 disabled:cursor-not-allowed
                         transition-all duration-200 active:scale-95"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
            {foods.map((food, index) => (
              <div
                key={food.id}
                className="group flex items-center gap-1.5 px-3 py-1.5
                           bg-brand-brown/40 border border-brand-warm/20
                           rounded-lg text-sm font-body text-brand-cream/80
                           hover:border-brand-orange/30 hover:bg-brand-brown/60
                           transition-all duration-200 animate-slide-in-right"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <span>{food.name}</span>
                <button
                  onClick={() => removeFood(food.id)}
                  className="opacity-0 group-hover:opacity-100 ml-0.5
                             text-brand-cream/30 hover:text-red-400
                             transition-all duration-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
