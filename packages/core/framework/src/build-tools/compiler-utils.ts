import path from "path"

/**
 * Matches path segments that follow common test directory naming
 * conventions. Handles:
 *   - test, tests
 *   - __test__, __tests__
 *   - unit-tests, integration-tests, e2e-tests (and singular forms)
 */
const TEST_DIR_PATTERN =
  /^(?:__)?tests?(?:__)?$|^(?:unit|integration|e2e)-tests?$/

/**
 * Matches filenames that follow common test file naming conventions:
 *   - *.test.ts, *.test.js
 *   - *.spec.ts, *.spec.js
 */
const TEST_FILE_PATTERN = /\.(?:test|spec)\.[jt]sx?$/

/**
 * Determines if a relative file path should be excluded from
 * the build output. A file is excluded when:
 *
 * 1. Any of its path segments matches a known test directory
 *    naming convention (convention-based), OR
 * 2. The filename matches a test file naming convention
 *    (e.g. *.test.ts, *.spec.ts), OR
 * 3. Its path contains a sequence of segments that exactly
 *    matches one of the provided ignore patterns
 *    (project-specific, e.g. "src/admin").
 *
 * Unlike a naive `String.includes()` check, this approach only
 * matches **full path segments**, so a file like
 * `src/scripts/reset-test-vendor.ts` is correctly kept.
 */
export function shouldIgnoreFile(
  relativePath: string,
  projectIgnorePatterns: string[]
): boolean {
  const segments = relativePath.split(path.sep)
  const fileName = segments[segments.length - 1]

  if (segments.some((segment) => TEST_DIR_PATTERN.test(segment))) {
    return true
  }

  if (TEST_FILE_PATTERN.test(fileName)) {
    return true
  }

  return projectIgnorePatterns.some((pattern) => {
    const patternParts = pattern.split("/")
    return segments.some((_, i) =>
      patternParts.every((part, j) => segments[i + j] === part)
    )
  })
}
