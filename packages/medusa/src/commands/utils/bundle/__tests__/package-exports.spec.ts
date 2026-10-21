import { mkdirSync, mkdtempSync, realpathSync, writeFileSync } from "fs"
import { tmpdir } from "os"
import path from "path"
import { addPackageExportResolutions } from "../bundle-backend"

function createPackage(exportsMap: unknown, files: string[]) {
  const root = path.join(
    realpathSync(mkdtempSync(path.join(tmpdir(), "medusa-exports-"))),
    "node_modules/@medusajs/fake"
  )
  mkdirSync(root, { recursive: true })
  writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({ name: "@medusajs/fake", exports: exportsMap })
  )
  for (const file of files) {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true })
    writeFileSync(path.join(root, file), "")
  }
  return root
}

describe("addPackageExportResolutions", () => {
  it("resolves exported subpaths, wildcards included, to bundled files", () => {
    const root = createPackage(
      {
        ".": "./dist/index.js",
        "./utils": { require: "./dist/utils/index.js" },
        "./*": "./dist/modules/*.js",
      },
      [
        "dist/index.js",
        "dist/utils/index.js",
        "dist/modules/locking-redis.js",
        "dist/modules/nested/provider.js",
      ]
    )
    const bundled = new Set(
      [
        "dist/index.js",
        "dist/utils/index.js",
        "dist/modules/locking-redis.js",
        "dist/modules/nested/provider.js",
      ].map((file) => path.join(root, file))
    )
    const resolutions: Record<string, string> = {}

    addPackageExportResolutions(bundled, resolutions)

    expect(resolutions).toEqual({
      "@medusajs/fake": path.join(root, "dist/index.js"),
      "@medusajs/fake/utils": path.join(root, "dist/utils/index.js"),
      "@medusajs/fake/locking-redis": path.join(
        root,
        "dist/modules/locking-redis.js"
      ),
      "@medusajs/fake/nested/provider": path.join(
        root,
        "dist/modules/nested/provider.js"
      ),
    })
  })

  it("keeps existing resolutions and skips files that aren't bundled", () => {
    const root = createPackage({ "./*": "./dist/modules/*.js" }, [
      "dist/modules/a.js",
      "dist/modules/b.js",
    ])
    const resolutions: Record<string, string> = {
      "@medusajs/fake/a": "/elsewhere/a.js",
    }

    addPackageExportResolutions(
      new Set([path.join(root, "dist/modules/a.js")]),
      resolutions
    )

    expect(resolutions).toEqual({ "@medusajs/fake/a": "/elsewhere/a.js" })
  })

  it("skips patterns it can't expand", () => {
    const root = createPackage(
      { "./*": "./dist/index.js", "./a/*/b/*": "./dist/*/x/*.js" },
      ["dist/index.js"]
    )
    const resolutions: Record<string, string> = {}

    addPackageExportResolutions(
      new Set([path.join(root, "dist/index.js")]),
      resolutions
    )

    expect(resolutions).toEqual({})
  })
})
