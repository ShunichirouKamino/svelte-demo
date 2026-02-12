<script lang="ts">
  import { isDark, toggleTheme } from '$lib/stores/theme.svelte';
</script>

<button class="theme-toggle" onclick={toggleTheme} aria-label="テーマ切替">
  {isDark() ? '☀️' : '🌙'}
</button>

<style>
  .theme-toggle {
    position: fixed;
    top: 1rem;
    right: 1rem;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    border: 1px solid var(--border);
    background: var(--surface);
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    z-index: 100;
  }
  .theme-toggle:hover { background: var(--primary); }
</style>
