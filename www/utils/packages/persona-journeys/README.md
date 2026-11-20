# persona-journeys

Simulates docs personas with Claude agents and scores whether their journeys meet the docs goals. Use it to test IA or content changes against branch previews or production.

| Suite | How it runs |
| --- | --- |
| `static` | [afdocs](https://github.com/agent-ecosystem/afdocs) agent-readiness checks (llms.txt, Markdown, page size) |
| A persona, e.g. `john`, `agent` | A Claude agent role-plays the persona through its channel, then [promptfoo](https://www.promptfoo.dev) grades each journey |

Each persona reaches the docs through a channel:

| Channel | What the agent can do | Built-in checks |
| --- | --- | --- |
| `browser` | Opens the homepage in a headless browser ([Playwright MCP](https://github.com/microsoft/playwright-mcp)) and only clicks | `browsedByClicking` |
| `fetch` | Reads `docs.medusajs.com` URLs with a single `fetch_url` tool, asking for Markdown | `usedAgentEntryPoints`, `gotMarkdown`, `noBrokenFetches` |

## Run

Requires a logged-in Claude Code, or `ANTHROPIC_API_KEY`. Runs count against that account's usage. `browser` personas also need Google Chrome installed.

```bash
yarn build

yarn journeys                      # static checks and every persona, against production
PREVIEW_BRANCH=docs-ia-navigation yarn journeys john agent -- --repeat 3
yarn view                          # browse results, trajectories, and grader reasons
```

- Pass suite names to run a subset, and promptfoo options after `--`.
- Results are written to `results/`.
- CI skips this package: workflows install `www/utils` with `ci-install.sh`, and the root `yarn build` excludes it. Build it from this directory.

## Preview branches

Set `PREVIEW_BRANCH` to the branch's preview prefix to test a branch instead of production. The book preview proxies `/cloud`, `/resources`, and other app paths to production, so the package routes each path to its own preview (see `src/routes.ts`):

- The `fetch` channel maps `docs.medusajs.com` URLs to the matching preview, so agents use the real URLs.
- The `browser` channel opens a local proxy on `http://localhost:4321` (`PROXY_PORT`) that serves all previews under one origin.

## Add a persona

Create `personas/<id>/persona.yaml`:

```yaml
name: Priya
description: A merchant moving her store from Shopify
channel: browser # or fetch
profile: |
  You are role-playing Priya ... (system prompt describing the persona)
assert: # optional, applied to every journey of this persona
  - type: llm-rubric
    metric: Friction
    value: ...
```

Then add its journeys in `personas/<id>/journeys.yaml`.

## Add a journey

Append a test to the persona's `journeys.yaml`. It's a [promptfoo test case](https://www.promptfoo.dev/docs/configuration/test-cases/): set `vars.goal` for `browser` personas or `vars.question` for `fetch` personas.

```yaml
- description: Import products
  vars:
    goal: Find how to import your products from a CSV file.
  assert:
    - type: javascript
      metric: Findability
      value: visitedAny
      config:
        paths: [/user-guide/products/import]
    - type: llm-rubric
      value: John finds the import page without touching the terminal.
```

A `javascript` assertion's `value` can name a check from `src/assertions.ts`:

| Check | Channel | `config` |
| --- | --- | --- |
| `visitedAny` | `browser` | `paths`: pages, one of which must be reached |
| `withinPageBudget` | `browser` | `budget`: max pages visited |
| `fetchedAny` | `fetch` | `paths`: pages, one of which must be fetched |

Add a new check by exporting it from `src/assertions.ts`. Add a new channel in `src/channels.ts`.
