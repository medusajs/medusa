# Medusa Fork Adoption Playbook

End-to-end process for (A) turning a fork of Medusa v2 into a customizable package suite published to npm under a custom scope, and (B) migrating a downstream admin/backend app from original `@medusajs/*` packages onto the fork.

Distilled from the real migration of these two repos (Apr 2026):

- **Fork (core)**: `/Users/leminhchi/Documents/Freshbox/medusa-freshbox` → published as `@freshbox-medusa/*`
- **Consumer (admin)**: `/Users/leminhchi/Documents/Freshbox/fbx-b2b-admin` → migrated from `@medusajs/*` to `@freshbox-medusa/*`
- **Reference fork that got it right first**: `@8medusa` suite, consumed by `/Users/leminhchi/Documents/Lyra` (eshop-admin) — zero workarounds needed

Use this when forking Medusa again for a new project, or when pointing another admin (currently on original `@medusajs`) at a custom fork.

---

## Part A — Fork → publishable custom Medusa

### A1. Starting state

A fresh fork of `medusajs/medusa` is a clean v2.x monorepo:

- Yarn 3.x workspaces (node-modules linker) + Turborepo + Changesets
- ~94 `package.json` files, ~3,340 source files referencing `@medusajs/*`
- 30+ commerce modules, core packages with a strict dependency chain

### A2. Scope rename (one-time, all-or-nothing)

Replace `@medusajs` with your scope (e.g. `@freshbox-medusa`) in **three places**. Partial rename = broken builds.

```bash
# 1. All package.json files (~94 files: names, deps, devDeps, peerDeps)
find . -name "package.json" -not -path "*/node_modules/*" \
  -exec sed -i '' 's/@medusajs/@YOUR-SCOPE/g' {} +

# 2. All source imports (~3,340 TS/TSX/JS files)
find packages -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" \) \
  -not -path "*/node_modules/*" -not -path "*/dist/*" \
  -exec sed -i '' 's/@medusajs/@YOUR-SCOPE/g' {} +

# 3. .changeset/config.json (the "fixed" versioning group) + scripts/*.js
```

Exclude `node_modules/` and `dist/` — stale dist with old scope causes phantom type errors later.

### A3. Versioning strategy (the most important decision)

**Recommendation: keep upstream-aligned version numbers.** Fork from Medusa 2.15.5 → publish `@YOUR-SCOPE/*@2.15.5`. Do NOT reset to 1.0.0.

This was tested empirically across two forks:

| Fork | Versioning | Result |
|---|---|---|
| `@freshbox-medusa` | own 1.0.x line | Required rewriting every internal cross-dep; missed ones became phantom versions (`ui@4.1.5`) that broke DigitalOcean builds; forced a workaround era (resolutions + postinstall symlinks) and a multi-day repair cycle (design spec, validation script, republish at 1.0.5) |
| `@8medusa` (consumed by `/Users/leminhchi/Documents/Lyra`) | upstream-aligned 2.7.0–2.11.1 | Zero workarounds, clean installs everywhere |

Why upstream-aligned wins:

1. **Cross-deps already correct.** The ~94 package.json files reference each other at the upstream version. Keeping it means near-zero rewriting; resetting means every internal ref must be rewritten and one miss breaks all registry-only CI installs.
2. **Peer dependency ranges keep working.** Fork packages and third-party plugins declare peerDeps like `@medusajs/framework: ^2.15.0`. A 1.0.0 fork fails those semver checks the moment anything aliases it into the `@medusajs` namespace; an upstream-aligned fork satisfies them for free.
3. **Provenance.** `2.15.5` tells every consumer which upstream the fork tracks; `1.0.5` tells nobody. Upstream merges later map obviously (merge 2.16 → publish 2.16.x).

The decision to prefer upstream alignment was formally recorded on 2026-04-09 (fbx-b2b-admin project memory, `project_fork_versioning.md`). `@freshbox-medusa` stayed on 1.0.x only because versions were already published — npm immutability made switching costlier than adding validation.

Practical rules for upstream-aligned:

- Own fixes between upstream releases: bump patch above upstream (`2.15.5` → `2.15.6`) and **pin exact versions in consumer apps** (no `^` ranges) so a future upstream 2.15.6 can never be confused with yours. Different scope means no registry collision regardless.
- Avoid pre-release suffixes (`2.15.5-fbx.1`): semver sorts pre-releases *below* the release, and `^2.15.5` ranges won't match them.
- After merging upstream: republish at the new upstream number.

Whichever strategy, the iron rule: **every `@YOUR-SCOPE/*` version referenced anywhere in any package.json must actually exist on the npm registry at publish time.** Phantom versions (e.g. `ui@4.1.5` inherited from upstream while only `1.0.3` was published) were the single biggest source of downstream breakage — they fail builds on CI platforms (DigitalOcean) that install from registry without workspace context.

### A4. Build order (deeper than the docs say)

The documented chain is `utils → orchestration → modules-sdk → workflows-sdk → framework → cli → medusa`. The real chain discovered by building from scratch:

```
types → utils → orchestration / modules-sdk / workflows-sdk → cli → framework → everything else
```

Non-obvious edge: **framework imports `@YOUR-SCOPE/cli/dist/reporter`** (`src/http/middlewares/bodyparser.ts`, `src/logger/index.ts`), so cli must be *built* before framework compiles — even though release order lists cli after framework.

Other build gotchas hit:

- `MedusaContainer` type incompatibility after the version reset — two type definitions (types pkg vs framework pkg) plus stale dist; force-rebuild in dependency order fixes it.
- `awilix` re-export chain (`locking-redis → framework/awilix → deps/awilix → awilix`) can break if the installed awilix version drops an export (e.g. `asValue`). The re-export layers are fine; check the installed library version.

### A5. Publish

Scripts in this repo (`/Users/leminhchi/Documents/Freshbox/medusa-freshbox/scripts/`):

- `release-core-packages.js <version>` — 7-package core chain: bump, build, publish, registry-verify with retry
- `release-workflow.js <version>` — core-flows-only release (2 packages)
- `publish-all.sh`, `publish-new-packages.js`, `publish-providers.js` — broader sweeps

Hard-won rules baked into the current scripts:

1. **Pre-publish cross-dependency validation** (`validateCrossDependencies()` in `release-core-packages.js`, commit `b353d2e15a`): scans all `@YOUR-SCOPE/*` deps in packages about to be published and runs `npm view` to verify each referenced version exists. Halts release on stale references. **Port this to any new fork's release script — it prevents the entire Part B workaround mess.**
2. The release script must update cross-deps in **non-core** packages too (ui, js-sdk, admin-sdk, types, test-utils). The original script only rewrote CORE_PACKAGES references — root cause of the `ui@4.1.5` phantom.
3. Pre-check target version isn't already published — npm returns 403 on republish, and a retry loop just burns three attempts then dies mid-release.
4. Publish with `--access public` for scoped packages.
5. Scripts do NOT auto-commit — commit the version-bumped package.json files after a successful release.
6. Never commit the npm token: `.npmrc` with a token tripped GitHub push protection and required a history scrub. Keep tokens in `~/.npmrc` or CI secrets.
7. npm publish may run git hooks needing SSH auth to GitHub — make sure the publishing machine has a working key.

### A6. Publish checklist (new fork)

- [ ] Scope renamed in package.json files, source imports, changeset config, release scripts
- [ ] Upstream-aligned versioning kept (no 1.0.0 reset — see A3) and ALL cross-deps consistent
- [ ] Full build passes in dependency order (`types → utils → … → framework → medusa`)
- [ ] Release script has cross-dependency validation (npm view per referenced version)
- [ ] Release script covers non-core packages' cross-deps
- [ ] npm token NOT in repo; SSH auth to GitHub working
- [ ] After publish: registry-verify each package, then commit version bumps

---

## Part B — Migrating a downstream admin from original `@medusajs` to the fork

This is the path for an admin currently on stock Medusa. Done right (fork versions consistent + published), it is a clean dependency swap. Done wrong, you end up in the workaround era described below — documented so you recognize and avoid it.

### B1. The clean path (do this)

1. **Verify every target version exists** before touching package.json:
   ```bash
   npm view @YOUR-SCOPE/medusa versions
   ```
2. **Swap direct dependencies** in package.json: `@medusajs/x` → `@YOUR-SCOPE/x` at published versions. Direct deps must reference real registry versions — yarn validates them *before* applying any resolutions, so resolutions cannot paper over a phantom direct dep.
3. **Inventory third-party Medusa plugins** (anything importing `@medusajs/*` internally, e.g. `@perseidesjs/notification-nodemailer`). These break unconditionally after the swap — they hardcode `@medusajs/*` imports that no longer resolve. For each one, either:
   - **Fork it in-repo as a custom module** (the chosen fix: `fbx-b2b-admin/src/modules/notification-nodemailer/` replaced the npm package entirely), or
   - keep temporary aliasing for just that plugin (see B2) until you can replace it.
4. **Fresh lockfile**: delete `yarn.lock`, `yarn install`. Stale lockfiles carry phantom resolved URLs from the old scope/versions.
5. **Expect peer-dep warnings**, not errors: fork modules may peer-depend on an older framework (e.g. `framework@1.0.3` peer while `1.0.5` installed). Cosmetic; fix peer ranges at the next core release.
6. **Verify on the deploy platform** (DigitalOcean App Platform etc.) — it installs from registry only, no workspace context, and may skip lifecycle scripts. This is where phantom versions and script-dependent hacks die.

### B2. The workaround era (recognize it; avoid it)

When fork versions were inconsistent, keeping the admin alive required a two-layer aliasing hack:

1. **package.json resolutions** — install-time aliasing for transitive deps:
   ```json
   "resolutions": { "@medusajs/framework": "npm:@freshbox-medusa/framework@1.0.3" }
   ```
2. **scripts/postinstall.js** — filesystem symlinks `node_modules/@medusajs/* → @freshbox-medusa/*` so third-party plugins' hardcoded runtime imports resolve (covered 8 packages: framework, utils, medusa, workflows-sdk, types, modules-sdk, js-sdk, admin-sdk).

Why this is a trap:

- Resolutions only affect transitive deps; direct deps still must exist on the registry.
- Postinstall scripts may be skipped on CI/PaaS → needed platform-specific config on DigitalOcean.
- Both layers mask the real problem (inconsistent fork versions) and rot silently.

The `@8medusa`/Lyra reference proved the alternative: consistent published versions ⇒ no resolutions, no symlinks, no platform config. The fix was made at the source (fork cross-deps + validation, then republish at 1.0.5) and **all aliasing was removed** — current `fbx-b2b-admin/package.json` resolutions pin only MikroORM (`6.4.16`, to stop version drift), nothing scope-related.

### B3. Migration checklist (admin on stock Medusa → fork)

- [ ] Fork passes Part A checklist (especially cross-dep validation) — do NOT start otherwise
- [ ] All target versions confirmed on registry (`npm view`)
- [ ] Direct deps swapped `@medusajs/*` → `@YOUR-SCOPE/*`
- [ ] Third-party Medusa plugins inventoried; each forked in-repo or consciously aliased (temporary)
- [ ] No scope-aliasing resolutions, no postinstall symlinks (MikroORM-style pins are fine)
- [ ] `yarn.lock` regenerated from scratch
- [ ] Local build + server start clean
- [ ] Deploy-platform build green (registry-only install)

---

## Gotcha registry (fastest lookup)

| Symptom | Cause | Fix |
|---|---|---|
| `Couldn't find any versions for '@scope/x' that matches 'Y'` on CI | Phantom version: referenced but never published | Fix cross-dep at source, republish; regenerate lockfile |
| `Cannot find module '@medusajs/framework/utils'` at build/start | Third-party plugin hardcodes `@medusajs/*` | Fork plugin in-repo as custom module |
| Resolutions added but install still fails | Resolutions don't apply to direct deps | Correct the direct dep version itself |
| `TS2307: Cannot find module '@scope/cli/dist/reporter'` building framework | cli not built yet | Build cli before framework |
| `MedusaContainer` type mismatch after version change | Stale dist + dual type defs | Force-rebuild in dependency order |
| `npm publish` 403 | Version already published (immutable) | Bump version; add pre-publish existence check |
| GitHub push rejected (secret scanning) | npm token in committed `.npmrc` | Remove from history; token in `~/.npmrc`/CI secrets |
| Peer warnings `expects framework@<old>` | Fork-internal peer ranges lag | Bump peer ranges at next release; non-blocking meanwhile |
| Works locally, dies on DigitalOcean | Workspace context / lifecycle scripts absent on PaaS | Eliminate script-dependent hacks; registry-consistent versions |

## Source artifacts

- Publishing guide: `/Users/leminhchi/Documents/Freshbox/medusa-freshbox/docs/publishing-guide.md`
- Release scripts: `/Users/leminhchi/Documents/Freshbox/medusa-freshbox/scripts/release-core-packages.js` (incl. `validateCrossDependencies()`), `release-workflow.js`, `publish-all.sh`
- Versioning fix design spec: `/Users/leminhchi/Documents/Freshbox/fbx-b2b-admin/docs/superpowers/specs/2026-04-09-fix-fork-versioning-design.md`
- Versioning fix plan: `/Users/leminhchi/Documents/Freshbox/fbx-b2b-admin/docs/superpowers/plans/2026-04-09-fix-fork-versioning.md`
- Key commits (this repo): `8949bc89f1` (cross-dep fixes), `b353d2e15a` (pre-publish validation), `6b1eb56f7a` (upstream core upgrade)
- In-repo plugin fork example: `/Users/leminhchi/Documents/Freshbox/fbx-b2b-admin/src/modules/notification-nodemailer/`
- Reference done-right fork consumer: `/Users/leminhchi/Documents/Lyra` (`@8medusa` packages, upstream-aligned versions, zero workarounds)
