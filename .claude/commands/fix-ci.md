---
description: Diagnose a CI failure from a pasted log or GH URL — identify job, step, and root cause; propose fix. Loads debugger agent.
---

# /fix-ci — Diagnose CI Failure

$ARGUMENTS

ultrathink

> "Работает на моей машине" → "Тогда деплоим твою машину." — CI catches what local doesn't.
> "Отскочим — побормочем." — Log privately, reason in public.
> "Сбоку заходи, сбоку!" — Local can't reproduce? Attack from the CI env side (path sep, case, TZ, node version, submodule auth, secrets).

## Delegation

Load `debugger` agent. Skills: `systematic-debugging`, `bash-linux`, `powershell-windows`. If the failure looks deploy-related, also pull `devops-engineer`.

## Input the user provides

One of:

- **Paste**: CI log text (stderr/stdout from the failing step).
- **GH URL**: `https://github.com/OWNER/REPO/actions/runs/NNN/job/MMM` — fetch via `gh run view` or `gh api` if `gh` is authenticated.
- **Recent failure**: no input — check `gh run list --limit 5` and pick the latest `FAILURE` on `main`.

## Workflow

### 1. Extract the minimal diagnostic unit

From the log isolate:
- **Workflow file + job name** (e.g. `.github/workflows/ci.yml` → `cli-tests`)
- **Failing step name** (e.g. `Install dependencies`, `Unit tests`)
- **Exit code** (often the last line: `Error: Process completed with exit code 1`)
- **Error message** — the actual cause line(s), not the wrapper

### 2. Classify the failure

CI failures almost always fit one of these patterns:

| Category | Signals | Typical fix |
|----------|---------|-------------|
| **Env drift (OS)** | Works local (Windows) fails CI (Ubuntu) — path separators, filename case, `rm -rf`, shebangs, CRLF | Normalize via `pathe`, `.gitattributes`, case-exact paths, portable shell |
| **Auth / secrets** | `Repository not found`, `403`, `Bad credentials` | Submodules without deploy key; missing `secrets.NPM_TOKEN`, etc. Add secret or drop the step. |
| **Submodule access** | `fatal: clone of 'git@github.com:…' failed`, `Repository not found` on clone | Drop `submodules: recursive` if not needed; else add deploy key as action secret. |
| **Cache miss / lockfile** | `npm ci` fails with `Cannot find module`, `lockfile out of sync` | Commit fresh lockfile; ensure `cache-dependency-path` points at the right lockfile. |
| **Node version drift** | Works on 20 local, fails on 18 CI (or vice versa) | Pin `node-version` in workflow matching `"engines"` in package.json |
| **Missing system dep** | Binary not found (e.g. `playwright`, native module) | Install in a prior step, or use an image that bundles it |
| **Tool version** | `tsc` newer locally than CI | Align; prefer `npx tsc` over global |
| **Flaky parallelism / race** | Passes on rerun, or intermittent | Flag as flaky; fix test isolation (separate tmp dirs, avoid shared state) |
| **Resource limit** | Job timeout, OOM | Raise limits or parallelize differently |
| **Side-effect of prior change** | "Worked last week, broke now, no code change" | `git log` the workflow + relevant actions versions. A `uses: actions/checkout@v4` update can shift behavior. |
| **Merge conflict residue** | `<<<<<<<` / `=======` / `>>>>>>>` markers in tracked files; tests or build fail parsing; recent bad merge/rebase on the branch | Route to `/resolve-conflicts` — classify by file class (trivial / generated / slot-protected / semantic / structural) and fix per class. Re-run CI after. |

### 3. Reproduce locally (if possible)

Don't just read the log — try to reproduce. If it's env-specific (Linux-only), use Docker or WSL. If not reproducible locally → it IS an env drift issue, which narrows the diagnosis.

### 4. Propose the fix

Output in this shape:

```markdown
## CI failure analysis

**Run**: `<url or job id>`
**Failing job → step**: `cli-tests → Install dependencies`
**Exit code**: 1
**Root error**:
> npm ci fatal: Unable to resolve package … from the lock file.

## Classification
**Cache miss / lockfile mismatch** — likely `packages/cli/package-lock.json` was regenerated locally with a different npm version.

## Reproduction
- Local: `cd packages/cli && rm -rf node_modules && npm ci` → reproduces failure.

## Proposed fix
- Regenerate lockfile with matching npm: `npm install -g npm@10 && cd packages/cli && rm package-lock.json && npm install`
- Commit and re-run CI.

## Alternative
If we want to allow drift: switch `npm ci` → `npm install --prefer-offline` in the workflow. Not recommended — we lose reproducibility.

## Retrigger
After fix lands: `gh workflow run ci.yml --ref main` or push a trivial commit.
```

### 5. Absolute constraints

- **Never disable a failing job** to "make CI green" — that's test-deletion by proxy. If the job is truly obsolete, remove it explicitly with a commit message that says so.
- **Never commit secrets to fix an auth issue.** Use `secrets.*`.
- **Never bypass `prepublishOnly` / `preversion`** hooks to ship from CI without their checks.

## Pairs with

- `/debug` — for the deep RCA portion if the classification isn't obvious.
- `/fix-tests` — if the CI failure is test-related (run `/fix-tests` locally first).
- `/fix-types` — if CI's type-check step failed.
- `/resolve-conflicts` — if the failure smells like a bad merge (residual markers, unexpected reverts, broken imports after rebase).
- `/verify` — after the fix, before retriggering, ensure locally clean.

## Examples

```
/fix-ci <paste log>
/fix-ci https://github.com/UnderUndre/ai/actions/runs/1234567890
/fix-ci                         # check latest failure via `gh run list`
```
