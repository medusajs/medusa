/**
 * Guards the CJS build of @medusajs/admin-bundler against esbuild rewriting
 * `await import("<pkg>")` into `require("<pkg>")`.
 *
 * This package is published as CommonJS (tsup `format: ["cjs"]`), but some of
 * its dependencies are ESM-only and can therefore only be loaded through a
 * genuine dynamic `import()`:
 *
 *   - `vite` dropped its CJS Node API in v6
 *   - `@vitejs/plugin-react` dropped its `require` export condition in v5
 *
 * If esbuild downlevels those dynamic imports, the bundle still typechecks and
 * still builds — it only fails at runtime, with `ERR_REQUIRE_ESM`, for every
 * `medusa develop` / `medusa build` / `medusa plugin:build` invocation. This
 * check turns that silent, ship-able failure into a build error.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ESM_ONLY_DEPENDENCIES = ["vite", "@vitejs/plugin-react"]

const bundlePath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../dist/index.js"
)

let bundle
try {
  bundle = readFileSync(bundlePath, "utf-8")
} catch {
  console.error(
    `[assert-esm-imports] Could not read ${bundlePath}. Run the build first.`
  )
  process.exit(1)
}

/** Matches `require("pkg")` / `require('pkg')`, tolerating inner whitespace. */
const requireCall = (pkg) =>
  new RegExp(`require\\(\\s*["']${escape(pkg)}["']\\s*\\)`)

/** Matches `import("pkg")` / `import('pkg')`, tolerating inner whitespace. */
const importCall = (pkg) =>
  new RegExp(`import\\(\\s*["']${escape(pkg)}["']\\s*\\)`)

function escape(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

const failures = []

for (const dependency of ESM_ONLY_DEPENDENCIES) {
  if (requireCall(dependency).test(bundle)) {
    failures.push(
      `  - \`${dependency}\` is loaded with require(). It is ESM-only, so this ` +
        `throws ERR_REQUIRE_ESM at runtime.`
    )
    continue
  }

  if (!importCall(dependency).test(bundle)) {
    failures.push(
      `  - \`${dependency}\` is not loaded with a dynamic import(). Either the ` +
        `import was removed, or esbuild rewrote it into a form this check ` +
        `does not recognise.`
    )
  }
}

if (failures.length) {
  console.error(
    [
      `[assert-esm-imports] ${bundlePath} does not load its ESM-only dependencies correctly:`,
      ...failures,
      "",
      "Fix by keeping these as `await import(...)` in src/ and ensuring tsup does",
      "not downlevel them (see `target` in tsup.config.cjs). If esbuild insists on",
      "rewriting them, route the imports through a helper esbuild cannot analyse:",
      '  const importESM = (s) => (new Function("s", "return import(s)"))(s)',
      "",
      "Do NOT convert this package to ESM — @medusajs/framework requires it from CJS.",
    ].join("\n")
  )
  process.exit(1)
}

console.log(
  `[assert-esm-imports] OK — ${ESM_ONLY_DEPENDENCIES.join(
    ", "
  )} are loaded via dynamic import().`
)
