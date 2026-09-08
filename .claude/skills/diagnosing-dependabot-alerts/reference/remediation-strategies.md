# Remediation Strategies

Detailed tracing recipe, semver analysis, per-tier commands, and breaking-change checks. Package manager here is Yarn 3.x (berry) with a node-modules linker; `yarn.lock` uses `@npm:` resolution keys.

## Tracing the dependency chain

Goal: get from the vulnerable package up to the workspace package(s) under `packages/` that own it.

```bash
# 1. Which versions are installed, and which match the vulnerable range?
grep -n "<pkg>@npm" yarn.lock

# 2. Who depends on that version? Walk up one level at a time.
#    Search for the package as a dependency line, then find the parent stanza.
grep -n "<pkg>" yarn.lock          # find the "<pkg>: <range>" dependency lines
#    For each parent range key (e.g. "@some/parent@npm:^1.2.3"), repeat until
#    you reach a name that appears in a packages/*/package.json.

# 3. Which workspace package declares it (directly or via nearest ancestor)?
grep -rn "<ancestor-or-pkg>" packages/*/package.json packages/*/*/package.json package.json
```

For the owning workspace package, classify it:

```bash
node -e "const p=require('./packages/<path>/package.json'); \
  console.log('name', p.name, '| private', !!p.private); \
  console.log('dep', (p.dependencies||{})['<ancestor>']); \
  console.log('devDep', (p.devDependencies||{})['<ancestor>'])"

# Is the ancestor actually imported at runtime (ships + reachable) or build/test only?
grep -rn "<ancestor>" packages/<path>/src | head
```

Interpretation:
- In `dependencies` of a `private: false` package, imported in `src/` → **ships to consumers and runs**. Highest priority to fix properly (Tier 1b enforces it).
- In `devDependencies` or a `private: true` package → does not ship; a lockfile-only fix (Tier 1a) or even root override is acceptable.
- Purely transitive → the affected package is the nearest ancestor it declares; fix targets that ancestor's range.

## Semver: reachable vs. pinnable

A fixed version can be **reachable** (the highest version resolvable within the currently declared ranges is patched) without being **pinnable** (every version the ranges allow is patched).

Work out both by reading the declared ranges up the chain:

```bash
# What range does the parent declare for the child, across versions?
npm view <parent>@<version> dependencies.<child>

# What does each candidate child version pull in turn?
npm view <child>@<candidateVersion> version dependencies.<grandchild>
```

- **Reachable only** (float): the range spans both vulnerable and patched versions (e.g. `^7.0.0` where `7.0.x` is vulnerable but `7.1.x` is patched). A fresh install lands on the patched high end, but an existing lockfile, a dedupe constraint, or `npm ci` can legitimately resolve the vulnerable low end. Fixing the repo lockfile works; downstream consumers are only *probabilistically* safe.
- **Pinnable** (guaranteed): the lowest version the ranges allow is already patched (e.g. after a bump, the range becomes `^7.1.1` and `7.1.1` is the first version pulling the patched grandchild). Enforced for everyone, including downstream.

Always state which one applies. Prefer moving to a pinnable state when a published package is affected.

## Tier 1a — In-range transitive refresh (lockfile only)

Use when a patched version is **reachable** within the existing declared ranges and introduces no breaking changes. No `package.json` change.

```bash
# Recursively re-resolve every occurrence of the transitive dep to the highest
# version allowed by existing ranges (pulls patched grandchildren in cascade).
yarn up -R <transitive-pkg>

# Or lockfile-only (no linking):
yarn up -R <transitive-pkg> --mode update-lockfile
```

Then verify (see below). This reflects what a fresh downstream install already resolves, so it aligns the repo with real-world resolution — but it does not tighten ranges, so it's a float, not a guarantee.

## Tier 1b — Bump the direct dependency in the affected package

Use when the fix is only **pinnable** by moving the declared range, or when 1a would introduce breaking changes at the transitive level. Edit the affected `packages/*/package.json` dependency to the LOWEST version whose transitive ranges guarantee the patched dependency (found via the semver analysis above), then `yarn install`.

Breaking-change checks BEFORE bumping:

```bash
# Major-version jump? Compare current resolved vs candidate.
npm view <dep> versions --json | tail
# Peer dependency compatibility with what the workspace already uses:
npm view <dep>@<candidate> peerDependencies
# Read the changelog / migration notes for the candidate major:
npm view <dep>@<candidate> homepage repository
```

- Use Context7 MCP (`resolve-library-id` → `query-docs`) for the library's migration guide when crossing a major version.
- Verify the affected package's ACTUAL usage still compiles and behaves: the API it calls, config shape, and output. A bump that typechecks can still change runtime output.
- If a sibling dep must move in lockstep (e.g. a codegen `core` + plugin pair sharing a major), bump them together.
- Prefer the smallest bump that reaches a pinnable-patched state; avoid gratuitous majors.

## Tier 2 — Root resolutions / overrides (LAST RESORT)

Only when no in-package option exists. The repo already uses this pattern for some security bumps (`resolutions` in the root `package.json`).

```jsonc
// root package.json
"resolutions": {
  "<pkg>": "^<patched>",              // force everywhere
  "<parent>/<pkg>": "^<patched>"       // or scope to one parent
}
```

Critical caveats to always state:
- **Does not ship.** `resolutions`/`overrides` are honored only at THIS repo's install root. They are not part of a published package's metadata, so a downstream `npm install @medusajs/<pkg>` re-resolves the transitive freshly and can get the vulnerable version again.
- Therefore this fixes only the repo's own alert, not consumers. If the vulnerable dep reaches a published package, note that Tier 2 is incomplete and the real fix is Tier 1b (or an upstream release).
- Forcing a version outside a parent's declared range (e.g. `~3.7.6`) works mechanically but can break that parent — confirm API compatibility.

## Verification

```bash
git diff --stat                                  # only yarn.lock (+ package.json if 1b)
grep -n "<pkg>@npm" yarn.lock                     # confirm no version in the vulnerable range remains
git diff yarn.lock | grep -E '^[-+]"' | \
  grep -oE '"[^"]+@npm:' | sort -u                # confirm churn is scoped to the dep neighborhood
```

If a direct dep was bumped (1b): build/typecheck the affected package and exercise the code path that uses the dependency.

## Doing it in a worktree + PR

When asked to open a PR, isolate the work:

```bash
git worktree add -b fix/<slug> <scratchpad>/wt-<slug> develop
# ...run the refresh/bump inside the worktree, verify, commit...
git worktree remove <scratchpad>/wt-<slug>       # branch persists after removal
```

Commit as `chore(deps): ...` referencing the GHSA id and alert number. For a lockfile-only refresh, note that no changeset is needed (no published `package.json`/source change).
