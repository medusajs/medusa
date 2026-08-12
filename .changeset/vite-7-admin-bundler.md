---
"@medusajs/admin-bundler": minor
---

feat(admin-bundler): upgrade to vite 7

Upgrades the admin build toolchain to Vite 7.3.6, `@vitejs/plugin-react` 5, and esbuild 0.27.

**Breaking:** the admin dashboard's supported browsers narrow to **Chrome ≥107, Edge ≥107, Firefox ≥104 and Safari ≥16** (previously 87 / 88 / 78 / 14). Vite 7 changed the default `build.target` from `modules` to `baseline-widely-available`; the bundler now pins that value explicitly so future Vite majors cannot move it silently. Override it via `admin.vite` → `build.target` if you need the old floor.

**Breaking:** the `admin.vite(config)` hook now receives a Vite 7 `InlineConfig`. `build.target: 'modules'` is no longer valid, `splitVendorChunkPlugin` has been removed, and `resolve.conditions` defaults have changed. If you install `vite` directly for typing, upgrade it to 7.x.
