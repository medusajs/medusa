/**
 * ESM-only packages loaded by Medusa at runtime. Jest can't `require()` them,
 * so the preset lets the project's transformer compile them to CommonJS.
 */
export const ESM_ONLY_DEPENDENCIES: string[] = [
  "path-to-regexp",
  "scrypt-kdf"
]

const PNP_PATTERN = "\\.pnp\\.[^\\/]+$"

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

/**
 * Builds Jest's `transformIgnorePatterns` so files under `node_modules` are
 * left untransformed, except for the given packages.
 *
 * @param packages - The names of the packages to transform.
 */
export function buildTransformIgnorePatterns(packages: string[]): string[] {
  if (!packages.length) {
    return ["/node_modules/", PNP_PATTERN]
  }

  const allowed = packages.map(escapeRegExp).join("|")

  return [
    // Only the last `node_modules` segment decides, so nested installs like
    // `@medusajs/framework/node_modules/<package>` are transformed too.
    `/node_modules/(?!.*/node_modules/)(?!(?:${allowed})/)`,
    PNP_PATTERN,
  ]
}

/**
 * The Jest preset for Medusa applications and plugins, used with
 * `preset: "@medusajs/test-utils"` in `jest.config.js`.
 */
export const jestPreset = {
  testEnvironment: "node",
  transformIgnorePatterns: buildTransformIgnorePatterns(ESM_ONLY_DEPENDENCIES),
}
