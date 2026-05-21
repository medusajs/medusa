import path from "path"

import { shouldIgnoreBackendBuildFile } from "../ignore-files"

describe("shouldIgnoreBackendBuildFile", () => {
  const projectRoot = path.join("tmp", "medusa-app")
  const ignoredChunks = ["integration-tests", "test", "unit-tests", "src/admin"]

  it("does not ignore script filenames that contain test", () => {
    expect(
      shouldIgnoreBackendBuildFile(
        projectRoot,
        path.join(
          projectRoot,
          "src",
          "scripts",
          "reset-test-vendor-password.ts"
        ),
        ignoredChunks
      )
    ).toBe(false)
  })

  it.each([
    ["test directory", path.join("test", "helpers.ts")],
    ["unit-tests directory", path.join("unit-tests", "orders.ts")],
    ["integration-tests directory", path.join("integration-tests", "api.ts")],
    ["admin source directory", path.join("src", "admin", "widgets.tsx")],
  ])("ignores files inside the %s", (_label, relativePath) => {
    expect(
      shouldIgnoreBackendBuildFile(
        projectRoot,
        path.join(projectRoot, relativePath),
        ignoredChunks
      )
    ).toBe(true)
  })
})
