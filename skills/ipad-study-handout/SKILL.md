---
name: "ipad-study-handout"
description: "把上課教材（PPT、PDF、筆記）重製成 iPad 上好讀、可手寫的深色 PDF 講義：從零講起、圖解、例題、練習與書寫區。使用者丟課程講義並要求做講義、教材、好讀版，或說「幫我整理這章」時使用，適用各種工程學科。"
---

# iPad 深色講義製作 SOP

把老師的上課教材重新教一次，做成一份在 11 吋 iPad 直向閱讀、可以用 Apple Pencil 作答的深色 PDF。
這份文件有兩個部分：前半是規則（怎麼教、怎麼排、怎麼畫），後半是三個要原樣存檔的檔案（`handout.css`、`build.mjs`、`template.html`）。

讀者設定：對這門課幾乎零基礎；用台灣正體中文；最在意資訊排版清楚，討厭花俏和雜亂的層級；喜歡生活例子和動手練習。

## 流程

1. **讀懂來源**。PPT 用 `soffice --headless --convert-to pdf` 轉成 PDF，再用 `pdftotext -layout` 取文字、`pdftoppm -r 40 -png` 轉縮圖並實際看過每一頁（公式和圖常常只存在圖片裡）。來源檔放在獨立資料夾，不要在裡面執行程式。
2. **決定範圍並切段**。一份講義只教一個小節，大約對應 6–12 張投影片、成品 12–18 頁。範圍以投影片為準，但不要逐張翻譯：先自己弄懂，再依「初學者要先知道什麼」重新安排順序。一章太長就拆成多份（例如「上」「下」），並在回覆中說明這份涵蓋到哪一頁。切成 3–6 個段落，每個段落只講一個概念。
3. **寫內容**，遵守〈教學規則〉。
4. **畫圖**，遵守〈圖解規則〉。
5. **排成 HTML**。建立工作資料夾，把本文件最後的三個檔案原樣存入，執行〈環境準備〉的指令，然後複製 `template.html` 改寫內容。一個 `<section class="page">` 就是一頁，手動分頁。
6. **建置與檢查**。`node build.mjs 講義.html 講義.pdf`，有任何「溢出」就調整內容或分頁直到為零。再用 `pdftoppm -r 80 -png` 轉圖，逐頁用 Read 看過，照〈交付前檢查〉走一遍。
7. **驗算與交付**。所有例題、練習、解答的數字用程式重算一次；生活例子裡的事實不確定就查證。存成 `課名_節次_標題.pdf` 交給使用者，回覆只需一兩句說明涵蓋範圍，以及任何你不確定或自行補充的地方。

## 教學規則

**每個段落的順序**：生活情境或動機 → 白話定義（術語中英對照）→ 圖解 → 公式 → 例題。每 2–3 個段落之後放一頁練習，**解答固定放在練習的下一頁**。整份最後依序是：本節重點、公式一覽、自我檢查、術語對照、下一節預告。

- **從零講起**。假設讀者只會國高中數學。每個新名詞出現前先有情境，出現時立刻定義，不要用還沒教的詞解釋新詞。
- **術語中英對照**。第一次出現寫成 `<b>中文</b> <span class="en">english term</span>`，之後用中文。公式卡下方附英文原式，題目中的關鍵量保留英文名，方便對照考卷與課本。
- **生活連結要具體**。說出這個概念用在哪個真實的產品或場景，並帶數字。舉不出好例子就不要硬舉。
- **例題一步一步做**。多步驟的題目先列「已知／要求／想法」，再用編號步驟解；每步有一句小標說明這步在做什麼，最後一步固定是「檢查答案合不合理」。投影片上有的例題優先採用並標明出處頁。
- **練習有層次**。每頁最多 3 題，標上「基本／觀念／變化／綜合」。練習不能只是把例題換數字，至少一題要換問法。每題配書寫區。
- **解答頁**：先給用螢光標出的最終答案，再給完整步驟；頁尾放「寫錯了？回頭看這裡」，指向該複習的頁碼。
- **動手做**（可選）。當概念能在電腦或手邊工具上親眼看到時（終端機指令、幾行 Python、試算表、計算機），用編號步驟帶著做，每步寫出「應該會看到什麼」。沒有實際執行過的輸出要註明是示意。
- **語氣**。白話、短句、直接講結論。不寫客套和過場，不用「不是……而是……」這類繞路的句型。
- **不確定就說**。投影片有錯或語焉不詳時照正確的教，並在回覆中告訴使用者；超出投影片的補充要有必要性。

**中英混排**：漢字與英數之間加半形空格；全形標點旁不加空格；引號用「」和『』；數字與單位之間加空格（`10 秒`、`4 GHz`），百分比和度數不加（`25%`）；專有名詞大小寫正確。

## 視覺規則

頁面是 834 × 1194 pt，等於 11 吋 iPad 直向的螢幕點數，所以 CSS 的 pt 就是螢幕上的 pt，不需要縮放。所有尺寸都寫在 `handout.css` 的變數裡，不要在 HTML 內另外寫死字級、顏色或間距。

- **內文** 18pt、行高 1.8、每行約 37 個漢字。字重只有 400 和 600。
- **深色**：底色 `#1c1c1e`、內文 `#e8e8ed`，不用純黑純白。
- **文字只有三種顏色**：內文色、次要灰、一個藍色強調色。鮮豔色只能出現在圖解、公式色塊和提示框的小標。
- **粗體只給第一次出現的術語**；每頁最多一處 `<mark>` 螢光，留給最關鍵的一句。
- **每頁最多三層**：頁標題 → 區塊（圖、公式、例題、提示框）→ 內文。新的段落一律從新的一頁開始，頁標題上方用 `.eyebrow` 標「段落 N」與投影片頁碼。
- **內容靠上排，下方留白沒關係**，不要為了填滿而加東西；也不要把一頁塞到剩餘空間低於 0。
- **元件只有這些**，不要自創新樣式：術語定義 `.terms`、圖解 `figure > .panel`、公式卡 `.formula`、例題 `.example`、練習 `.practice` 加書寫區 `.write`、提示框 `.note`、表格、程式碼 `pre.code`、解答 `.answer`、重點 `.keypoints`、公式一覽 `.fsheet`、自我檢查 `.check`。
- **提示框只有三種**，一頁最多兩個：`.note.life`（生活中）、`.note.warn`（留意：容易搞錯的地方）、`.note.lab`（動手做的補充）。沒有側邊色條，靠淡色底與彩色小標區分。
- **表格只有橫線**；成對的概念用 `.terms` 並排比較。
- **程式碼**用等寬字型 JetBrains Mono，並關閉連字（`==`、`!=`、`>=`、`<=` 要照原樣顯示，不能被合成 ≠、≥ 這類符號）；程式碼裡的中文註解由字型堆疊中的 Noto Sans TC 顯示。這兩點已寫在 `handout.css`，不要在 HTML 另外處理。
- 標題以「開頭時加 `class="hang"`，讓引號懸掛、文字對齊版心。

**版面預算**（每頁可用高度 1062pt）：內文一行 32pt；頁標題區約 80pt；三行的提示框約 130pt；圖解約為 SVG 高度加 90pt；書寫區高度依題目選 164／200／260pt，一頁三題的書寫區總和不要超過 590pt。

## 圖解規則

適合畫圖的時機：有先後順序、有結構或層次、要比較大小、數量之間有關係、隨時間變化。只是把文字放進框框裡不算圖解，不要畫。

- 用行內 SVG，`viewBox` 寬度固定 626，放在 `.panel` 裡，這樣 SVG 的單位就等於 pt。文字 13–15，標題類用 600。
- **顏色一律用變數**（`fill="var(--blue)"`），不寫色碼。每個色相有三階：`--x` 是圖形本體的鮮色，`--x-tint` 是深色的淡底，`--x-ink` 是放在深底上的亮色文字與線條。可用色相：blue、orange、green、pink、purple、teal、yellow；中性用 `--text`、`--text-2`、`--axis`、`--line-strong`、`--gray-fill`、`--gray-soft`。
- **一個顏色只代表一件事**，同一份講義裡跨圖一致，而且和公式色塊用同一套對應（例如某個物理量在公式裡是藍色，圖裡代表它的圖形也是藍色）。圖說要寫出顏色代表什麼。
- 一張圖最多三個色相加灰色。
- **鮮色圖形裡面不放字**；文字放在圖形的上下或旁邊，用對齊或細線連結。
- 扁平風格：圓角 8–10、線寬 1.5、線端圓頭；不用漸層、陰影、立體效果、表情符號。
- 每張圖編號並附一句圖說；內文提到時用「圖 N」。
- 節首頁右上角放一個 220pt 的小圖徽，用圓、圓角矩形、線條這些基本形狀和色盤組成，代表這一節的主題。
- 函數圖形與座標圖：座標軸用 `--axis` 線寬 1.2，曲線用鮮色線寬 2.5–3。真正的資料圖表另外參考 dataviz 技能。

## 公式

- **文字公式**（用中文量名）寫成 `.eq`，每個量包在 `<span class="v blue">` 這類色塊裡，分數用 `.frac`。
- **符號公式**用 KaTeX：行內 `<span class="tex">…</span>`，獨立一行 `<div class="tex">…</div>`，內容是 LaTeX 原始碼（`<`、`&` 要寫成 HTML 實體）。上色用巨集 `\cB{}`、`\cO{}`、`\cG{}`、`\cP{}`、`\cV{}`、`\cT{}`、`\cY{}`，分別是藍、橘、綠、粉紅、紫、青、黃，和色塊同色。
- 重要公式放進 `.formula` 公式卡：第一行文字公式，第二行同色的符號公式，最下面 `.eq-en` 放英文原式。
- 例題步驟裡的算式放在 `<p class="work">`。

## 環境準備

```bash
mkdir -p handout && cd handout          # 把下面三個檔案存進來
npm init -y >/dev/null
npm i @fontsource/inter @fontsource/noto-sans-tc @fontsource/jetbrains-mono katex
node build.mjs template.html test.pdf   # 先確認環境能跑
```

`build.mjs` 會自動尋找 Playwright（先找本地，再找 `/opt/npm-tools/node_modules`）；都沒有時執行 `npm i playwright`。字型一定要用 `@fontsource` 的靜態字重版本，改用 variable 版本會讓 PDF 內嵌成 Type 3 字型。

## 交付前檢查

- [ ] `build.mjs` 沒有回報任何溢出
- [ ] 每一頁都轉成圖看過：沒有文字重疊、孤字、被截掉的圖
- [ ] 每個段落都從新的一頁開始；解答在練習的下一頁
- [ ] 術語第一次出現都有英文；最後的術語對照表沒有漏
- [ ] 圖的顏色對應和公式色塊一致，圖說有說明
- [ ] 例題、練習、解答的數字都用程式驗算過
- [ ] `pdffonts` 沒有 Type 3；`pdfimages -list` 是空的（全向量）
- [ ] HTML 裡沒有寫死的色碼（`grep -n '#[0-9a-fA-F]\{6\}' 講義.html` 應該沒有結果）

## 檔案一：handout.css

```css
/* FILE: handout.css ｜ iPad 11 吋直向深色講義。單位一律 pt：頁寬 = 螢幕點數。 */
@import url("node_modules/@fontsource/inter/400.css");
@import url("node_modules/@fontsource/inter/600.css");
@import url("node_modules/@fontsource/noto-sans-tc/400.css");
@import url("node_modules/@fontsource/noto-sans-tc/600.css");
@import url("node_modules/@fontsource/jetbrains-mono/400.css");
@import url("node_modules/@fontsource/jetbrains-mono/600.css");

:root {
  color-scheme: dark;
  --sans: "Inter", "Noto Sans TC", "PingFang TC", sans-serif;
  --mono: "JetBrains Mono", "Noto Sans TC", ui-monospace, Menlo, monospace;

  --page-w: 834pt; --page-h: 1194pt;
  --mx: 76pt; --mt: 72pt; --mb: 64pt;       /* 版心 682 × 1058pt */

  --fs: 18pt; --fs-display: 46pt; --fs-h2: 29pt; --fs-h3: 21pt;
  --fs-lead: 21pt; --fs-small: 14pt; --fs-micro: 12.5pt;
  --lh: 1.8; --ls: 0.02em;

  --sp-1: calc(var(--fs) * 0.5); --sp-2: calc(var(--fs) * 1);
  --sp-3: calc(var(--fs) * 1.5); --sp-4: calc(var(--fs) * 2.25);

  /* 文字與介面 */
  --bg: #1c1c1e; --bg-subtle: #29292c;
  --text: #e8e8ed; --text-strong: #f5f5f7; --text-2: #a1a1a6; --text-3: #8e8e93;
  --line: #333336; --line-strong: #48484a;
  --accent: #2997ff; --mark: #4d4200;

  /* 圖解色盤：tint 淡底／本體鮮色／ink 亮色文字與線 */
  --blue-tint: #11305a;   --blue: #0a84ff;   --blue-ink: #6cb6ff;
  --orange-tint: #4a3110; --orange: #ff9f0a; --orange-ink: #ffb84d;
  --green-tint: #133a21;  --green: #30d158;  --green-ink: #5ee08a;
  --pink-tint: #4d1727;   --pink: #ff5c82;   --pink-ink: #ff8fa8;
  --purple-tint: #38214f; --purple: #bf5af2; --purple-ink: #d9a2ff;
  --teal-tint: #0f3b44;   --teal: #40c8e0;   --teal-ink: #70dcef;
  --yellow-tint: #453a00; --yellow: #ffd60a; --yellow-ink: #ffe066;
  --gray-fill: #636366;   --gray-soft: #414144;
  --axis: #8e8e93;

  --warn: #ff9f5a; --write-bg: #222224; --dot: #4c4c50;
  --code-bg: #111113;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: var(--fs); }
body {
  font-family: var(--sans); font-weight: 400; color: var(--text); background: var(--bg);
  line-height: var(--lh); letter-spacing: var(--ls);
  font-synthesis: none; font-kerning: normal; font-variant-numeric: tabular-nums;
  text-autospace: normal; text-spacing-trim: normal; overflow-wrap: break-word;
  -webkit-font-smoothing: antialiased; -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
@page { size: 834pt 1194pt; margin: 0; }

/* ---------- 頁面 ---------- */
.page { width: var(--page-w); height: var(--page-h); padding: var(--mt) var(--mx) var(--mb);
        position: relative; overflow: hidden; break-after: page; background: var(--bg); }
.page > .body { height: 100%; }
.rh { position: absolute; top: 30pt; left: var(--mx); right: var(--mx); display: flex; justify-content: space-between;
      font-size: var(--fs-micro); line-height: 1.4; color: var(--text-3); letter-spacing: 0.04em; }
.pn { position: absolute; bottom: 28pt; right: var(--mx); font-size: var(--fs-micro); line-height: 1.4; color: var(--text-3); }

/* ---------- 文字 ---------- */
p { margin-bottom: var(--sp-2); }
p:last-child { margin-bottom: 0; }
b, strong { font-weight: 600; color: var(--text-strong); }
.en { color: var(--text-2); font-size: 0.92em; letter-spacing: 0; }
.dim { color: var(--text-2); }
mark { background: var(--mark); color: inherit; padding: 0.08em 0.2em; border-radius: 3pt;
       -webkit-box-decoration-break: clone; box-decoration-break: clone; }
code, .mono { font-family: var(--mono); letter-spacing: 0; font-size: 0.88em; font-variant-ligatures: none; }
p code, li code, td code { background: var(--bg-subtle); padding: 0.15em 0.4em; border-radius: 5pt; }
.note code { background: color-mix(in srgb, var(--text) 9%, transparent); }
sup { font-size: 0.66em; line-height: 0; position: relative; top: -0.55em; vertical-align: baseline; letter-spacing: 0; }
sub { font-size: 0.66em; line-height: 0; position: relative; top: 0.3em; vertical-align: baseline; letter-spacing: 0; }

.eyebrow { font-size: var(--fs-micro); font-weight: 600; line-height: 1.4; letter-spacing: 0.08em; color: var(--accent); margin-bottom: 6pt; }
.eyebrow .src { color: var(--text-3); font-weight: 400; }
.eyebrow.quiet { color: var(--text-2); }
.eyebrow.lab { color: var(--purple-ink); }
h1, h2, h3 { font-weight: 600; letter-spacing: 0; text-wrap: balance; color: var(--text-strong); }
h2 { font-size: var(--fs-h2); line-height: 1.3; margin-bottom: var(--sp-3); }
h2.tight { margin-bottom: 6pt; }
h2.hang { text-indent: -0.5em; }
h3 { font-size: var(--fs-h3); line-height: 1.4; margin-top: var(--sp-4); margin-bottom: var(--sp-1); }
h3:first-child { margin-top: 0; }
.lead { font-size: var(--fs-lead); line-height: 1.65; color: var(--text-2); }
ul.plain, ol.plain { margin: 0 0 var(--sp-2) 1.4em; }
ul.plain li, ol.plain li { margin-bottom: 6pt; padding-left: 0.2em; }
ul.plain li::marker { color: var(--text-3); }
ol.plain li::marker { font-weight: 600; }

/* ---------- 術語定義：成對概念並排 ---------- */
.terms { display: grid; grid-template-columns: 1fr 1fr; gap: 0 28pt; margin: var(--sp-3) 0; }
.terms.one { grid-template-columns: 1fr; }
.terms > div { border-top: 1.5pt solid var(--text); padding-top: 11pt; }
.terms dt { font-weight: 600; font-size: 19pt; line-height: 1.4; color: var(--text-strong); }
.terms dt .en { display: block; font-weight: 400; font-size: var(--fs-small); margin-top: 1pt; }
.terms dd { margin-top: 7pt; font-size: 16pt; line-height: 1.7; }
.terms .unit { display: block; margin-top: 6pt; font-size: var(--fs-small); color: var(--text-2); }

/* ---------- 圖解 ---------- */
figure { margin: var(--sp-3) 0; }
figure .panel { background: var(--bg-subtle); border-radius: 18pt; padding: 26pt 28pt; }
figure svg { display: block; width: 100%; height: auto; overflow: visible; }
figcaption { margin-top: 9pt; font-size: var(--fs-small); line-height: 1.6; color: var(--text-2); }
figcaption b { color: var(--text); margin-right: 0.5em; }
svg text { font-family: var(--sans); letter-spacing: 0.01em; }

/* ---------- 公式 ---------- */
.formula { margin: var(--sp-3) 0; padding: 20pt 24pt 18pt; border: 1pt solid var(--line-strong); border-radius: 16pt; text-align: center; }
.formula .eq, .fsheet .eq { font-weight: 600; letter-spacing: 0; line-height: 1.5; display: flex; align-items: center; gap: 0.45em; flex-wrap: wrap; }
.formula .eq { font-size: 21pt; justify-content: center; }
.formula .eq + .eq, .formula .eq + .tex, .formula .tex + .eq { margin-top: 14pt; }
.formula .tex { font-size: 20pt; }
.formula .eq-en { margin-top: 10pt; font-size: var(--fs-small); line-height: 1.5; color: var(--text-2); letter-spacing: 0; }
.formula .why { font-size: var(--fs-small); color: var(--text-2); font-weight: 400; margin: 14pt 0; }
.op { font-weight: 400; color: var(--text-2); }
.v { display: inline-block; padding: 0.12em 0.5em; border-radius: 7pt; font-weight: 600; white-space: nowrap; }
.v sub { font-weight: 600; }
.v.blue   { background: var(--blue-tint);   color: var(--blue-ink); }
.v.orange { background: var(--orange-tint); color: var(--orange-ink); }
.v.green  { background: var(--green-tint);  color: var(--green-ink); }
.v.pink   { background: var(--pink-tint);   color: var(--pink-ink); }
.v.purple { background: var(--purple-tint); color: var(--purple-ink); }
.v.teal   { background: var(--teal-tint);   color: var(--teal-ink); }
.v.yellow { background: var(--yellow-tint); color: var(--yellow-ink); }
.v.plain  { background: var(--bg-subtle);   color: var(--text); }
.var { font-weight: 600; padding: 0 0.1em; }
.frac { display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; }
.frac > span { padding: 0 0.2em; line-height: 1.5; }
.frac > span:first-child { padding-bottom: 5pt; }
.frac > span:last-child { border-top: 1.5pt solid var(--text); padding-top: 5pt; }
.calc { letter-spacing: 0; white-space: nowrap; }
.calc .frac { font-size: 0.9em; margin: 0 0.15em; }
.calc .frac > span { line-height: 1.35; padding: 0 0.3em; }
.calc .frac > span:first-child { padding-bottom: 2pt; }
.calc .frac > span:last-child { padding-top: 2pt; border-top-width: 1.2pt; }
/* KaTeX */
.tex { letter-spacing: 0; }
.katex { font-size: 1.1em; }
.katex .cjk_fallback { font-family: var(--sans); font-size: 0.9em; }
.katex-display { margin: 0; }
div.tex { margin: var(--sp-2) 0; }
.formula div.tex, .fsheet div.tex { margin: 0; }
.steps div.tex, .answer div.tex { text-align: left; margin: 6pt 0; }
.steps .katex-display, .answer .katex-display, .fsheet .katex-display { text-align: left; }
.steps .katex-display > .katex, .answer .katex-display > .katex, .fsheet .katex-display > .katex { text-align: left; }

/* ---------- 區塊標籤 ---------- */
.tag { font-size: var(--fs-small); font-weight: 600; line-height: 1.4; letter-spacing: 0.06em; margin-bottom: 4pt; }
.tag .lv { font-weight: 400; color: var(--text-3); margin-left: 0.6em; letter-spacing: 0.02em; }

/* ---------- 例題 ---------- */
.example { margin: var(--sp-3) 0; border-left: 2pt solid var(--accent); padding-left: 20pt; }
.example:first-child { margin-top: 0; }
.example .tag { color: var(--accent); }
.example .q { font-weight: 600; line-height: 1.7; margin-bottom: var(--sp-2); color: var(--text-strong); }
.given { display: grid; grid-template-columns: auto 1fr; gap: 6pt 16pt; margin-bottom: var(--sp-2); font-size: 16pt; line-height: 1.7; }
.given dt { color: var(--text-2); font-size: var(--fs-small); font-weight: 600; letter-spacing: 0.06em; padding-top: 2.5pt; }
.steps { list-style: none; counter-reset: s; }
.steps > li { counter-increment: s; position: relative; padding-left: 34pt; padding-bottom: 13pt; }
.steps > li:last-child { padding-bottom: 0; }
.steps > li::before { content: counter(s); position: absolute; left: 0; top: 4pt; width: 22pt; height: 22pt; border-radius: 50%;
  background: var(--text); color: var(--bg); font-size: 12.5pt; font-weight: 600; line-height: 22pt; text-align: center; letter-spacing: 0; }
.steps > li::after { content: ""; position: absolute; left: 10.5pt; top: 30pt; bottom: 0; width: 1pt; background: var(--line-strong); }
.steps > li:last-child::after { display: none; }
.steps .st { font-weight: 600; margin-bottom: 1pt; color: var(--text-strong); }
.steps p { margin-bottom: 2pt; }
.steps .work { font-size: 17pt; letter-spacing: 0; }
.result { font-weight: 600; color: var(--text-strong); }

/* ---------- 練習＋書寫區 ---------- */
.practice { margin-top: var(--sp-3); }
.practice .q { line-height: 1.7; margin-bottom: 10pt; }
.practice .q ol { margin: 4pt 0 0 1.4em; }
.write { position: relative; border: 1pt solid var(--line-strong); border-radius: 14pt; background: var(--write-bg); overflow: hidden; }
.write.s { height: 164pt; } .write.m { height: 200pt; } .write.l { height: 260pt; }
.write svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.write .ans { position: absolute; right: 18pt; bottom: 13pt; display: flex; align-items: flex-end; gap: 8pt;
  font-size: var(--fs-small); color: var(--text-3); line-height: 1; background: var(--write-bg); padding: 6pt 6pt 4pt 10pt; border-radius: 6pt; }
.write .ans i { display: block; width: 150pt; border-bottom: 1pt solid var(--line-strong); }

/* ---------- 提示框：只有三種，沒有側邊色條 ---------- */
.note { --c: var(--green-ink); margin: var(--sp-3) 0; padding: 15pt 20pt 16pt; border-radius: 14pt;
        background: color-mix(in srgb, var(--c) 13%, var(--bg)); font-size: 16pt; line-height: 1.75; }
.note .label { font-size: var(--fs-small); font-weight: 600; letter-spacing: 0.06em; color: var(--c); margin-bottom: 3pt; line-height: 1.5; }
.note.life { --c: var(--green-ink); }
.note.warn { --c: var(--warn); }
.note.lab  { --c: var(--purple-ink); }
.note.next { --c: var(--accent); }

/* ---------- 表格 ---------- */
table { border-collapse: collapse; width: 100%; font-size: 16pt; line-height: 1.6; margin: var(--sp-3) 0; }
th { text-align: left; font-weight: 600; font-size: var(--fs-small); color: var(--text-2); letter-spacing: 0.04em;
     padding: 0 14pt 8pt 0; border-bottom: 1.5pt solid var(--text); white-space: nowrap; }
td { padding: 10pt 14pt 10pt 0; border-bottom: 1pt solid var(--line); vertical-align: top; }
td:last-child, th:last-child { padding-right: 0; }
td .en { display: block; font-size: 13pt; }

/* ---------- 程式碼與終端機 ---------- */
pre.code { background: var(--code-bg); color: var(--text); border: 1pt solid var(--line); border-radius: 14pt; padding: 16pt 20pt;
           font-family: var(--mono); font-size: 13pt; line-height: 1.8; letter-spacing: 0; margin: 10pt 0 12pt; white-space: pre-wrap;
           font-variant-ligatures: none; }
pre.code .p, pre.code .c { color: var(--text-3); }          /* 提示字元、註解 */
pre.code .o { color: var(--text-2); }                         /* 輸出 */
pre.code .k { color: var(--pink-ink); }                       /* 關鍵字 */
pre.code .s { color: var(--orange-ink); }                     /* 字串 */
pre.code .n { color: var(--teal-ink); }                       /* 數字 */
pre.code .hl { color: var(--blue-ink); font-weight: 600; }    /* 要讀者注意的地方 */
pre.code .hw { color: var(--text-strong); font-weight: 600; }

/* ---------- 節首頁 ---------- */
.opener { padding-top: 96pt; }
.opener .course { font-size: var(--fs-small); color: var(--text-2); letter-spacing: 0.06em; line-height: 1.5; }
.opener .secno { font-size: 21pt; font-weight: 600; color: var(--accent); letter-spacing: 0; margin-top: 150pt; line-height: 1.3; }
.opener h1 { font-size: var(--fs-display); line-height: 1.22; margin-top: 4pt; }
.opener .lead { margin-top: 18pt; max-width: 30em; }
.opener .glyph { position: absolute; right: 60pt; top: 78pt; width: 220pt; height: 220pt; }
.goals { margin-top: 44pt; border-top: 1pt solid var(--line-strong); padding-top: 22pt; }
.goals h3 { margin: 0 0 12pt; font-size: var(--fs-small); color: var(--text-2); letter-spacing: 0.06em; }
.goals ol { list-style: none; counter-reset: g; }
.goals li { counter-increment: g; position: relative; padding-left: 36pt; margin-bottom: 9pt; line-height: 1.65; }
.goals li::before { content: counter(g); position: absolute; left: 0; top: 3pt; width: 23pt; height: 23pt; border-radius: 50%;
  border: 1.5pt solid var(--text); font-size: 12.5pt; font-weight: 600; line-height: 20pt; text-align: center; letter-spacing: 0; }
.meta { position: absolute; left: var(--mx); right: var(--mx); bottom: 64pt; display: grid; grid-template-columns: repeat(4, 1fr); gap: 20pt;
        border-top: 1pt solid var(--line-strong); padding-top: 14pt; }
.meta div { font-size: 15pt; line-height: 1.5; }
.meta span { display: block; font-size: var(--fs-micro); color: var(--text-3); letter-spacing: 0.06em; margin-bottom: 2pt; }

/* ---------- 解答頁 ---------- */
.answer { margin-top: var(--sp-3); padding-top: var(--sp-2); border-top: 1pt solid var(--line-strong); }
.answer:first-of-type { border-top: 0; padding-top: 0; }
.answer .tag { color: var(--text-2); }
.answer .final { display: inline-block; background: var(--mark); padding: 0.1em 0.5em; border-radius: 6pt; font-weight: 600; margin-bottom: 8pt; color: var(--text-strong); }
.answer p { margin-bottom: 6pt; }
.back { margin-top: var(--sp-4); font-size: 16pt; }
.back h3 { margin-top: 0; font-size: var(--fs-small); color: var(--text-2); letter-spacing: 0.06em; }
.back table { margin: 8pt 0 0; }

/* ---------- 複習頁 ---------- */
.keypoints { list-style: none; counter-reset: k; margin-bottom: var(--sp-3); }
.keypoints li { counter-increment: k; position: relative; padding: 11pt 0 11pt 40pt; border-bottom: 1pt solid var(--line); line-height: 1.65; }
.keypoints li:first-child { border-top: 1.5pt solid var(--text); }
.keypoints li::before { content: counter(k); position: absolute; left: 2pt; top: 11pt; font-weight: 600; color: var(--accent); }
.fsheet { border: 1pt solid var(--line-strong); border-radius: 16pt; padding: 4pt 24pt; margin-top: 10pt; }
.fsheet .row { display: grid; grid-template-columns: 6.6em 1fr; align-items: center; padding: 13pt 0; border-bottom: 1pt solid var(--line); }
.fsheet .row:last-child { border-bottom: 0; }
.fsheet .lbl { font-size: var(--fs-small); line-height: 1.5; color: var(--text-2); font-weight: 600; letter-spacing: 0.04em; }
.fsheet .eq, .fsheet .tex { font-size: 18pt; }
.check { list-style: none; }
.check li { position: relative; padding-left: 34pt; margin-bottom: 8pt; line-height: 1.65; font-size: 16pt; }
.check li::before { content: ""; position: absolute; left: 0; top: 4pt; width: 20pt; height: 20pt; border: 1.5pt solid var(--text-3); border-radius: 6pt; }
```

## 檔案二：build.mjs

```js
// FILE: build.mjs ｜ 用法：node build.mjs <input.html> <output.pdf>
// 1) 渲染 KaTeX  2) 鋪書寫區點陣  3) 檢查每頁溢出  4) 輸出向量 PDF
import { createRequire } from "module";
import { existsSync } from "fs";
import path from "path";
import { pathToFileURL } from "url";

function loadPlaywright() {
  for (const base of [process.cwd() + "/", "/opt/npm-tools/node_modules/"]) {
    try { return createRequire(base)("playwright"); } catch {}
  }
  throw new Error("找不到 playwright，請先執行 npm i playwright");
}
const { chromium } = loadPlaywright();
const [,, input, output] = process.argv;
if (!input || !output) { console.error("用法：node build.mjs <input.html> <output.pdf>"); process.exit(1); }

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1112, height: 1592 } });
await page.goto(pathToFileURL(path.resolve(input)).href);

// ---- KaTeX：.tex 元素的文字內容就是 LaTeX；顏色巨集取自 CSS 變數 ----
const katexDir = path.resolve("node_modules/katex/dist");
if (await page.locator(".tex").count()) {
  if (!existsSync(katexDir)) throw new Error("文件用了 .tex 但沒有安裝 katex（npm i katex）");
  await page.addStyleTag({ url: pathToFileURL(path.join(katexDir, "katex.min.css")).href });
  await page.addScriptTag({ path: path.join(katexDir, "katex.min.js") });
  const errors = await page.evaluate(() => {
    const css = getComputedStyle(document.documentElement);
    // 巨集字串裡的 # 會被當成參數，所以色碼去掉 #（KaTeX 接受不帶 # 的六位色碼）
    const ink = (n) => css.getPropertyValue(`--${n}-ink`).trim().replace("#", "");
    const macros = {};
    for (const [m, n] of [["cB","blue"],["cO","orange"],["cG","green"],["cP","pink"],["cV","purple"],["cT","teal"],["cY","yellow"]])
      macros["\\" + m] = `\\textcolor{${ink(n)}}{#1}`;
    const errs = [];
    document.querySelectorAll(".tex").forEach((el) => {
      const src = el.textContent.trim();
      try { katex.render(src, el, { displayMode: el.tagName === "DIV", throwOnError: true, strict: false, macros: { ...macros } }); }
      catch (e) { errs.push(`${src}  →  ${e.message}`); }
    });
    return errs;
  });
  if (errors.length) { console.error("KaTeX 錯誤：\n" + errors.join("\n")); await browser.close(); process.exit(1); }
}
await page.evaluate(() => document.fonts.ready);

// ---- 書寫區：真正的向量圓點，間距 24pt（約 4.6mm） ----
await page.evaluate(() => {
  const PT = 96 / 72, GAP = 24, R = 0.9;
  const fill = getComputedStyle(document.documentElement).getPropertyValue("--dot").trim();
  document.querySelectorAll(".write").forEach((el) => {
    const w = el.clientWidth / PT, h = el.clientHeight / PT;
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    const cols = Math.floor((w - GAP) / GAP), rows = Math.floor((h - GAP) / GAP);
    const ox = (w - cols * GAP) / 2, oy = (h - rows * GAP) / 2;
    let d = "";
    for (let r = 0; r <= rows; r++) for (let c = 0; c <= cols; c++) {
      const x = (ox + c * GAP).toFixed(2), y = (oy + r * GAP).toFixed(2);
      d += `M${x - R},${y}a${R},${R} 0 1,0 ${R * 2},0a${R},${R} 0 1,0 ${-R * 2},0`;
    }
    const p = document.createElementNS(ns, "path");
    p.setAttribute("d", d); p.setAttribute("fill", fill);
    svg.appendChild(p); el.prepend(svg);
  });
});

// ---- 溢出檢查：直向看所有元素，橫向看容易超寬的元素 ----
const report = await page.evaluate(() => {
  const PT = 96 / 72;
  return [...document.querySelectorAll(".page")].map((pg, i) => {
    const body = pg.querySelector(".body");
    if (!body) return { page: i + 1, slack: -9999, wide: 0 };
    const cs = getComputedStyle(pg), box = pg.getBoundingClientRect();
    const limitY = box.bottom - parseFloat(cs.paddingBottom), limitX = box.right - parseFloat(cs.paddingRight);
    let bottom = 0, right = 0;
    body.querySelectorAll("*").forEach((n) => {
      if (n.closest(".katex, .meta")) return;
      const b = n.getBoundingClientRect().bottom; if (b > bottom) bottom = b;
    });
    body.querySelectorAll("pre, table, .eq, .katex-html, img").forEach((n) => {
      const r = n.getBoundingClientRect().right; if (r > right) right = r;
    });
    return { page: i + 1, slack: Math.round((limitY - bottom) / PT), wide: Math.max(0, Math.round((right - limitX) / PT)) };
  });
});
let bad = false;
for (const r of report) {
  const flags = (r.slack < 0 ? " ← 直向溢出！" : "") + (r.wide > 0 ? ` ← 橫向超出 ${r.wide}pt！` : "");
  if (flags) bad = true;
  console.log(`p.${String(r.page).padStart(2)}  剩餘 ${String(r.slack).padStart(5)} pt${flags}`);
}

await page.pdf({ path: output, preferCSSPageSize: true, printBackground: true });
await browser.close();
if (bad) process.exitCode = 2;
```

## 檔案三：template.html

每種頁面各一頁的骨架。裡面的歐姆定律只是示範元件怎麼用，製作時整段換成該課內容，頁數與段落數依教材調整。

```html
<!doctype html>
<!-- FILE: template.html ｜ 示範內容請整段替換 -->
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8">
<title>課名 節次 標題</title>
<link rel="stylesheet" href="handout.css">
</head>
<body>

<!-- ===== 節首頁 ===== -->
<section class="page opener">
 <div class="body">
  <svg class="glyph" viewBox="0 0 220 220" aria-hidden="true">
    <circle cx="110" cy="110" r="78" fill="none" stroke="var(--blue)" stroke-width="12"/>
    <path d="M70,110 h22 l8,-20 l16,40 l16,-40 l8,20 h22" fill="none" stroke="var(--orange)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="110" cy="32" r="11" fill="var(--green)"/>
  </svg>
  <p class="course">課程名稱<br>第 N 章　章名</p>
  <p class="secno">N.M</p>
  <h1>小節標題<br>一句話說出這節在問什麼</h1>
  <p class="lead">用兩三句話，從讀者熟悉的情境帶出這一節要解決的問題。</p>
  <div class="goals">
   <h3>讀完這一節，你能夠</h3>
   <ol>
    <li>可以驗收的能力一（對應段落 1）</li>
    <li>可以驗收的能力二（對應段落 2）</li>
    <li>可以驗收的能力三（對應段落 3）</li>
   </ol>
  </div>
  <div class="meta">
   <div><span>對應投影片</span>Chapter N，p.1–10</div>
   <div><span>閱讀時間</span>約 30 分鐘</div>
   <div><span>練習</span>3 題，附詳解</div>
   <div><span>先備知識</span>分數、科學記號</div>
  </div>
 </div>
</section>

<!-- ===== 概念頁：情境 → 定義 → 圖解 → 公式 ===== -->
<section class="page">
 <div class="rh"><span>N.M　小節標題</span><span>段落 1 ／ 3</span></div>
 <div class="body">
  <p class="eyebrow">段落 1 <span class="src">　投影片 p.3</span></p>
  <h2>段落標題：一個概念</h2>

  <p>先用生活情境開場，再帶出術語：水管裡的水壓越大，水流越強。電路裡對應的是<b>電壓</b> <span class="en">voltage</span> 與<b>電流</b> <span class="en">current</span>，擋住水流的程度則是<b>電阻</b> <span class="en">resistance</span>。</p>

  <dl class="terms">
   <div>
    <dt>電流 <span class="en">current</span></dt>
    <dd>每秒有多少電荷流過。<span class="unit">單位：安培 A<br>生活中：手機充電約 1–3 A</span></dd>
   </div>
   <div>
    <dt>電阻 <span class="en">resistance</span></dt>
    <dd>阻擋電流的程度，越大越難流過。<span class="unit">單位：歐姆 Ω</span></dd>
   </div>
  </dl>

  <figure>
   <div class="panel">
    <svg viewBox="0 0 626 132" role="img" aria-label="電壓固定時，電阻加倍，電流減半">
      <text x="13" y="14" font-size="14" font-weight="600" fill="var(--orange-ink)">電阻</text>
      <text x="333" y="14" font-size="14" font-weight="600" fill="var(--blue-ink)">電流</text>
      <g fill="var(--orange)"><rect x="13" y="30" width="50" height="24" rx="8"/><rect x="13" y="68" width="100" height="24" rx="8"/><rect x="13" y="106" width="200" height="24" rx="8"/></g>
      <g font-size="14" fill="var(--text)"><text x="73" y="47">100 Ω</text><text x="123" y="85">200 Ω</text><text x="223" y="123">400 Ω</text></g>
      <g fill="var(--blue)"><rect x="333" y="30" width="200" height="24" rx="8"/><rect x="333" y="68" width="100" height="24" rx="8"/><rect x="333" y="106" width="50" height="24" rx="8"/></g>
      <g font-size="14" fill="var(--text)"><text x="543" y="47">80 mA</text><text x="443" y="85">40 mA</text><text x="393" y="123">20 mA</text></g>
    </svg>
   </div>
   <figcaption><b>圖 1</b>電壓固定在 8 V。橘色是電阻，藍色是電流：電阻每加倍一次，電流就減半一次。</figcaption>
  </figure>

  <div class="formula">
   <div class="eq"><span class="v green">電壓</span><span class="op">=</span><span class="v blue">電流</span><span class="op">×</span><span class="v orange">電阻</span></div>
   <div class="tex">\cG{V} = \cB{I}\,\cO{R}</div>
   <div class="eq-en">Voltage = Current × Resistance（Ohm's law）</div>
  </div>

  <p><mark>整頁最關鍵的一句話放在這裡。</mark>其餘說明維持一般內文。</p>
 </div>
 <div class="pn">2</div>
</section>

<!-- ===== 例題頁 ===== -->
<section class="page">
 <div class="rh"><span>N.M　小節標題</span><span>段落 1 ／ 3</span></div>
 <div class="body">
  <section class="example">
   <p class="tag">例題 1<span class="lv">投影片 p.4</span></p>
   <p class="q">一顆 9 V 的電池接上 450 Ω 的電阻，流過的電流是多少 mA？</p>
   <dl class="given">
    <dt>已知</dt><dd>電壓 9 V，電阻 450 Ω</dd>
    <dt>要求</dt><dd>電流，單位 mA</dd>
    <dt>想法</dt><dd>公式裡只有電流未知，移項後代入，最後換單位。</dd>
   </dl>
   <ol class="steps">
    <li><p class="st">把公式移項成要求的量</p><div class="tex">I = \frac{V}{R}</div></li>
    <li><p class="st">代入數字</p><div class="tex">I = \frac{9\ \text{V}}{450\ \Omega} = 0.02\ \text{A}</div></li>
    <li><p class="st">換成題目要的單位</p><p class="work">0.02 A = <span class="result">20 mA</span></p></li>
    <li><p class="st">檢查答案合不合理</p><p>反過來乘：0.02 A × 450 Ω = 9 V，吻合。</p></li>
   </ol>
  </section>

  <aside class="note warn">
   <p class="label">留意</p>
   <p>這裡寫初學者最容易犯的一個錯，例如代公式前忘了把 mA 換成 A。</p>
  </aside>

  <p class="eyebrow lab" style="margin-top:36pt">動手做　約 2 分鐘</p>
  <h3 style="margin-top:0">用 Python 驗算</h3>
  <pre class="code"><span class="p">$</span> python3 -c <span class="s">"print(9 / 450 * 1000, 'mA')"</span>
<span class="hl">20.0 mA</span></pre>
  <p>每一步都寫出讀者應該看到什麼；沒有實際執行過的輸出要註明是示意。</p>

  <aside class="note life">
   <p class="label">生活中</p>
   <p>說出這個概念用在哪個真實產品或場景，並帶上數字。</p>
  </aside>
 </div>
 <div class="pn">3</div>
</section>

<!-- ===== 練習頁：每頁最多三題 ===== -->
<section class="page">
 <div class="rh"><span>N.M　小節標題</span><span>練習 1–3</span></div>
 <div class="body">
  <p class="eyebrow">練習</p>
  <h2 class="tight">換你試試</h2>
  <p class="dim">先自己寫，寫完再翻到下一頁對答案。</p>

  <section class="practice">
   <p class="tag">練習 1<span class="lv">基本</span></p>
   <p class="q">5 V 的電源接上 250 Ω 的電阻，電流是多少 mA？</p>
   <div class="write s"><div class="ans">答<i></i></div></div>
  </section>
  <section class="practice">
   <p class="tag">練習 2<span class="lv">觀念</span></p>
   <p class="q">電壓不變，把電阻換成原本的兩倍，電流會怎麼變？用一句話說明理由。</p>
   <div class="write m"></div>
  </section>
  <section class="practice">
   <p class="tag">練習 3<span class="lv">變化</span></p>
   <p class="q">3 mA 的電流流過 2 kΩ 的電阻，電阻兩端的電壓是多少 V？</p>
   <div class="write s"><div class="ans">答<i></i></div></div>
  </section>
 </div>
 <div class="pn">4</div>
</section>

<!-- ===== 解答頁：緊接在練習的下一頁 ===== -->
<section class="page">
 <div class="rh"><span>N.M　小節標題</span><span>解答 1–3</span></div>
 <div class="body">
  <p class="eyebrow quiet">解答</p>
  <h2>練習 1–3</h2>

  <section class="answer">
   <p class="tag">練習 1</p>
   <p class="final">20 mA</p>
   <div class="tex">I = \frac{V}{R} = \frac{5\ \text{V}}{250\ \Omega} = 0.02\ \text{A} = 20\ \text{mA}</div>
  </section>
  <section class="answer">
   <p class="tag">練習 2</p>
   <p class="final">電流變成原本的一半</p>
   <p>電壓固定時，電流與電阻成反比，就是圖 1 從第一列到第二列的變化。</p>
  </section>
  <section class="answer">
   <p class="tag">練習 3</p>
   <p class="final">6 V</p>
   <p>先把單位換成 A 與 Ω：3 mA = 0.003 A，2 kΩ = 2000 Ω。</p>
   <div class="tex">V = I R = 0.003\ \text{A} \times 2000\ \Omega = 6\ \text{V}</div>
  </section>

  <div class="back">
   <h3>寫錯了？回頭看這裡</h3>
   <table>
    <tr><td style="width:9em">練習 1、3</td><td>多半是單位沒換。重看第 3 頁的例題 1。</td></tr>
    <tr><td>練習 2</td><td>重看第 2 頁的圖 1。</td></tr>
   </table>
  </div>
 </div>
 <div class="pn">5</div>
</section>

<!-- ===== 複習頁：重點、公式一覽、自我檢查、術語對照、下一節 ===== -->
<section class="page">
 <div class="rh"><span>N.M　小節標題</span><span>本節重點</span></div>
 <div class="body">
  <p class="eyebrow">複習</p>
  <h2>本節重點</h2>
  <ol class="keypoints">
   <li>每個段落濃縮成一句話，<b>術語</b>用粗體。最多五點。</li>
   <li>電壓固定時，<b>電流</b>與<b>電阻</b>成反比。</li>
  </ol>

  <h3>公式一覽</h3>
  <div class="fsheet">
   <div class="row"><span class="lbl">歐姆定律</span><div class="eq"><span class="v green">電壓</span><span class="op">=</span><span class="v blue">電流</span><span class="op">×</span><span class="v orange">電阻</span></div></div>
   <div class="row"><span class="lbl">求電流</span><div class="tex">\cB{I} = \frac{\cG{V}}{\cO{R}}</div></div>
  </div>

  <h3>自我檢查</h3>
  <ul class="check">
   <li>我能不看講義，說出電壓、電流、電阻各是什麼</li>
   <li>我能不看例題，獨立解出練習 3</li>
  </ul>

  <h3>術語對照</h3>
  <table style="margin-top:10pt">
   <tr><th style="width:26%">中文</th><th style="width:34%">English</th><th>一句話</th></tr>
   <tr><td><b>電壓</b></td><td>voltage</td><td>推動電荷的力道</td></tr>
   <tr><td><b>電流</b></td><td>current</td><td>每秒流過多少電荷</td></tr>
   <tr><td><b>電阻</b></td><td>resistance</td><td>阻擋電流的程度</td></tr>
  </table>

  <aside class="note next">
   <p class="label">下一節　N.M+1 標題</p>
   <p>用一個問題預告下一節要解決什麼。</p>
  </aside>
 </div>
 <div class="pn">6</div>
</section>

</body>
</html>
```

內容較多時，複習的各區塊可以拆成兩頁（重點與公式一頁、自我檢查與術語對照一頁）。若使用者改用其他尺寸的 iPad，只需調整 `handout.css` 的 `--page-w`、`--page-h`、`@page` 與 `build.mjs` 的 viewport，並維持每行 35–40 個漢字。