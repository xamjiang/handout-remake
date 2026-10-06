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
