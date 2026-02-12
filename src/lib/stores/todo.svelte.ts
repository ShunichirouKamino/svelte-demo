// Svelte 5: .svelte.ts ファイルでリアクティブな共有ステートを定義
// React では Context + useReducer や Zustand/Jotai 等の外部ライブラリが必要

export interface Todo {
  id: number;
  text: string;
  done: boolean;
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
}

// $state でリアクティブな状態を宣言（コンポーネント外でも使える）
let todos = $state<Todo[]>([
  { id: 1, text: 'Svelte 5 の $state を学ぶ', done: true, priority: 'high', createdAt: new Date() },
  { id: 2, text: '$derived で算出値を使う', done: false, priority: 'medium', createdAt: new Date() },
  { id: 3, text: '$effect で副作用を管理する', done: false, priority: 'low', createdAt: new Date() },
]);

let nextId = $state(4);
let filter = $state<'all' | 'active' | 'done'>('all');

// $derived で算出値を自動計算（React の useMemo に相当）
const filteredTodos = $derived(
  filter === 'all'
    ? todos
    : filter === 'active'
      ? todos.filter((t) => !t.done)
      : todos.filter((t) => t.done)
);

const stats = $derived({
  total: todos.length,
  done: todos.filter((t) => t.done).length,
  active: todos.filter((t) => !t.done).length,
  highPriority: todos.filter((t) => t.priority === 'high' && !t.done).length,
});

// 外部から使うためのエクスポート
export function getTodos() {
  return filteredTodos;
}

export function getStats() {
  return stats;
}

export function getFilter() {
  return filter;
}

export function setFilter(f: 'all' | 'active' | 'done') {
  filter = f;
}

export function addTodo(text: string, priority: Todo['priority'] = 'medium') {
  todos.push({
    id: nextId++,
    text,
    done: false,
    priority,
    createdAt: new Date(),
  });
}

export function toggleTodo(id: number) {
  const todo = todos.find((t) => t.id === id);
  if (todo) todo.done = !todo.done;
}

export function removeTodo(id: number) {
  todos = todos.filter((t) => t.id !== id);
}
