import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs"],
  dts: true,
  clean: true,
  /**
   * Pinned so esbuild deterministically preserves the `await import()` calls
   * that load `vite` and `@vitejs/plugin-react`. Both are ESM-only, so if
   * esbuild downlevels those to `require()` the bundle still builds and
   * typechecks, then throws ERR_REQUIRE_ESM at runtime. Enforced by
   * `scripts/assert-esm-imports.mjs`, which runs as part of this package's build.
   */
  target: "node20",
})
