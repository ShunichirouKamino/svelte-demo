// Svelte 5: $effect を使った副作用管理のデモ
// React では useEffect + useState + localStorage を組み合わせる必要がある

let dark = $state(false);

// $effect: dark が変更されるたびに自動実行される
$effect.root(() => {
  $effect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', dark);
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    }
  });
});

export function isDark() {
  return dark;
}

export function toggleTheme() {
  dark = !dark;
}
