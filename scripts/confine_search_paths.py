#!/usr/bin/env python3
#
# PreToolUse hook for Grep and Glob in model jobs: blocks any search that can
# reach outside the working directory (e.g. /proc/<pid>/environ).
#
# Usage (Claude Code settings):
#   "hooks": {"PreToolUse": [{"matcher": "Grep|Glob", "hooks": [
#     {"type": "command", "command": "python3 \"$CLAUDE_PROJECT_DIR/scripts/confine_search_paths.py\""}]}]}
#
# Reads the hook payload on stdin. Exits 0 to allow, 2 to block (the reason
# goes to the model on stderr). Fails closed on a malformed payload.
#

import json
import os
import sys


def escapes(pattern):
    return pattern.startswith(("/", "~")) or ".." in pattern.replace("\\", "/").split("/")


def main():
    try:
        payload = json.load(sys.stdin)
        tool_input = payload.get("tool_input") or {}
        root = os.path.realpath(payload.get("cwd") or os.getcwd())
    except (ValueError, AttributeError):
        print("Blocked: unreadable hook payload", file=sys.stderr)
        return 2

    path = os.path.realpath(os.path.join(root, tool_input.get("path") or "."))
    if path != root and not path.startswith(root + os.sep):
        print(f"Blocked: searches are limited to the repository ({root})", file=sys.stderr)
        return 2

    pattern_keys = ["glob"]
    if payload.get("tool_name") == "Glob":
        pattern_keys.append("pattern")

    for key in pattern_keys:
        value = tool_input.get(key)
        if isinstance(value, str) and escapes(value):
            print(f"Blocked: `{key}` must be relative to the repository, without ..", file=sys.stderr)
            return 2

    return 0


if __name__ == "__main__":
    sys.exit(main())
