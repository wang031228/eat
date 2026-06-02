## 1. 架构设计

```mermaid
graph TB
    subgraph "前端层"
        A["React 单页应用"] --> B["转盘组件"]
        A --> C["食物列表组件"]
        A --> D["结果弹窗组件"]
        A --> E["历史记录组件"]
    end
    subgraph "状态管理层"
        F["Zustand Store"] --> G["食物列表状态"]
        F --> H["抽选结果状态"]
        F --> I["历史记录状态"]
    end
    subgraph "持久化层"
        J["localStorage"]
    end
    A --> F
    F --> J
```

## 2. 技术说明

- 前端：React@18 + TypeScript + Tailwind CSS@3 + Vite
- 初始化工具：vite-init
- 状态管理：Zustand
- 后端：无（纯前端应用）
- 数据持久化：localStorage

## 3. 路由定义

| 路由 | 用途 |
|------|------|
| / | 主页面，包含转盘、食物管理、结果展示 |

## 4. 数据模型

### 4.1 数据模型定义

```mermaid
erDiagram
    FoodItem {
        string id PK
        string name
        string category
    }
    HistoryItem {
        string id PK
        string foodId FK
        string foodName
        string timestamp
    }
    FoodItem ||--o{ HistoryItem : "generates"
```

### 4.2 数据定义

```typescript
interface FoodItem {
  id: string;
  name: string;
  category: string;
}

interface HistoryItem {
  id: string;
  foodName: string;
  timestamp: string;
}

interface AppState {
  foods: FoodItem[];
  history: HistoryItem[];
  currentResult: FoodItem | null;
  isSpinning: boolean;
}
```

### 4.3 初始数据

预设食物列表（中餐为主）：
- 火锅、烧烤、麻辣烫、炒菜、饺子、面条、汉堡、披萨、寿司、沙拉、煲仔饭、螺蛳粉、黄焖鸡、兰州拉面、麻辣香锅
