import { create } from "zustand";

export interface FoodItem {
  id: string;
  name: string;
  category: string;
}

export interface HistoryItem {
  id: string;
  foodName: string;
  timestamp: string;
}

interface AppState {
  foods: FoodItem[];
  history: HistoryItem[];
  currentResult: FoodItem | null;
  isSpinning: boolean;
  showResult: boolean;
  addFood: (name: string, category?: string) => void;
  removeFood: (id: string) => void;
  setCurrentResult: (food: FoodItem | null) => void;
  setIsSpinning: (spinning: boolean) => void;
  setShowResult: (show: boolean) => void;
  addHistory: (foodName: string) => void;
  clearHistory: () => void;
}

const DEFAULT_FOODS: FoodItem[] = [
  { id: "1", name: "火锅", category: "中餐" },
  { id: "2", name: "烧烤", category: "中餐" },
  { id: "3", name: "麻辣烫", category: "中餐" },
  { id: "4", name: "炒菜", category: "中餐" },
  { id: "5", name: "饺子", category: "中餐" },
  { id: "6", name: "面条", category: "中餐" },
  { id: "7", name: "汉堡", category: "西餐" },
  { id: "8", name: "披萨", category: "西餐" },
  { id: "9", name: "寿司", category: "日料" },
  { id: "10", name: "沙拉", category: "轻食" },
  { id: "11", name: "煲仔饭", category: "中餐" },
  { id: "12", name: "螺蛳粉", category: "中餐" },
  { id: "13", name: "黄焖鸡", category: "中餐" },
  { id: "14", name: "兰州拉面", category: "中餐" },
  { id: "15", name: "麻辣香锅", category: "中餐" },
];

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored) as T;
  } catch {
    // ignore
  }
  return fallback;
}

function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  foods: loadFromStorage<FoodItem[]>("dinner-foods", DEFAULT_FOODS),
  history: loadFromStorage<HistoryItem[]>("dinner-history", []),
  currentResult: null,
  isSpinning: false,
  showResult: false,

  addFood: (name: string, category = "自定义") => {
    const newFood: FoodItem = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
      name,
      category,
    };
    const foods = [...get().foods, newFood];
    saveToStorage("dinner-foods", foods);
    set({ foods });
  },

  removeFood: (id: string) => {
    const foods = get().foods.filter((f) => f.id !== id);
    saveToStorage("dinner-foods", foods);
    set({ foods });
  },

  setCurrentResult: (food) => set({ currentResult: food }),
  setIsSpinning: (spinning) => set({ isSpinning: spinning }),
  setShowResult: (show) => set({ showResult: show }),

  addHistory: (foodName: string) => {
    const item: HistoryItem = {
      id: Date.now().toString(),
      foodName,
      timestamp: new Date().toLocaleString("zh-CN"),
    };
    const history = [item, ...get().history].slice(0, 20);
    saveToStorage("dinner-history", history);
    set({ history });
  },

  clearHistory: () => {
    saveToStorage("dinner-history", []);
    set({ history: [] });
  },
}));
