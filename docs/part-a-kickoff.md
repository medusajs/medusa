# Part A Kickoff — zjedene-medusa fork setup

Execution brief for turning this fork into publishable `@zjedene-medusa/*` packages. Follow `docs/fork-adoption-playbook.md` (Part A) — this file pins the project-specific decisions so nothing needs re-deciding.

## Decisions (already made — do not revisit)

| Decision | Value |
|---|---|
| npm scope | `@zjedene-medusa` (npm org must exist on npmjs.com before first publish) |
| Versioning | **Upstream-aligned: keep 2.15.4** — no 1.0.0 reset (playbook A3) |
| Consumer | `/Users/leminhchi/Documents/Zjedene/eshop-Zjedene/apps/medusa` (pnpm monorepo, currently `@medusajs/*@2.13.1`, only 5 medusa deps, zero third-party Medusa plugins) |
| Reference implementation | `/Users/leminhchi/Documents/Freshbox/medusa-freshbox` — working fork publishing `@freshbox-medusa/*` |

## Tasks

### 1. Scope rename (playbook A2)

Replace `@medusajs` → `@zjedene-medusa` in:

1. All `package.json` files (~94), excluding `node_modules/`:
   ```bash
   find . -name "package.json" -not -path "*/node_modules/*" \
     -exec sed -i '' 's/@medusajs/@zjedene-medusa/g' {} +
   ```
2. All source imports (~3,300+ TS/TSX/JS), excluding `node_modules/` and `dist/`:
   ```bash
   find packages -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" \) \
     -not -path "*/node_modules/*" -not -path "*/dist/*" \
     -exec sed -i '' 's/@medusajs/@zjedene-medusa/g' {} +
   ```
3. `.changeset/config.json` fixed group + any scripts referencing the scope.

Versions stay at `2.15.4` everywhere — verify no cross-dep rewriting is needed (upstream already consistent; this is the point of upstream-aligned).

### 2. Port release tooling

Copy from `/Users/leminhchi/Documents/Freshbox/medusa-freshbox/scripts/`:

- `release-core-packages.js` — includes `validateCrossDependencies()` (pre-publish `npm view` check on every `@scope/*` cross-dep; halts on phantom versions). Adapt scope to `@zjedene-medusa`.
- `release-workflow.js` — core-flows-only release.

Known fix already baked into the Freshbox versions — keep it: cross-dep updates must cover non-core packages too (ui, js-sdk, admin-sdk, types, test-utils), not just CORE_PACKAGES.

### 3. Build verification (playbook A4)

Real build order: `types → utils → orchestration / modules-sdk / workflows-sdk → cli → framework → everything else`.

- framework imports `@zjedene-medusa/cli/dist/reporter` — cli builds before framework
- `MedusaContainer` type errors after rename = stale dist → force-rebuild in dependency order
- `yarn install` then `yarn build` (Yarn 3.x + turbo)

### 4. Publish at 2.15.4

- `--access public` (scoped packages)
- npm token in `~/.npmrc` or CI secret — NEVER committed (GitHub push protection burned us before)
- Verify each package on registry after publish (`npm view @zjedene-medusa/medusa versions`)
- Commit version state after release — scripts don't auto-commit

### 5. Checklist (from playbook A6)

- [ ] Scope renamed in package.json files, source imports, changeset config, release scripts
- [ ] Versions kept at 2.15.4, cross-deps verified consistent
- [ ] Full build passes in dependency order
- [ ] Release script has `validateCrossDependencies()`
- [ ] npm org `@zjedene-medusa` exists; token NOT in repo
- [ ] All packages published + registry-verified at 2.15.4
- [ ] Version state committed

## After Part A → Part B (separate session in eshop-Zjedene)

Swap `apps/medusa` deps (`admin-sdk`, `cli`, `framework`, `medusa`, `test-utils`) from `@medusajs/*@2.13.1` → `@zjedene-medusa/*@2.15.4` **pinned exact**, rename `@medusajs/*` imports in `apps/medusa/src`, regenerate pnpm lockfile. No plugin forking needed (zero third-party Medusa plugins). Watch upstream 2.13 → 2.15 breaking changes (MFA features landed in between; check Medusa release notes).

## Gotcha quick-reference

See playbook "Gotcha registry" table — covers phantom versions, cli/framework build order, 403 on republish, secret scanning, peer-dep drift.
