<script lang="ts">
  import Counter from '$lib/components/Counter.svelte';
  import TodoForm from '$lib/components/TodoForm.svelte';
  import TodoItem from '$lib/components/TodoItem.svelte';
  import StatsPanel from '$lib/components/StatsPanel.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import { getTodos } from '$lib/stores/todo.svelte';

  // $effect はコンポーネントのマウント後に必ず1回実行される。
  // この $effect 内では $state を「書き込み」しているだけで「読み取り」はしていないため、
  // 追跡する依存はゼロ → 初回マウント時に1回だけ実行され再実行はされない。
  // （マウント検知だけなら onMount でも可。ここでは $effect のデモとして使用）
  let mounted = $state(false);
  $effect(() => {
    mounted = true;
    console.log('App mounted - タスク管理アプリが起動しました');
  });
</script>

<ThemeToggle />

<main class="app" class:mounted>
  <header>
    <h1>Svelte 5 タスク管理</h1>
    <p class="subtitle">Runes / Snippets / Transitions デモ</p>
  </header>

  <section class="section">
    <h2>カウンター ($state / $derived)</h2>
    <Counter />
  </section>

  <section class="section">
    <h2>統計 (Snippets / $derived)</h2>
    <StatsPanel />
  </section>

  <section class="section">
    <h2>タスク追加 (bind: 双方向バインディング)</h2>
    <TodoForm />
  </section>

  <section class="section">
    <h2>タスク一覧 (transition: / $props)</h2>
    <ul class="todo-list">
      {#each getTodos() as todo (todo.id)}
        <TodoItem {todo} />
      {/each}
    </ul>
  </section>
</main>

<style>
  :global(:root) {
    --primary: #6366f1;
    --bg: #f8fafc;
    --surface: #ffffff;
    --text: #1e293b;
    --text-muted: #64748b;
    --border: #e2e8f0;
  }
  :global(:root.dark) {
    --bg: #0f172a;
    --surface: #1e293b;
    --text: #f1f5f9;
    --text-muted: #94a3b8;
    --border: #334155;
  }
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: var(--bg);
    color: var(--text);
    transition: background 0.3s, color 0.3s;
  }
  .app {
    max-width: 640px;
    margin: 0 auto;
    padding: 2rem 1rem;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.4s, transform 0.4s;
  }
  .app.mounted {
    opacity: 1;
    transform: translateY(0);
  }
  header {
    text-align: center;
    margin-bottom: 2rem;
  }
  h1 {
    font-size: 2rem;
    margin: 0;
    background: linear-gradient(135deg, #6366f1, #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .subtitle {
    color: var(--text-muted);
    margin: 0.25rem 0 0;
  }
  .section {
    margin-bottom: 1.5rem;
  }
  .section h2 {
    font-size: 1rem;
    color: var(--text-muted);
    margin: 0 0 0.75rem;
    font-weight: 600;
  }
  .todo-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>
