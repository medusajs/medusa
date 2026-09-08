---
name: diagnosing-dependabot-alerts
description: Diagnoses GitHub Dependabot / security alerts in the Medusa monorepo and finds the least-invasive fix. Use when investigating a Dependabot alert, security advisory (GHSA/CVE), vulnerable dependency, "npm audit" finding, or a security update PR. Traces the vulnerable package to the exact affected workspace package(s) under packages/, assesses real impact, and prefers a fix scoped to the affected package over a root package.json / yarn.lock resolutions override (which is a last resort).
---

# Diagnosing Dependabot Alerts

Investigate a Dependabot/security alert in the Medusa monorepo, identify the exact affected package(s), assess real-world impact, and pick the least-invasive fix. Default output is a diagnosis; only make changes when asked.

## Constraints

- **Diagnose first, don't default to a fix:** Never jump to a root `resolutions`/`overrides` bump. Root-level overrides are the LAST resort — see the remediation ladder.
- **Root overrides don't ship:** `resolutions` (yarn) / `overrides` (npm) apply only to THIS repo's install. They are NOT published with `packages/*`, so they do not protect downstream consumers of a published package. Never present them as a full fix for a vulnerability that reaches a published package.
- **Find the fix inside the affected package first:** Prefer refreshing/bumping the dependency within the workspace package that owns it (transitive refresh or direct-dep bump) before touching anything at the monorepo root.
- **Reachable is not pinnable:** A fixed version being resolvable within existing semver ranges (a lockfile float) is weaker than a range that GUARANTEES the fix. Call out the difference — the float can regress for downstream consumers.
- **Assess impact, don't assume:** Determine whether the vulnerable code path is actually reachable with untrusted input in Medusa before recommending urgency.

## Workflow

Follow these steps in order. Load `reference/remediation-strategies.md` before proposing any fix.

```
1. Fetch alert details        → gh api (package, versions, scope)
2. Trace to affected package  → walk yarn.lock up to packages/*
3. Assess real impact         → is the vulnerable path reachable?
4. Choose remediation         → remediation ladder (least-invasive first)
5. Verify (only if changing)  → scoped diff, no vulnerable version remains
```

### 1. Fetch alert details

The alert number is the last path segment of the URL (`.../dependabot/<N>`).

```bash
gh api repos/medusajs/medusa/dependabot/alerts/<N> | jq '{
  state, package: .dependency.package.name, scope: .dependency.scope,
  relationship: .dependency.relationship, manifest: .dependency.manifest_path,
  ghsa: .security_advisory.ghsa_id, severity: .security_advisory.severity,
  summary: .security_advisory.summary,
  matched_range: .security_vulnerability.vulnerable_version_range,
  first_patched: .security_vulnerability.first_patched_version.identifier,
  all_ranges: [.security_advisory.vulnerabilities[] | {range: .vulnerable_version_range, patched: .first_patched_version.identifier}]
}'
```

Record: the vulnerable package name, every `{vulnerable range → first patched}` pair, and whether the alert is `direct` or `transitive`.

### 2. Trace to the exact affected Medusa package(s)

Find which version(s) are actually installed and walk up the dependency chain to the workspace package(s) under `packages/` that own the dependency. See `reference/remediation-strategies.md` for the full tracing recipe. In short:

1. `grep -n "<pkg>@npm" yarn.lock` — list installed versions; confirm which match the vulnerable range.
2. Walk up dependents (grep the version string as a dependency of other lock entries) until you reach a package declared in a `packages/*/package.json`.
3. For that workspace package, determine:
   - **Direct vs transitive** — is `<pkg>` (or the nearest ancestor) in its `dependencies`/`devDependencies`, or purely transitive?
   - **Ships or not** — `private: false` means it publishes; a runtime `dependencies` entry ships to consumers. `devDependencies` and `private: true` do not.
   - **Runtime-reachable** — is the ancestor actually imported in `src/` (runtime), or only used at build/test time?

The "affected package" is the workspace package whose manifest declares the dependency (or the nearest ancestor that does).

### 3. Assess real impact

Before recommending urgency, check whether the vulnerable code path is reachable with untrusted input in Medusa. Example from a past alert: `immutable` prototype pollution reached us only through `@graphql-codegen/typescript`, used to generate types from Medusa's OWN internal GraphQL schema — no untrusted input, so practical exploitability was negligible. State the impact explicitly; it changes how aggressive the fix needs to be.

### 4. Choose remediation (least-invasive first)

**Load `reference/remediation-strategies.md` now.** Apply the ladder in order and stop at the first tier that works without breaking changes:

| Tier | Fix | Scope | Ships to consumers? |
|------|-----|-------|---------------------|
| 1a | In-range transitive refresh (lockfile only) | affected pkg's tree | reflects fresh installs |
| 1b | Bump the direct dep the affected pkg declares | affected pkg's `package.json` | yes (enforced) |
| 2 | Root `resolutions`/`overrides` | this repo only | **NO** — last resort |

- Prefer **1a** when a fixed version is reachable within existing ranges and introduces no breaking changes (fastest, no manifest change).
- Use **1b** when the fix is only *guaranteed* by bumping the declared dep — check breaking changes (major bump, peerDeps, changed API usage) per the reference file.
- Use **2** only when no in-package option exists; always state that it does not protect downstream consumers of published packages.

### 5. Verify (only when making changes)

- `git diff --stat` — confirm the change is scoped (only `yarn.lock`, plus `package.json` if you bumped a direct dep).
- Confirm NO version matching the vulnerable range remains in `yarn.lock`.
- Confirm the diff touches only the vulnerable package's dependency neighborhood — no unrelated churn.
- If a direct dep was bumped: build/typecheck the affected package and exercise its use of the dependency.

## Reference Files Available

```
reference/remediation-strategies.md  - Tracing recipe, semver reachable-vs-pinnable
                                        analysis, per-tier commands, breaking-change checks
```

## Common Mistakes Checklist

Verify you're NOT doing these:

- [ ] Adding a root `resolutions`/`overrides` entry as the first (or only) fix
- [ ] Presenting a root override as protecting downstream consumers of a published package
- [ ] Treating a lockfile float ("reachable") as a guaranteed fix ("pinnable")
- [ ] Skipping the trace and not naming the exact affected `packages/*` package(s)
- [ ] Recommending a major-version bump without checking breaking changes / peerDeps / actual usage
- [ ] Reporting urgency without checking whether the vulnerable path is reachable in Medusa
- [ ] Making changes when only a diagnosis was requested
