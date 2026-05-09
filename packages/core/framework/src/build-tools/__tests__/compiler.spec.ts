import path from "path"

describe("compiler ignored paths filtering", () => {
  const chunksToIgnore = [
    "integration-tests",
    "test",
    "unit-tests",
    "src/admin",
  ]

  const shouldIgnore = (fileName: string) => {
    const relativeFileName = path.normalize(fileName)
    const normalizedFile = relativeFileName.split(path.sep).join("/")

    return chunksToIgnore.some((chunk) => {
      const normalizedChunk = chunk.split(/[\\/]/).join("/")

      if (!normalizedChunk.includes("/")) {
        return normalizedFile.split("/").includes(normalizedChunk)
      }

      return normalizedFile.startsWith(normalizedChunk + "/")
    })
  }

  it("includes files with test in filename outside ignored directories", () => {
    expect(shouldIgnore("src/scripts/reset-test-vendor-password.ts")).toBe(
      false
    )
  })

  it("excludes files inside src/test directory", () => {
    expect(shouldIgnore("src/test/foo.ts")).toBe(true)
  })

  it("excludes files inside src/admin directory", () => {
    expect(shouldIgnore("src/admin/test-admin.ts")).toBe(true)
  })
})
