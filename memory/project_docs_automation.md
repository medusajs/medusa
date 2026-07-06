---
name: Docs Automation System
description: Automated documentation update system that runs Claude Code when packages/ changes merge
type: project
---

A docs automation pipeline was built to automatically update documentation when code changes merge to `develop`.

**Why:** Manual documentation updates are slow and error-prone. Automation reduces the lag between code changes and doc updates.

**How to apply:** When adding new automation features or modifying the docs pipeline, start here.

## Key Components

- **`www/utils/packages/docs-automator/`** — New package: analyzes git diffs, maps changed packages to doc projects, builds Claude prompts
- **`.github/workflows/docs-automation.yml`** — GitHub Action triggered on `push` to `develop` touching `packages/**`
- **`.claude/skills/writing-docs/`** — Repo-level Claude skill with reference files for doc writing conventions

## Design Decisions

- The `docs/release-docs-staging` branch accumulates all automated doc changes for a release cycle; the PR against `develop` is reviewed and merged at release time
- Package-to-project mapping uses a wide-net static table; Claude uses the `when-to-document.md` skill reference to decide which projects actually need changes
- Protected directories (`resources/references/`, `ui/specs/components/`, `api-reference/`) are guarded by a safety-check step that fails the workflow if they're touched
- `DOCS_AUTOMATION_PAT` secret is needed (new PAT with `contents: write` and `pull-requests: write`) in addition to existing `CLAUDE_CODE_OAUTH_TOKEN`
- `Skill` must be in `claude_args --allowedTools` for the `/writing-docs` skill to work in the action
