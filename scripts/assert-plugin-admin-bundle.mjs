/**
 * Asserts that a plugin's admin extension bundle — produced by `medusa
 * plugin:build`, i.e. @medusajs/admin-bundler's Vite `build.lib` path — is
 * shaped correctly.
 *
 * `build:plugin` already runs in CI as part of the root `yarn build`, but a
 * zero exit code only proves Vite did not throw. It does not prove that both
 * output formats were emitted, that externals were left external instead of
 * being inlined, or that the CJS output is actually loadable — which is what
 * `build.rollupOptions.output.interop` governs. Those are the parts most
 * likely to break on a Vite major upgrade.
 *
 * Usage: node ./scripts/assert-plugin-admin-bundle.mjs <plugin-dir>
 */
import { existsSync, readFileSync, statSync } from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"

const require = createRequire(import.meta.url)

const pluginDir = process.argv[2]

if (!pluginDir) {
  console.error(
    "Usage: node ./scripts/assert-plugin-admin-bundle.mjs <plugin-dir>"
  )
  process.exit(1)
}

const adminDir = path.resolve(pluginDir, ".medusa/server/src/admin")

/** `build.lib` emits the ESM output as .mjs and the CJS output as .js here. */
const ESM_OUTPUT = path.join(adminDir, "index.mjs")
const CJS_OUTPUT = path.join(adminDir, "index.js")

/**
 * A representative slice of admin-bundler's hardcoded `external` set. These
 * must stay external: bundling them would give the plugin its own copy of
 * React / the router and break hooks at runtime.
 */
const MUST_BE_EXTERNAL = [
  "react",
  "react/jsx-runtime",
  "react-router-dom",
  "@tanstack/react-query",
  "@medusajs/ui",
  "@medusajs/js-sdk",
]

/** The module kinds admin-vite-plugin's generated plugin entry must export. */
const EXPECTED_MODULES = [
  "widgetModule",
  "routeModule",
  "menuItemModule",
  "formModule",
  "displayModule",
  "i18nModule",
  "cellRendererModule",
  "layoutModule",
]

/**
 * Vite `define` globals that the dashboard's prebuilt chunks reference at
 * module scope. They only exist once Vite has bundled the admin app, so they
 * must be stubbed to require the plugin bundle outside that context.
 */
const DEFINE_GLOBALS = {
  __BASE__: "/",
  __BACKEND_URL__: "/",
  __STOREFRONT_URL__: "/",
  __AUTH_TYPE__: "session",
  __JWT_TOKEN_STORAGE_KEY__: "medusa_auth_token",
  __MAX_UPLOAD_FILE_SIZE__: 1024 * 1024,
}

const failures = []

function assertOutput(label, file) {
  if (!existsSync(file)) {
    failures.push(`${label} output missing: ${file}`)
    return null
  }

  const { size } = statSync(file)
  if (size < 1024) {
    failures.push(
      `${label} output is suspiciously small (${size} bytes): ${file}`
    )
    return null
  }

  return readFileSync(file, "utf-8")
}

const esm = assertOutput("ESM", ESM_OUTPUT)
const cjs = assertOutput("CJS", CJS_OUTPUT)

// Externals must survive as bare specifiers rather than being inlined.
if (esm) {
  for (const dependency of MUST_BE_EXTERNAL) {
    if (!new RegExp(`from\\s*["']${escape(dependency)}["']`).test(esm)) {
      failures.push(
        `ESM output does not import "${dependency}" as an external — it was ` +
          `likely inlined, which duplicates it inside the plugin bundle.`
      )
    }
  }
}

if (cjs) {
  for (const dependency of MUST_BE_EXTERNAL) {
    if (
      !new RegExp(`require\\(\\s*["']${escape(dependency)}["']\\s*\\)`).test(
        cjs
      )
    ) {
      failures.push(
        `CJS output does not require "${dependency}" as an external — it was ` +
          `likely inlined, which duplicates it inside the plugin bundle.`
      )
    }
  }
}

// admin-vite-plugin writes this entry in `buildStart` and removes it in
// `buildEnd`. A leftover means `buildEnd` never fired.
const generatedEntry = path.resolve(
  pluginDir,
  "src/admin/__admin-extensions__.js"
)
if (existsSync(generatedEntry)) {
  failures.push(
    `Generated entry survived the build: ${generatedEntry}. ` +
      `admin-vite-plugin's buildEnd hook did not run.`
  )
}

// Load the CJS output to prove the emitted interop is usable.
if (cjs) {
  Object.assign(globalThis, DEFINE_GLOBALS)

  try {
    const required = require(CJS_OUTPUT)
    const plugin = required?.default ?? required

    const missing = EXPECTED_MODULES.filter((key) => !(key in plugin))
    if (missing.length) {
      failures.push(
        `CJS output loaded but is missing expected exports: ${missing.join(
          ", "
        )}`
      )
    }
  } catch (error) {
    failures.push(
      `CJS output could not be required (this is what output.interop governs): ${error.message}`
    )
  }
}

function escape(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

if (failures.length) {
  console.error(
    [
      `[assert-plugin-admin-bundle] ${pluginDir} admin bundle is malformed:`,
      ...failures.map((failure) => `  - ${failure}`),
    ].join("\n")
  )
  process.exit(1)
}

console.log(
  `[assert-plugin-admin-bundle] OK — ${pluginDir} emitted loadable ESM + CJS ` +
    `admin bundles with externals preserved.`
)
