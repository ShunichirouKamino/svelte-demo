<script lang="ts">
  import { getStats, getFilter, setFilter } from '$lib/stores/todo.svelte';

  // Svelte 5: Snippets（再利用可能なマークアップブロック）
  // React の JSX 変数やレンダー関数に相当するが、より簡潔
</script>

<!-- Svelte 5 Snippets: コンポーネント内で再利用可能なテンプレートを定義 -->
{#snippet statCard(label: string, value: number, color: string)}
  <div class="stat-card" style="--accent: {color}">
    <span class="stat-value">{value}</span>
    <span class="stat-label">{label}</span>
  </div>
{/snippet}

<div class="stats-panel">
  <div class="stats-grid">
    <!-- @render で Snippet を呼び出し -->
    {@render statCard('全タスク', getStats().total, '#6366f1')}
    {@render statCard('完了', getStats().done, '#22c55e')}
    {@render statCard('未完了', getStats().active, '#f59e0b')}
    {@render statCard('高優先度', getStats().highPriority, '#ef4444')}
  </div>

  <div class="filter-buttons">
    <button
      class:active={getFilter() === 'all'}
      onclick={() => setFilter('all')}
    >すべて</button>
    <button
      class:active={getFilter() === 'active'}
      onclick={() => setFilter('active')}
    >未完了</button>
    <button
      class:active={getFilter() === 'done'}
      onclick={() => setFilter('done')}
    >完了</button>
  </div>
</div>

<style>
  .stats-panel {
    background: var(--surface);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid var(--border);
  }
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
  .stat-card {
    text-align: center;
    padding: 0.75rem;
    border-radius: 8px;
    background: color-mix(in srgb, var(--accent) 10%, transparent);
  }
  .stat-value {
    display: block;
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--accent);
  }
  .stat-label {
    font-size: 0.8rem;
    color: var(--text-muted);
  }
  .filter-buttons {
    display: flex;
    gap: 0.5rem;
  }
  .filter-buttons button {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--surface);
    color: var(--text-muted);
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s;
  }
  .filter-buttons button.active {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
  }
</style>
