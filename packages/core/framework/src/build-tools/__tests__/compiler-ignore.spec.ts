import path from "path"

/**
 * Reproduces the path segment matching logic from Compiler.#emitBuildOutput
 * to verify that files with "test" in their name are not incorrectly excluded.
 */
function filterFiles(
  fileNames: string[],
  projectRoot: string,
  chunksToIgnore: string[]
): string[] {
  return fileNames.filter((fileName) => {
    const relativeFileName = path.relative(projectRoot, fileName)
    const segments = relativeFileName.split(path.sep)
    return !chunksToIgnore.some((chunk) => {
      const chunkSegments = chunk.split("/")
      if (chunkSegments.length > 1) {
        for (let i = 0; i <= segments.length - chunkSegments.length; i++) {
          if (
            segments.slice(i, i + chunkSegments.length).join("/") === chunk
          ) {
            return true
          }
        }
        return false
      }
      return segments.includes(chunk)
    })
  })
}

const PROJECT_ROOT = "/project"

const CHUNKS_TO_IGNORE = [
  "integration-tests",
  "test",
  "unit-tests",
  "src/admin",
]

describe("Compiler backend ignore files", () => {
  it("should exclude files inside 'test' directory", () => {
    const files = [
      `${PROJECT_ROOT}/src/test/my-module.spec.ts`,
      `${PROJECT_ROOT}/src/workflows/hello-world.ts`,
    ]

    const result = filterFiles(files, PROJECT_ROOT, CHUNKS_TO_IGNORE)

    expect(result).toEqual([
      `${PROJECT_ROOT}/src/workflows/hello-world.ts`,
    ])
  })

  it("should exclude files inside 'integration-tests' directory", () => {
    const files = [
      `${PROJECT_ROOT}/integration-tests/modules/auth.spec.ts`,
      `${PROJECT_ROOT}/src/modules/auth/index.ts`,
    ]

    const result = filterFiles(files, PROJECT_ROOT, CHUNKS_TO_IGNORE)

    expect(result).toEqual([`${PROJECT_ROOT}/src/modules/auth/index.ts`])
  })

  it("should NOT exclude files with 'test' in the filename outside test directories", () => {
    const files = [
      `${PROJECT_ROOT}/src/scripts/reset-test-vendor-password.ts`,
      `${PROJECT_ROOT}/src/scripts/seed-test-accounts.ts`,
      `${PROJECT_ROOT}/src/helpers/my-test-helper.ts`,
      `${PROJECT_ROOT}/src/workflows/create-order.ts`,
    ]

    const result = filterFiles(files, PROJECT_ROOT, CHUNKS_TO_IGNORE)

    expect(result).toEqual(files)
  })

  it("should exclude files inside 'src/admin' directory but not other 'admin' directories", () => {
    const files = [
      `${PROJECT_ROOT}/src/admin/routes/custom-page.tsx`,
      `${PROJECT_ROOT}/src/api/admin/route.ts`,
    ]

    const result = filterFiles(files, PROJECT_ROOT, CHUNKS_TO_IGNORE)

    expect(result).toEqual([`${PROJECT_ROOT}/src/api/admin/route.ts`])
  })

  it("should exclude files inside 'unit-tests' directory", () => {
    const files = [
      `${PROJECT_ROOT}/unit-tests/modules/order.spec.ts`,
      `${PROJECT_ROOT}/src/modules/order/index.ts`,
    ]

    const result = filterFiles(files, PROJECT_ROOT, CHUNKS_TO_IGNORE)

    expect(result).toEqual([`${PROJECT_ROOT}/src/modules/order/index.ts`])
  })
})
