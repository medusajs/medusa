import { Logger } from "@medusajs/framework/types"
import fs from "node:fs"
import path from "node:path"

const ESLINT_CONFIG_FILES = [
  "eslint.config.js",
  "eslint.config.mjs",
  "eslint.config.cjs",
  "eslint.config.ts",
  "eslint.config.mts",
  "eslint.config.cts",
]

export interface LintResult {
  errorCount: number
  warningCount: number
  formatted: string
}

/**
 * Detect whether the project has a flat ESLint config at its root. The lint
 * step only runs when one of these files exists — there is no zero-config
 * fallback that synthesizes a config behind the user's back.
 */
export function hasEslintConfig(dir: string): boolean {
  return ESLINT_CONFIG_FILES.some((file) => fs.existsSync(path.join(dir, file)))
}

/**
 * Resolve the `eslint` module from the consumer's project rather than from the
 * CLI's own dependencies. `eslint` is a peer dependency of
 * `@medusajs/eslint-plugin`, so it is installed in the user's project and is
 * not bundled with Medusa. Returns `null` when it cannot be found.
 */
function loadEslintModule(cwd: string): any | null {
  try {
    const eslintPath = require.resolve("eslint", { paths: [cwd] })
    return require(eslintPath)
  } catch {
    return null
  }
}

/**
 * Run ESLint over the project (or the provided patterns) using the consumer's
 * own `eslint.config.js`. The user's flat config is responsible for scoping
 * rules via `files`/`ignores` blocks — we only invoke the runner.
 *
 * Returns `null` (after logging a warning) when `eslint` is not installed in
 * the project, so callers can decide whether that is fatal.
 */
export async function lintProject(opts: {
  cwd: string
  patterns?: string[]
  fix?: boolean
  /** When true, only error-level results are reported (warnings suppressed). */
  quiet?: boolean
  logger: Logger
}): Promise<LintResult | null> {
  const eslintModule = loadEslintModule(opts.cwd)

  if (!eslintModule) {
    opts.logger.warn(
      "Linting skipped: the `eslint` package is not installed in this project. " +
        "Install the `eslint` package with your package manager to enable linting, or pass `--lint false` to silence this message."
    )
    return null
  }

  const { ESLint } = eslintModule

  // Caching is on by default — repeat builds skip unchanged files.
  const cacheLocation = path.join(opts.cwd, ".medusa/cache/.eslintcache")
  fs.mkdirSync(path.dirname(cacheLocation), { recursive: true })

  const eslint = new ESLint({
    cwd: opts.cwd,
    // ESLint discovers eslint.config.js from cwd automatically.
    fix: opts.fix ?? false,
    errorOnUnmatchedPattern: false,
    cache: true,
    cacheLocation,
  })

  const results = await eslint.lintFiles(opts.patterns ?? ["."])

  if (opts.fix) {
    await ESLint.outputFixes(results)
  }

  // `--quiet`: report only errors. Mirrors ESLint's CLI flag via the Node API's
  // static `getErrorResults`, which returns a copy of the results with every
  // warning-level message stripped out.
  const reportedResults = opts.quiet ? ESLint.getErrorResults(results) : results

  const formatter = await eslint.loadFormatter("stylish")
  const formatted = await formatter.format(reportedResults)

  let errorCount = 0
  let warningCount = 0
  for (const result of reportedResults) {
    errorCount += result.errorCount
    warningCount += result.warningCount
  }

  return { errorCount, warningCount, formatted }
}

/**
 * Shared lint gate for `medusa build` and `medusa develop`. Encapsulates the
 * common flow; the only difference between the two callers is `failOnError`:
 *
 * - `--lint false`            → skipped silently (debug log).
 * - no `eslint.config.js`     → skipped with an info log; caller continues.
 * - `eslint` not installed    → skipped with a warn log; caller continues.
 * - lint errors:
 *     - `failOnError: true`   → print output, log error, exit 1 (never returns).
 *     - `failOnError: false`  → print output, log a warning, and continue.
 * - lint warnings only        → print output, log a warning, and continue.
 * - runner throws:
 *     - `failOnError: true`   → log error and exit 1, hint to use `--lint false`.
 *     - `failOnError: false`  → log a warning and continue.
 *
 * `develop` gates the dev server on lint passing, so it uses the default
 * `failOnError: true`. `build` treats lint like the compiler treats type
 * errors — non-blocking: it surfaces problems but still produces a build, so it
 * passes `failOnError: false`.
 *
 * Returns when the caller should proceed; otherwise calls `process.exit(1)`.
 */
export async function runLintStep(opts: {
  directory: string
  lint: boolean
  fix?: boolean
  /** When true, only error-level results are reported (warnings suppressed). */
  quiet?: boolean
  logger: Logger
  /** Extra context appended to the error message, e.g. "Dev server not started." */
  failureSuffix?: string
  /** When true (default), lint errors exit the process with code 1. */
  failOnError?: boolean
}): Promise<void> {
  const lintEnabled = opts.lint
  const failOnError = opts.failOnError ?? true

  if (!lintEnabled) {
    opts.logger.debug("Linting skipped: disabled via --lint false.")
    return
  }

  if (!hasEslintConfig(opts.directory)) {
    opts.logger.info("Linting skipped: no eslint.config.js found.")
    return
  }

  opts.logger.info("Linting project...")

  let result: LintResult | null = null
  try {
    result = await lintProject({
      cwd: opts.directory,
      fix: opts.fix ?? false,
      quiet: opts.quiet ?? false,
      logger: opts.logger,
    })
  } catch (error) {
    const typedError = error instanceof Error ? error : new Error(String(error))
    const message =
      `Linting failed to run: ${typedError.message}. ` +
      "Check your eslint.config.js, or run with `--lint false` to skip linting."
    if (failOnError) {
      opts.logger.error(message)
      process.exit(1)
    }
    opts.logger.warn(message)
    return
  }

  // `eslint` not installed — lintProject already warned. Continue.
  if (!result) {
    return
  }

  if (result.errorCount > 0) {
    process.stderr.write(result.formatted)

    if (failOnError) {
      const suffix = opts.failureSuffix ? ` ${opts.failureSuffix}` : ""
      opts.logger.error(
        `Lint failed with ${result.errorCount} error(s).${suffix}`
      )
      process.exit(1)
    }

    const warningNote =
      result.warningCount > 0 ? ` and ${result.warningCount} warning(s)` : ""
    opts.logger.warn(
      `Lint found ${result.errorCount} error(s)${warningNote}. ` +
        "Continuing anyway, but consider fixing the errors with the `--fix` flag or by running `medusa lint --fix`."
    )
    return
  }

  if (result.warningCount > 0) {
    process.stdout.write(result.formatted)
    opts.logger.warn(`Lint produced ${result.warningCount} warning(s).`)
  }
}
