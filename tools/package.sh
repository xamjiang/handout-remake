#!/usr/bin/env bash
# 打包 skill，輸出到 dist/：
#   handout-remake.zip         Claude、Codex 等：zip 裡是 handout-remake/ 資料夾
#   handout-remake-gemini.zip  Google Gemini：SKILL.md 在 zip 根目錄，
#                              Gemini 不接受的副檔名（.css .html .mjs）加上 .txt
# 只打包已 commit 的內容（git archive），工作目錄的未提交修改不會進封包。
set -euo pipefail

NAME=handout-remake
ROOT=$(git rev-parse --show-toplevel)
DIST="$ROOT/dist"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

mkdir -p "$DIST"
rm -f "$DIST/$NAME.zip" "$DIST/$NAME-gemini.zip"

# Claude 等平台
git -C "$ROOT" archive --format=zip --prefix="$NAME/" -o "$DIST/$NAME.zip" "HEAD:skills/$NAME"

# Gemini
mkdir "$TMP/gemini"
git -C "$ROOT" archive "HEAD:skills/$NAME" | tar -x -C "$TMP/gemini"
find "$TMP/gemini" -type f \( -name '*.css' -o -name '*.html' -o -name '*.mjs' \) -exec mv {} {}.txt \;
(cd "$TMP/gemini" && zip -q -r -X "$DIST/$NAME-gemini.zip" .)

for z in "$DIST/$NAME.zip" "$DIST/$NAME-gemini.zip"; do
  echo "── $(basename "$z")"
  unzip -Z1 "$z" | sed 's/^/   /'
done
