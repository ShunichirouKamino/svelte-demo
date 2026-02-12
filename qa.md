# Svelte 5 よくある質問（FAQ）

Svelte を触ったことがない方を対象に、本サンプルアプリのコードを読む上で出てくる疑問をまとめました。React 経験者が感じるギャップにも重点を置いています。

---

## 目次

- [基本概念](#基本概念)
  - [Q1. `.svelte` ファイルの構造がわかりません。`<script>` と HTML と `<style>` が同居しているのはなぜ？](#q1-svelte-ファイルの構造がわかりませんscript-と-html-と-style-が同居しているのはなぜ)
  - [Q2. `$state`、`$derived`、`$effect` って何ですか？ React の Hooks とどう違う？](#q2-statederived-effectって何ですか-react-の-hooks-とどう違う)
  - [Q3. `$` が付いた関数（Runes）は JavaScript の標準構文ですか？](#q3--が付いた関数runesは-javascript-の標準構文ですか)
- [リアクティビティ（状態管理）](#リアクティビティ状態管理)
  - [Q4. `$state` で宣言した変数はなぜ直接代入で更新できる？ React のように setter 関数は不要？](#q4-state-で宣言した変数はなぜ直接代入で更新できる-react-のように-setter-関数は不要)
  - [Q5. `$derived` に依存配列がないのに、どうやって再計算のタイミングを判断している？](#q5-derived-に依存配列がないのにどうやって再計算のタイミングを判断している)
  - [Q6. `$effect` と React の `useEffect` は何が違う？](#q6-effect-と-react-の-useeffect-は何が違う)
  - [Q7. `$effect.root` って何？ なぜ `theme.svelte.ts` にだけ書いてある？](#q7-effectroot-って何-なぜ-themesveltets-にだけ書いてある)
- [コンポーネント設計](#コンポーネント設計)
  - [Q8. `$props()` の使い方がわかりません。React の props とどう違う？](#q8-props-の使い方がわかりませんreact-の-props-とどう違う)
  - [Q9. `bind:value` は React の制御コンポーネントと何が違う？](#q9-bindvalue-は-react-の制御コンポーネントと何が違う)
  - [Q10. `class:done={todo.done}` という書き方は何？](#q10-classdonetododone-という書き方は何)
  - [Q11. `{#each}` ブロックの `(todo.id)` は何の意味？](#q11-each-ブロックの-todoid-は何の意味)
  - [Q12. Snippets (`{#snippet}` / `{@render}`) って何？コンポーネントとの使い分けは？](#q12-snippets-snippet--render-って何コンポーネントとの使い分けは)
- [ファイル構成・SvelteKit](#ファイル構成sveltekit)
  - [Q13. `.svelte.ts` と普通の `.ts` ファイルは何が違う？](#q13-sveltets-と普通の-ts-ファイルは何が違う)
  - [Q14. `$lib` って何？ なぜ `'$lib/stores/todo.svelte'` のようにインポートする？](#q14-lib-って何-なぜ-libstorestodosvelte-のようにインポートする)
  - [Q15. `+page.svelte` や `+layout.svelte` のファイル名の `+` は何？](#q15-pagesvelte-や-layoutsvelte-のファイル名の--は何)
  - [Q16. React のように `index.tsx` をエントリーポイントにしないのはなぜ？](#q16-react-のように-indextsx-をエントリーポイントにしないのはなぜ)
- [スタイリング](#スタイリング)
  - [Q17. `<style>` に書いた CSS が他のコンポーネントに影響しないのはなぜ？](#q17-style-に書いた-css-が他のコンポーネントに影響しないのはなぜ)
  - [Q18. `:global()` って何？ いつ使う？](#q18-global-って何-いつ使う)
  - [Q19. `style="--accent: {color}"` のように CSS 変数を動的に設定しているのは何？](#q19-style--accent-color-のように-css-変数を動的に設定しているのは何)
- [トランジション・アニメーション](#トランジションアニメーション)
  - [Q20. `transition:slide` だけでアニメーションが動くのはなぜ？](#q20-transitionslide-だけでアニメーションが動くのはなぜ)
- [状態管理パターン](#状態管理パターン)
  - [Q21. Redux や Zustand のような状態管理ライブラリは不要？](#q21-redux-や-zustand-のような状態管理ライブラリは不要)
  - [Q22. `getTodos()` のように関数で値を返しているのはなぜ？ 変数を直接 export しないの？](#q22-gettodos-のように関数で値を返しているのはなぜ-変数を直接-export-しないの)
  - [Q23. `todos.push(...)` でミュータブルに変更しているのに、なぜ UI が更新される？](#q23-todospush-でミュータブルに変更しているのになぜ-ui-が更新される)
- [開発体験・ツーリング](#開発体験ツーリング)
  - [Q24. TypeScript は使える？ 設定は必要？](#q24-typescript-は使える-設定は必要)
  - [Q25. React から移行する場合、学習コストはどのくらい？](#q25-react-から移行する場合学習コストはどのくらい)

---

## 基本概念

### Q1. `.svelte` ファイルの構造がわかりません。`<script>` と HTML と `<style>` が同居しているのはなぜ？

Svelte は **Single File Component（SFC）** 方式を採用しており、1つの `.svelte` ファイルにロジック・マークアップ・スタイルの3つをまとめて記述します。

```svelte
<!-- Counter.svelte -->
<script lang="ts">          ← ① ロジック（JavaScript / TypeScript）
  let count = $state(0);
  let doubled = $derived(count * 2);
</script>

<div class="counter">       ← ② マークアップ（HTML テンプレート）
  <p>{count}</p>
  <button onclick={() => count++}>+1</button>
</div>

<style>                      ← ③ スタイル（スコープ付き CSS）
  .counter { padding: 1.5rem; }
</style>
```

Vue の SFC と同じ考え方です。React の JSX + CSS-in-JS がすべて分離しているのとは対照的ですが、「このコンポーネントに関わるすべてが1ファイルに収まる」利点があります。

---

### Q2. `$state`、`$derived`、`$effect` って何ですか？ React の Hooks とどう違う？

Svelte 5 で導入された **Runes（ルーン）** と呼ばれるリアクティビティプリミティブです。React の Hooks に対応する概念がありますが、設計思想が大きく異なります。

| Svelte 5 Rune | React Hook 相当 | 主な違い |
|---|---|---|
| `$state(初期値)` | `useState(初期値)` | setter 関数不要。直接代入で更新可能 |
| `$derived(式)` | `useMemo(() => 式, [依存])` | 依存配列不要。自動追跡 |
| `$effect(() => {...})` | `useEffect(() => {...}, [依存])` | 依存配列不要。自動追跡 |
| `$props()` | 関数コンポーネントの引数 | 分割代入で受け取る |

サンプルアプリの `Counter.svelte` での対比:

```svelte
<!-- Svelte 5 -->
let count = $state(0);
let doubled = $derived(count * 2);      // 依存配列なし
```

```tsx
// React
const [count, setCount] = useState(0);
const doubled = useMemo(() => count * 2, [count]);  // 依存配列が必要
```

---

### Q3. `$` が付いた関数（Runes）は JavaScript の標準構文ですか？

**いいえ。** `$state`、`$derived`、`$effect` などは JavaScript の標準機能ではなく、**Svelte コンパイラが処理するマクロ**（コンパイラ命令）です。

Svelte のビルドプロセス（Vite + Svelte コンパイラ）が、これらの `$` 付き関数を検出し、リアクティブなコードに変換してからブラウザに配信します。そのため `$state` を通常の `.ts` ファイルで使おうとしてもエラーになります（→ [Q13](#q13-sveltets-と普通の-ts-ファイルは何が違う) を参照）。

---

## リアクティビティ（状態管理）

### Q4. `$state` で宣言した変数はなぜ直接代入で更新できる？ React のように setter 関数は不要？

Svelte 5 のコンパイラが `$state` で宣言された変数への代入を検知し、自動的にリアクティブな更新処理に変換するためです。

サンプルアプリの `Counter.svelte` を見てください:

```svelte
let count = $state(0);

<!-- これだけで UI が自動更新される -->
<button onclick={() => count++}>+1</button>
<button onclick={() => count = 0}>リセット</button>
```

React では以下のように書く必要があります:

```tsx
const [count, setCount] = useState(0);

<button onClick={() => setCount(c => c + 1)}>+1</button>
<button onClick={() => setCount(0)}>リセット</button>
```

Svelte では `count++` や `count = 0` という通常の JavaScript の代入が、そのままリアクティブな更新になります。

---

### Q5. `$derived` に依存配列がないのに、どうやって再計算のタイミングを判断している？

Svelte 5 の内部で **シグナル（Signals）** というメカニズムが使われています。`$derived` に渡した式の中で参照している `$state` 変数をコンパイラが静的に解析し、それらの値が変わったときだけ自動的に再計算します。

`todo.svelte.ts` の例:

```ts
let todos = $state<Todo[]>([...]);
let filter = $state<'all' | 'active' | 'done'>('all');

// todos または filter が変わったときだけ再計算される
const filteredTodos = $derived(
  filter === 'all'
    ? todos
    : filter === 'active'
      ? todos.filter((t) => !t.done)
      : todos.filter((t) => t.done)
);
```

React の `useMemo` で起きがちな「依存配列に入れ忘れて古い値が使われる」問題が、原理的に発生しません。

---

### Q6. `$effect` と React の `useEffect` は何が違う？

主な違いは3つあります。

**1. 依存配列が不要**

`+page.svelte` の例:

```svelte
let mounted = $state(false);

// mounted を参照しているが、依存配列の指定は不要
$effect(() => {
  mounted = true;
  console.log('App mounted - タスク管理アプリが起動しました');
});
```

**2. コンポーネント外でも使える（`$effect.root` 経由）**

`theme.svelte.ts` では `.svelte.ts` ファイル（コンポーネント外）で `$effect` を使っています:

```ts
$effect.root(() => {
  $effect(() => {
    document.documentElement.classList.toggle('dark', dark);
  });
});
```

React の `useEffect` はコンポーネント内でしか使えません。

**3. クリーンアップの書き方**

React では `useEffect` の戻り値としてクリーンアップ関数を返しますが、Svelte でも同様に `$effect` 内で `return` するとクリーンアップになります:

```svelte
$effect(() => {
  const timer = setInterval(() => { /* ... */ }, 1000);
  return () => clearInterval(timer);  // クリーンアップ
});
```

---

### Q7. `$effect.root` って何？ なぜ `theme.svelte.ts` にだけ書いてある？

`$effect` は通常、コンポーネントの `<script>` ブロック内でのみ使用できます。コンポーネントのライフサイクルに紐づいており、コンポーネントが破棄されると自動的にクリーンアップされます。

しかし `.svelte.ts` ファイルはコンポーネントではないため、ライフサイクルの概念がありません。そこで `$effect.root` を使うと、**コンポーネント外に独立したエフェクトスコープを作る**ことができます。

```ts
// theme.svelte.ts（コンポーネント外）
$effect.root(() => {       // ← エフェクトのルートスコープを作成
  $effect(() => {          // ← その中で $effect を使う
    document.documentElement.classList.toggle('dark', dark);
  });
});
```

一方、`+page.svelte`（コンポーネント内）では `$effect.root` なしで直接使えます:

```svelte
<!-- +page.svelte（コンポーネント内） -->
<script lang="ts">
  $effect(() => {          // ← コンポーネント内なので $effect.root は不要
    mounted = true;
  });
</script>
```

---

## コンポーネント設計

### Q8. `$props()` の使い方がわかりません。React の props とどう違う？

`$props()` は Svelte 5 で親コンポーネントから渡された props を受け取る Rune です。JavaScript の分割代入で受け取ります。

`TodoItem.svelte` の例:

```svelte
<script lang="ts">
  // 型注釈付きで props を受け取る
  let { todo }: { todo: Todo } = $props();
</script>
```

親コンポーネント（`+page.svelte`）からの渡し方:

```svelte
<!-- 省略記法: {todo} は todo={todo} と同じ -->
<TodoItem {todo} />
```

React との比較:

```tsx
// React: 関数の引数として受け取る
function TodoItem({ todo }: { todo: Todo }) {
  return <li>{todo.text}</li>;
}
```

見た目は似ていますが、Svelte の `$props()` は省略記法 `{todo}` による渡し方や、`$bindable` による双方向バインディング対応など、追加の機能を持っています。

`+layout.svelte` では特殊な props として `children` を受け取っています:

```svelte
let { children } = $props();

{@render children()}
```

これは React の `children` prop に相当し、`{@render}` で描画します。

---

### Q9. `bind:value` は React の制御コンポーネントと何が違う？

React の制御コンポーネント（Controlled Component）は、`value` と `onChange` の2つを必ずセットで書く必要があります。Svelte の `bind:value` は **1つのディレクティブで双方向バインディング**を実現します。

`TodoForm.svelte` の例:

```svelte
let newText = $state('');

<!-- bind:value だけで入力の読み書きが両方できる -->
<input type="text" bind:value={newText} />
```

React での同等コード:

```tsx
const [newText, setNewText] = useState('');

// value と onChange の両方が必要
<input
  type="text"
  value={newText}
  onChange={(e) => setNewText(e.target.value)}
/>
```

`<select>` も同様です:

```svelte
<!-- Svelte: bind:value ひとつで済む -->
<select bind:value={priority}>
  <option value="high">高</option>
  <option value="medium">中</option>
  <option value="low">低</option>
</select>
```

フォームのフィールド数が増えるほど、この差は大きくなります。

---

### Q10. `class:done={todo.done}` という書き方は何？

**`class:` ディレクティブ** です。条件が `true` のときだけ指定したクラスを要素に付与します。

`TodoItem.svelte` の例:

```svelte
<!-- todo.done が true のとき "done" クラスが追加される -->
<li class="todo-item" class:done={todo.done}>
```

生成される HTML:
- `todo.done === true` → `<li class="todo-item done">`
- `todo.done === false` → `<li class="todo-item">`

React では以下のように書く必要があります:

```tsx
<li className={`todo-item ${todo.done ? 'done' : ''}`}>
```

`StatsPanel.svelte` でも使われています:

```svelte
<!-- getFilter() === 'all' のとき "active" クラスが追加される -->
<button class:active={getFilter() === 'all'}>すべて</button>
```

---

### Q11. `{#each}` ブロックの `(todo.id)` は何の意味？

React の `key` プロパティに相当する **キー式（key expression）** です。リストの各要素を一意に識別するために使います。

`+page.svelte` の例:

```svelte
{#each getTodos() as todo (todo.id)}
  <TodoItem {todo} />
{/each}
```

React での同等コード:

```tsx
{getTodos().map(todo => (
  <TodoItem key={todo.id} todo={todo} />
))}
```

`(todo.id)` を省略すると配列のインデックスがキーとして使われます。要素の追加・削除・並べ替えがある場合は、必ずユニークなキーを指定しましょう。

---

### Q12. Snippets (`{#snippet}` / `{@render}`) って何？コンポーネントとの使い分けは？

**Snippets** は Svelte 5 で導入された機能で、コンポーネント内に再利用可能なテンプレートブロックを定義できます。

`StatsPanel.svelte` の例:

```svelte
<!-- Snippet の定義：引数付きのテンプレートブロック -->
{#snippet statCard(label: string, value: number, color: string)}
  <div class="stat-card" style="--accent: {color}">
    <span class="stat-value">{value}</span>
    <span class="stat-label">{label}</span>
  </div>
{/snippet}

<!-- Snippet の呼び出し -->
{@render statCard('全タスク', getStats().total, '#6366f1')}
{@render statCard('完了', getStats().done, '#22c55e')}
{@render statCard('未完了', getStats().active, '#f59e0b')}
{@render statCard('高優先度', getStats().highPriority, '#ef4444')}
```

**コンポーネントとの使い分け:**

| 観点 | Snippets | コンポーネント（`.svelte` ファイル） |
|------|----------|------------------------------|
| 再利用範囲 | 同じコンポーネント内 | プロジェクト全体 |
| ファイル | 追加不要 | 新規ファイルが必要 |
| 状態の保持 | 親のスコープを共有 | 独立したスコープ |
| 適するケース | 繰り返しパターンが1箇所のみ | 複数箇所で使い回す UI |

React では同等の処理をローカル関数やインラインの JSX 変数で表現しますが、Svelte の Snippets は型付き引数を持てるためより安全です。

---

## ファイル構成・SvelteKit

### Q13. `.svelte.ts` と普通の `.ts` ファイルは何が違う？

`.svelte.ts` ファイルは **Svelte コンパイラに処理される TypeScript ファイル**です。通常の `.ts` ファイルとの最大の違いは、**Runes（`$state`、`$derived`、`$effect`）が使える**ことです。

本サンプルアプリでは2つの `.svelte.ts` ファイルがあります:

| ファイル | 役割 |
|---------|------|
| `src/lib/stores/todo.svelte.ts` | タスクの共有ステート。`$state`、`$derived` を使用 |
| `src/lib/stores/theme.svelte.ts` | テーマの共有ステート。`$state`、`$effect` を使用 |

もしこれらを `todo.ts`（`.svelte.ts` ではなく）にリネームすると、`$state is not defined` というエラーになります。

```
todo.svelte.ts → Svelte コンパイラが処理 → $state, $derived が使える
todo.ts        → 通常の TypeScript       → $state, $derived はエラー
```

---

### Q14. `$lib` って何？ なぜ `'$lib/stores/todo.svelte'` のようにインポートする？

`$lib` は SvelteKit が提供する**パスエイリアス**で、`src/lib/` ディレクトリを指します。

```ts
// この2つは同じ意味
import { getTodos } from '$lib/stores/todo.svelte';
import { getTodos } from '../../lib/stores/todo.svelte';  // 相対パス
```

`$lib` を使う利点:
- **相対パスの深さに依存しない**: `../../` のような階層を数える必要がない
- **リファクタリングに強い**: ファイルを移動しても `$lib/` からのパスは変わらない
- **SvelteKit の規約**: `src/lib/` に置いたものは `$lib` でアクセスするのが標準的なパターン

---

### Q15. `+page.svelte` や `+layout.svelte` のファイル名の `+` は何？

SvelteKit の **ファイルベースルーティング** の規約です。`+` プレフィックスは「SvelteKit が特別に扱うファイル」を意味します。

| ファイル名 | 役割 |
|-----------|------|
| `+page.svelte` | そのディレクトリパスに対応するページ |
| `+layout.svelte` | そのディレクトリ以下の全ページに適用される共通レイアウト |
| `+page.server.ts` | サーバーサイドのデータ取得（本サンプルでは未使用） |
| `+error.svelte` | エラーページ（本サンプルでは未使用） |

本サンプルアプリの場合:

```
src/routes/
├── +layout.svelte    ← 全ページ共通（ファビコン設定 + children 描画）
└── +page.svelte      ← URL "/" に対応するページ（アプリ本体）
```

React（Next.js）の `page.tsx` や `layout.tsx` と同じ概念ですが、SvelteKit では `+` プレフィックスで区別します。`+` が付かないファイル（例: `Helper.svelte`）は通常のコンポーネントとして扱われ、ルーティングには影響しません。

---

### Q16. React のように `index.tsx` をエントリーポイントにしないのはなぜ？

SvelteKit はフレームワーク側がエントリーポイントを管理するため、開発者がエントリーファイルを意識する必要がありません。

React（Create React App）:
```
src/index.tsx        ← 自分で書くエントリーポイント
  └─ App.tsx
      └─ 各コンポーネント
```

SvelteKit:
```
src/app.html         ← HTML シェル（SvelteKit が自動注入）
  └─ src/routes/+layout.svelte    ← フレームワークが認識
      └─ src/routes/+page.svelte  ← フレームワークが認識
```

`src/app.html` の `%sveltekit.body%` に SvelteKit がレンダリング結果を注入します:

```html
<body>
  <div style="display: contents">%sveltekit.body%</div>
</body>
```

`ReactDOM.createRoot()` や `React.StrictMode` のようなブートストラップコードは一切不要です。

---

## スタイリング

### Q17. `<style>` に書いた CSS が他のコンポーネントに影響しないのはなぜ？

Svelte はコンパイル時に **CSS セレクタを自動的にスコープ化** します。各コンポーネントの `<style>` 内のセレクタにユニークなハッシュ属性が付加されるため、他のコンポーネントには影響しません。

例えば `Counter.svelte` の:

```css
button { padding: 0.5rem 1.2rem; }
```

は、実際にはコンパイル後に以下のようなスコープ付きセレクタに変換されます:

```css
button.svelte-abc123 { padding: 0.5rem 1.2rem; }
```

そのため、`Counter.svelte` の `button` スタイルが `TodoForm.svelte` の `button` に影響することはありません。React で CSS Modules や styled-components を導入するのと同じ効果が、何も設定せずに得られます。

---

### Q18. `:global()` って何？ いつ使う？

スコープ化を無効にし、**グローバルに CSS を適用する**ための修飾子です。

`+page.svelte` では `:global()` を使ってアプリ全体のテーマ変数やリセットスタイルを定義しています:

```svelte
<style>
  /* :global() でスコープ化を無効にし、全ページに適用 */
  :global(:root) {
    --primary: #6366f1;
    --bg: #f8fafc;
    --surface: #ffffff;
  }
  :global(:root.dark) {
    --bg: #0f172a;
    --surface: #1e293b;
  }
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  /* :global() なし → このコンポーネントだけにスコープされる */
  .app {
    max-width: 640px;
    margin: 0 auto;
  }
</style>
```

使い分け:
- `:global()` **あり**: CSS 変数の定義、body のリセット、サードパーティライブラリのスタイル上書き
- `:global()` **なし（デフォルト）**: コンポーネント固有のスタイル

---

### Q19. `style="--accent: {color}"` のように CSS 変数を動的に設定しているのは何？

Svelte のテンプレート内で **CSS カスタムプロパティを動的にインラインで設定** しています。

`StatsPanel.svelte` の Snippet で使われています:

```svelte
{#snippet statCard(label: string, value: number, color: string)}
  <div class="stat-card" style="--accent: {color}">
    <span class="stat-value">{value}</span>
  </div>
{/snippet}

{@render statCard('全タスク', getStats().total, '#6366f1')}
{@render statCard('完了', getStats().done, '#22c55e')}
```

対応する CSS:

```css
.stat-value {
  color: var(--accent);  /* インラインで設定された値を参照 */
}
.stat-card {
  background: color-mix(in srgb, var(--accent) 10%, transparent);
}
```

これにより、同じ CSS クラスを使いながらカードごとに異なるカラーテーマを適用しています。React でも同じテクニックは使えますが、Svelte のテンプレート構文では `{color}` のように自然に埋め込めます。

---

## トランジション・アニメーション

### Q20. `transition:slide` だけでアニメーションが動くのはなぜ？

Svelte は `svelte/transition` モジュールに**トランジション関数を組み込みで提供**しており、要素の追加・削除時に自動的にアニメーションを適用します。

`TodoItem.svelte` の例:

```svelte
<script lang="ts">
  import { slide } from 'svelte/transition';
</script>

<li transition:slide={{ duration: 200 }}>
  ...
</li>
```

`transition:slide` を付けた要素は:
- **DOM に追加されるとき**: 高さ 0 → 通常の高さにスライドイン
- **DOM から削除されるとき**: 通常の高さ → 高さ 0 にスライドアウト

Svelte が提供する主な組み込みトランジション:

| 関数 | 効果 |
|------|------|
| `fade` | フェードイン / フェードアウト |
| `slide` | スライドイン / スライドアウト（高さ方向） |
| `fly` | 指定方向から飛んでくる / 飛んでいく |
| `scale` | 拡大 / 縮小 |
| `blur` | ぼかしイン / ぼかしアウト |

React ではこれらすべてを Framer Motion や react-transition-group などの外部ライブラリで実装する必要があります。

---

## 状態管理パターン

### Q21. Redux や Zustand のような状態管理ライブラリは不要？

**多くのケースでは不要です。** Svelte 5 では `.svelte.ts` ファイルに `$state` と `$derived` を書くだけで、コンポーネント間で共有できるリアクティブな状態を作れます。

本サンプルアプリの `todo.svelte.ts` がまさにその例です:

```ts
// これだけで「グローバルステート」が完成する
let todos = $state<Todo[]>([...]);
let filter = $state<'all' | 'active' | 'done'>('all');

const filteredTodos = $derived(/* filter に基づいて todos を絞り込み */);

export function addTodo(text: string, priority: Todo['priority'] = 'medium') {
  todos.push({ ... });
}
```

React で同等の仕組みを実現するには:
- **Context API + useReducer**: ボイラープレートが多い
- **Redux**: action / reducer / store の定義が必要
- **Zustand / Jotai**: 外部ライブラリのインストールが必要

ただし、非常に大規模なアプリで複雑な状態管理（undo/redo、状態の永続化、ミドルウェア等）が必要な場合は、外部ライブラリの導入も選択肢になります。

---

### Q22. `getTodos()` のように関数で値を返しているのはなぜ？ 変数を直接 export しないの？

Svelte 5 の Runes で宣言した変数を直接 `export` すると、**リアクティビティが失われる**ケースがあるためです。

```ts
// NG: 直接 export すると、参照がコピーされリアクティビティが切れる場合がある
export const filteredTodos = $derived(...);

// OK: 関数で包むことで、呼び出すたびに最新のリアクティブ値を返す
export function getTodos() {
  return filteredTodos;
}
```

関数として export し、コンポーネント側で `getTodos()` と呼び出すことで、Svelte のリアクティビティシステムが正しく値の変更を追跡できます。

---

### Q23. `todos.push(...)` でミュータブルに変更しているのに、なぜ UI が更新される？

Svelte 5 の `$state` で宣言された配列やオブジェクトは、内部的に **Proxy** でラップされています。そのため `.push()`、`.splice()` などのミュータブルな操作も変更として検知されます。

`todo.svelte.ts` の例:

```ts
let todos = $state<Todo[]>([...]);

export function addTodo(text: string, priority: Todo['priority'] = 'medium') {
  // push で直接変更しても、$derived や UI が正しく更新される
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
  // オブジェクトのプロパティを直接変更してもOK
  if (todo) todo.done = !todo.done;
}
```

React では同じことをするとバグになります:

```tsx
// React NG: ミュータブルな操作は再レンダリングをトリガーしない
todos.push(newTodo);  // UI は更新されない

// React OK: 新しい配列を作る必要がある
setTodos([...todos, newTodo]);
```

Svelte 5 ではミュータブルな操作が自然に書けるため、`...` スプレッド演算子で新しい配列/オブジェクトを作るパターンが不要です。

---

## 開発体験・ツーリング

### Q24. TypeScript は使える？ 設定は必要？

**はい、ネイティブサポートされています。** プロジェクト作成時に `--types ts` を指定するだけで、追加の設定なしに TypeScript が使えます。

`.svelte` ファイルでは `<script lang="ts">` と記述します:

```svelte
<script lang="ts">
  import type { Todo } from '$lib/stores/todo.svelte';
  let { todo }: { todo: Todo } = $props();
</script>
```

`.svelte.ts` ファイルは拡張子自体が TypeScript を示します。

型チェックは以下のコマンドで実行できます:

```bash
npm run check
```

---

### Q25. React から移行する場合、学習コストはどのくらい？

React 経験者が Svelte 5 に移行する際に新しく覚える必要がある概念を整理します。

**すぐ慣れるもの（React の知識がほぼそのまま活きる）:**

| React の知識 | Svelte での対応 | 差分 |
|---|---|---|
| `useState` | `$state` | setter 不要。直接代入 |
| `useMemo` | `$derived` | 依存配列不要 |
| `useEffect` | `$effect` | 依存配列不要 |
| props | `$props()` | 分割代入で受け取る |
| `key` | `(todo.id)` | `{#each}` 内で指定 |
| CSS Modules | `<style>` タグ | 設定不要 |
| Context API | `.svelte.ts` | ライブラリ不要 |

**新しく学ぶ必要があるもの:**

| 概念 | 内容 | 学習コスト |
|------|------|-----------|
| SFC 構造 | `<script>` + HTML + `<style>` の1ファイル構成 | 低（Vue 経験者は即理解） |
| テンプレート構文 | `{#if}`、`{#each}`、`{@render}` など | 低（JSX と異なるが直感的） |
| `bind:` | 双方向バインディング | 低（概念はシンプル） |
| `transition:` | 組み込みトランジション | 低（使うだけなら簡単） |
| Snippets | `{#snippet}` / `{@render}` | 低〜中（Svelte 5 の新機能） |
| SvelteKit のルーティング | `+page.svelte`、`+layout.svelte` | 中（Next.js 経験者は早い） |
| `.svelte.ts` | コンポーネント外リアクティビティ | 中（Svelte 5 固有の概念） |

**総合的な学習コスト**: React 経験者であれば、**1〜2 日でサンプルアプリ程度のコードは書ける**レベルです。SvelteKit のルーティングや SSR まで含めると 1 週間程度を見込むとよいでしょう。最大のハードルは「Hooks のルールや依存配列を考える癖」を捨てることかもしれません。
