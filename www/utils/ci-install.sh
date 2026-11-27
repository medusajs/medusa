#!/usr/bin/env bash
# Installs every workspace except persona-journeys, whose dependencies
# (promptfoo, Playwright) are only needed to run it locally.
set -euo pipefail
cd "$(dirname "$0")"

yarn workspaces focus $(yarn workspaces list --json | jq -r 'select(.name != "persona-journeys") | .name')
