import path from "path"

/**
 * Running integration suites against a bundled build (`medusa build
 * --bundle`): set `MEDUSA_TEST_BUNDLE` to the build's directory and run jest
 * with
 *
 * - `--testEnvironment @medusajs/test-utils/dist/medusa-test-runner-utils/bundle-environment`
 * - `--resolver @medusajs/test-utils/dist/medusa-test-runner-utils/bundle-resolver`
 * - each test file in its own worker (`--workerIdleMemoryLimit=1KB`), since
 *   the bundle is loaded once per process, outside jest's module registry.
 *
 * Every `@medusajs/*` import (other than the test utils) then loads from the
 * bundle, so the app, its migrations and the workflows suites define all run
 * bundled code. Test files, their helpers and the test runner stay unbundled.
 */
export function getTestBundleDirectory(): string | undefined {
  const directory = process.env.MEDUSA_TEST_BUNDLE
  return directory ? path.resolve(directory) : undefined
}

export function getTestBundleMain(directory: string): string {
  return path.join(directory, "medusa-bundle.main.js")
}
