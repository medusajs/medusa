# Dependency-Update PR Review

How to review a PR that bumps dependency versions (Dependabot, Renovate, or a
manual dependency bump). The goal is **not** to nag the author for a filled-in
PR template or to block on lockfile churn. The goal is to:

1. Enumerate exactly which packages changed and their version deltas.
2. Retrieve each package's release notes / changelog across the bumped range.
3. Classify each change: hard breaking change, behavior change, or safe.
4. Map anything non-trivial to **how Medusa actually uses the package**, so the
   summary tells maintainers what to specifically test.

This produces an informative, low-noise review: usually `initial-approval` with a clear
"areas to test" note, and `needs-changes` / `requires-team` only when a real
breaking change lands in code Medusa depends on.

## When this flow applies

Treat a PR as a dependency-update PR when **any** of these hold:

- The author is a dependency bot: `dependabot[bot]` or `renovate[bot]`.
- The PR carries the `dependencies` label.
- The diff only touches dependency manifests / lockfiles: `package.json`,
  `yarn.lock`, `package-lock.json`, or `pnpm-lock.yaml`.

For these PRs, **skip template-compliance and massive-change checks** (bots
don't fill the template, and lockfile diffs are legitimately huge). Still run
the supply-chain security checks (see below).

## Step A — Enumerate the changed packages

Get the version deltas from two sources and reconcile them:

- **PR body** (`get_pr.sh`): Dependabot/Renovate include a table of
  `Package | From | To` plus links to each package's release notes / changelog /
  commits, and the source GitHub repo (e.g. `[ajv](https://github.com/ajv-validator/ajv)`).
  Grouped security PRs also list `dependency-type` (`direct:production`,
  `direct:development`, or `indirect`) — note it, direct-production bumps matter
  most.
- **Diff** (`get_pr_diff.sh`): confirm which `package.json` files changed (direct
  deps of published `@medusajs/*` packages) versus lockfile-only changes
  (transitive). A dep that changes only in `yarn.lock` is transitive; a dep that
  changes in a `packages/**/package.json` is a direct dependency of that package.

Build a working list: `name`, `from`, `to`, direct-or-transitive, and the
GitHub repo slug (from the PR body links).

## Step B — Retrieve release notes for each package

Use the read-only helper (GitHub API only):

```bash
bash scripts/get_dependency_releases.sh <owner/repo> [changelog_path]
```

- Pass the `owner/repo` extracted from the PR body's package link.
- If the PR body's "Changelog" link points at a file (e.g.
  `.../blob/master/CHANGELOG.md`, `History.md`), pass that filename as the
  second argument — some packages keep a CHANGELOG file instead of GitHub
  Releases (e.g. js-yaml, qs, minimatch), and `joi` has no GitHub Releases at
  all.
- Read every entry **between `from` (exclusive) and `to` (inclusive)**. Ignore
  entries for later/pre-release versions the PR does not adopt (e.g. a `3.0.0`
  alpha when the bump is `2.0.2 -> 2.2.0`).

Prioritise by blast radius: **direct:production** deps that Medusa calls
directly first, then direct:development, then transitive. For a large grouped
PR, it's fine to give the high-blast-radius packages a full read and summarise
the low-risk patch bumps briefly.

If the helper returns nothing for a package (no releases, no changelog path)
and the PR body has no usable notes, say so explicitly in the summary rather
than guessing — do not invent release-note content.

## Step C — Classify each package's changes

For each package, land on one verdict:

- **Hard breaking change** — removed/renamed/retyped public API, or a changed
  default that alters existing call sites. Rare in patch/minor bumps.
- **Behavior change** — same API, different runtime behavior (stricter parsing,
  new default limits, changed output format, new validation that rejects
  previously-accepted input). These are the ones that bite silently.
- **Safe** — pure bug/security/perf fix with no observable behavior change for
  how Medusa uses it.

Security fixes frequently **tighten** previously-permissive behavior (e.g.
inputs that used to be accepted are now rejected). Treat those as behavior
changes worth testing, not as "safe", when Medusa feeds the relevant input.

## Step D — Map to Medusa usage

A change only matters if Medusa exercises the affected surface. For each hard
breaking or behavior change, find the call sites and read them with `Read`:

- Identify which `@medusajs/*` package(s) declare or import the dependency.
- Read the actual usage: which functions/options Medusa calls, and whether the
  changed behavior is on that path.
- Where practical, reason about whether Medusa's specific usage is affected. If
  it clearly is not (e.g. the change is to an env-var parser but Medusa passes
  the config programmatically), say so and downgrade the concern.

Known high-traffic call sites (verify they still exist; the tree moves):

| Dependency | Typical Medusa call site |
|-----------|--------------------------|
| routing / path matching (e.g. `path-to-regexp`) | `packages/core/framework/src/http/routes-finder.ts` |
| query string (`qs`) | `packages/medusa/src/loaders/api.ts` (`parse`), `packages/core/js-sdk/src/client.ts` (`stringify`) |
| HTTP logging (`morgan`) | `packages/core/framework/src/http/express-loader.ts` |
| uploads (`multer`) | `packages/medusa/src/api/admin/uploads/middlewares.ts`, `.../products/middlewares.ts` |
| CSV (`json-2-csv`) | `packages/core/core-flows/src/product/utils/*.ts`, `.../order/steps/export-orders.ts` |
| telemetry (`@opentelemetry/*`) | `packages/medusa/src/instrumentation/index.ts`, `packages/deps/` |

This is a starting map, not a limit — follow the actual imports for whatever
package changed.

## Step E — Supply-chain security (always)

Dependency PRs are the classic supply-chain vector. On top of the normal
security pass:

- Verify the bumped packages are the expected, well-known packages — not
  typosquats or a swap to a different registry/source.
- Check for suspicious new lifecycle scripts (`postinstall`, `preinstall`,
  `prepare`) introduced by the bump.
- Confirm lockfile changes are consistent with the `package.json` changes (no
  unexplained extra packages pulled in).

A clearly malicious dependency swap (typosquat, exfil script) is a
`close-malicious` case, per the main flow.

## Step F — Compose the decision

- **Default outcome for a clean bump: `approve`.** Put the value in the review:
  a short per-package verdict and, most importantly, a concise **"areas to
  test"** list derived from the behavior changes mapped to Medusa usage (e.g.
  "run HTTP integration tests — routing + query parsing behavior changed").
- **`needs-changes` (`requires-more`)** only when a hard breaking change or a
  behavior change genuinely affects a Medusa call site and the PR does not
  account for it — state the package, the change, the call site, and what to do.
- **`requires-team`** when the affected area is sensitive or the correct
  response needs maintainer judgement (e.g. a telemetry/runtime behavior change
  self-hosters may rely on, a framework-level routing change).
- Keep `blocking_points` concrete and per-package. Do not block on lockfile
  size, transitive-only patch bumps, or a missing PR template for a bot PR.

Because the review's `summary` is capped (600 chars) and `blocking_points` are
one line each, lead with the highest-blast-radius findings and the test areas;
summarise the long tail of safe patch bumps in a single clause.
