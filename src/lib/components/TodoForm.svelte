<script lang="ts">
  import { addTodo } from '$lib/stores/todo.svelte';
  import type { Todo } from '$lib/stores/todo.svelte';

  // Svelte 5: bind: ディレクティブで双方向バインディング
  // React では value + onChange の組み合わせが必須
  let newText = $state('');
  let priority = $state<Todo['priority']>('medium');

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (newText.trim()) {
      addTodo(newText.trim(), priority);
      newText = '';
      priority = 'medium';
    }
  }
</script>

<form class="todo-form" onsubmit={handleSubmit}>
  <!-- bind:value で双方向バインディング（React では onChange が必要） -->
  <input
    type="text"
    bind:value={newText}
    placeholder="新しいタスクを入力..."
    class="text-input"
  />
  <select bind:value={priority} class="priority-select">
    <option value="high">高</option>
    <option value="medium">中</option>
    <option value="low">低</option>
  </select>
  <button type="submit" class="add-btn" disabled={!newText.trim()}>
    追加
  </button>
</form>

<style>
  .todo-form {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  .text-input {
    flex: 1;
    padding: 0.6rem 1rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 1rem;
    background: var(--surface);
    color: var(--text);
  }
  .text-input:focus {
    outline: 2px solid var(--primary);
    outline-offset: -1px;
  }
  .priority-select {
    padding: 0.6rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--surface);
    color: var(--text);
  }
  .add-btn {
    padding: 0.6rem 1.5rem;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
  }
  .add-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .add-btn:not(:disabled):hover { filter: brightness(1.1); }
</style>
