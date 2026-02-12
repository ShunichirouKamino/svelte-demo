<script lang="ts">
  // Svelte 5: $state と $derived のシンプルなデモ
  // React では useState + useMemo が必要
  let count = $state(0);
  let doubled = $derived(count * 2);
  let quadrupled = $derived(doubled * 2);
</script>

<div class="counter">
  <h3>カウンター</h3>
  <p class="count">{count}</p>
  <p class="derived">
    x2 = <strong>{doubled}</strong> / x4 = <strong>{quadrupled}</strong>
  </p>
  <div class="buttons">
    <button onclick={() => count--}>-1</button>
    <button onclick={() => count++}>+1</button>
    <button onclick={() => count = 0}>リセット</button>
  </div>
</div>

<style>
  .counter {
    background: var(--surface);
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    border: 1px solid var(--border);
  }
  h3 { margin: 0 0 0.5rem; color: var(--text); }
  .count {
    font-size: 3rem;
    font-weight: 700;
    color: var(--primary);
    margin: 0.5rem 0;
  }
  .derived {
    color: var(--text-muted);
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
  .buttons {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }
  button {
    padding: 0.5rem 1.2rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--surface);
    color: var(--text);
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.2s;
  }
  button:hover { background: var(--primary); color: white; }
</style>
