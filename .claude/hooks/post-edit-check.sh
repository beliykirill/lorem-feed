#!/usr/bin/env bash
# PostToolUse hook: run typecheck and lint after a JS/TS file edit.
# Skips silently (exit 0) until the project is initialized.
# Exit 2 sends the failure output back to Claude.
set -u

project_dir="${CLAUDE_PROJECT_DIR:-$(pwd)}"

# No project yet: skip before touching node or stdin.
cd "$project_dir" || exit 0
[ -f package.json ] || exit 0
[ -d node_modules ] || exit 0

if ! command -v node >/dev/null 2>&1; then
  echo "post-edit-check: node not found, typecheck and lint skipped" >&2
  exit 1
fi

# Read the edited file path from the hook's stdin JSON.
file_path="$(node -e '
  let s = "";
  process.stdin.on("data", (c) => (s += c)).on("end", () => {
    try { process.stdout.write(JSON.parse(s).tool_input?.file_path ?? ""); } catch {}
  });
')"

case "$file_path" in
  *.ts | *.tsx | *.js | *.jsx) ;;
  *) exit 0 ;;
esac

has_script() {
  node -e 'process.exit(require("./package.json").scripts?.[process.argv[1]] ? 0 : 1)' "$1" 2>/dev/null
}

output=""
failed=0

# Yarn Berry has no -s/--silent flag.
if has_script typecheck; then
  if ! result="$(yarn typecheck 2>&1)"; then
    output+="typecheck failed:"$'\n'"$result"$'\n'
    failed=1
  fi
fi

if has_script lint && [ -f "$file_path" ]; then
  if ! result="$(yarn eslint "$file_path" 2>&1)"; then
    output+="eslint failed for $file_path:"$'\n'"$result"$'\n'
    failed=1
  fi
fi

if [ "$failed" -ne 0 ]; then
  printf '%s' "$output" >&2
  exit 2
fi
exit 0
