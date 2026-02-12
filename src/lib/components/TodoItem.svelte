<script lang="ts">
  import { slide } from 'svelte/transition';
  import type { Todo } from '$lib/stores/todo.svelte';
  import { toggleTodo, removeTodo } from '$lib/stores/todo.svelte';

  // Svelte 5: $props() でコンポーネントのプロパティを宣言
  // React の関数コンポーネント引数に相当するが、$bindable でより柔軟
  let { todo }: { todo: Todo } = $props();

  const priorityLabel: Record<string, string> = {
    high: '高',
    medium: '中',
    low: '低',
  };
</script>

<!-- Svelte 組み込みトランジション: transition:slide -->
<!-- React にはトランジションの組み込みサポートがない -->
<li class="todo-item" class:done={todo.done} transition:slide={{ duration: 200 }}>
  <label class="checkbox-label">
    <input
      type="checkbox"
      checked={todo.done}
      onchange={() => toggleTodo(todo.id)}
    />
    <span class="todo-text">{todo.text}</span>
  </label>
  <span class="priority priority-{todo.priority}">
    {priorityLabel[todo.priority]}
  </span>
  <button class="delete-btn" onclick={() => removeTodo(todo.id)}>
    削除
  </button>
</li>

<style>
  .todo-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    background: var(--surface);
    border: 1px solid var(--border);
    transition: opacity 0.2s;
  }
  .todo-item.done { opacity: 0.5; }
  .todo-item.done .todo-text { text-decoration: line-through; }
  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    cursor: pointer;
  }
  .todo-text { color: var(--text); }
  .priority {
    font-size: 0.75rem;
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    font-weight: 600;
  }
  .priority-high { background: #fee2e2; color: #dc2626; }
  .priority-medium { background: #fef3c7; color: #d97706; }
  .priority-low { background: #dbeafe; color: #2563eb; }
  .delete-btn {
    padding: 0.25rem 0.6rem;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 0.8rem;
  }
  .delete-btn:hover { background: #fee2e2; color: #dc2626; border-color: #dc2626; }
</style>
