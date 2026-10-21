// A jest resolver for running suites against a bundled build (see
// `getTestBundleDirectory`): `@medusajs/*` imports resolve to shims returning
// the bundle's module, so tests and the app share one copy of each package.
// The test utils themselves keep loading from source, as they use jest.
import { createHash } from "crypto"
import { existsSync, mkdirSync, writeFileSync } from "fs"
import os from "os"
import path from "path"
import { getTestBundleDirectory, getTestBundleMain } from "./bundle"

const UNBUNDLED = /^@medusajs\/test-utils(\/|$)/
// Bump when the shims' contents change (they're cached on disk)
const SHIM_VERSION = 2

function shimFor(bundleMain: string, request: string): string {
  const dir = path.join(
    os.tmpdir(),
    "medusa-test-bundle-shims",
    createHash("sha1")
      .update(`${SHIM_VERSION}:${bundleMain}`)
      .digest("hex")
      .slice(0, 12)
  )
  const file = path.join(dir, `${request.replace(/[^\w.-]+/g, "_")}.js`)
  if (!existsSync(file)) {
    mkdirSync(dir, { recursive: true })
    writeFileSync(
      file,
      `const bundle = globalThis.__MEDUSA_NATIVE_REQUIRE__(${JSON.stringify(
        bundleMain
      )});
module.exports = bundle.require(${JSON.stringify(request)});
// Globals the bundle defined (e.g. \`PolicyOperation\`), as loading the
// package unbundled would have
const outer = globalThis.__MEDUSA_OUTER_GLOBAL__;
for (const key of Object.getOwnPropertyNames(outer)) {
  if (!(key in globalThis)) globalThis[key] = outer[key];
}
`
    )
  }
  return file
}

module.exports = (request: string, options: any) => {
  const directory = getTestBundleDirectory()
  if (
    directory &&
    request.startsWith("@medusajs/") &&
    !UNBUNDLED.test(request)
  ) {
    return shimFor(getTestBundleMain(directory), request)
  }
  return options.defaultResolver(request, options)
}
