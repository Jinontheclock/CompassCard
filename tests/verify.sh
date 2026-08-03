#!/bin/bash
# Every screen against its Figma coordinates. A spec only passes if
# measure.js exits 0 AND prints its success line — a crash can never read
# as a pass. Usage: bash tests/verify.sh [origin]  (default localhost:4173,
# i.e. `npm run build && npx vite preview` in another shell first).
BASE="${1:-http://localhost:4173/}"
cd "$(dirname "$0")"
echo "### verifying $BASE"
rc=0
for f in specs/*.json; do
  s=$(basename "$f" .json)
  tmp=$(mktemp)
  node -e "
    const fs=require('fs');
    const spec=JSON.parse(fs.readFileSync('$f','utf8'));
    spec.url=process.argv[1];
    fs.writeFileSync('$tmp.json',JSON.stringify(spec));
  " "$BASE"
  out=$(node measure.cjs "$tmp.json" 2>&1); code=$?
  ok=$(printf '%s' "$out" | grep -c "all measured boxes match Figma")
  if [ "$code" -eq 0 ] && [ "$ok" -eq 1 ]; then
    printf "  PASS  %-14s %s boxes\n" "$s" "$(printf '%s' "$out" | grep -cE '^  ok ')"
  else
    rc=1
    printf "  FAIL  %-14s (exit %s)\n" "$s" "$code"
    printf '%s\n' "$out" | grep -E "^  (FAIL|MISSING)|Error|Timeout" | head -6 | sed 's/^/        /'
  fi
  rm -f "$tmp" "$tmp.json"
done
exit $rc
