import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "fs/promises"
import os from "os"
import path from "path"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { plugin } from "../plugin"

const widget = `
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { reactVersion } from "cjs-dependency"

const Widget = () => <div>{reactVersion}</div>

export const config = defineWidgetConfig({
  zone: "product.details.before",
})

export default Widget
`

const cjsDependency = `module.exports = { reactVersion: require("react").version }`

describe("plugin", () => {
  let root: string
  let originalCwd: string

  beforeEach(async () => {
    originalCwd = process.cwd()
    root = await mkdtemp(path.join(os.tmpdir(), "admin-bundler-plugin-"))

    await mkdir(path.join(root, "src/admin/widgets"), { recursive: true })
    await mkdir(path.join(root, "node_modules/cjs-dependency"), {
      recursive: true,
    })
    await mkdir(path.join(root, "node_modules/@medusajs"))
    await symlink(
      path.dirname(require.resolve("@medusajs/admin-shared/package.json")),
      path.join(root, "node_modules/@medusajs/admin-shared")
    )
    await writeFile(
      path.join(root, "package.json"),
      JSON.stringify({ name: "test-plugin", peerDependencies: { react: "*" } })
    )
    await writeFile(path.join(root, "src/admin/widgets/widget.tsx"), widget)
    await writeFile(
      path.join(root, "node_modules/cjs-dependency/package.json"),
      JSON.stringify({ name: "cjs-dependency", main: "index.js" })
    )
    await writeFile(
      path.join(root, "node_modules/cjs-dependency/index.js"),
      cjsDependency
    )

    process.chdir(root)
  })

  afterEach(async () => {
    process.chdir(originalCwd)
    await rm(root, { recursive: true, force: true })
  })

  it("imports externals required by bundled CJS dependencies in the ES output", async () => {
    await plugin({ root, outDir: ".medusa/server" })

    const outDir = path.join(root, ".medusa/server/src/admin")
    const esm = await readFile(path.join(outDir, "index.mjs"), "utf-8")
    const cjs = await readFile(path.join(outDir, "index.js"), "utf-8")

    expect(esm).toContain("reactVersion")
    expect(esm).toMatch(/from "react"/)
    expect(esm).not.toMatch(/require\(|__require/)
    expect(cjs).toMatch(/require\("react"\)/)
  }, 60_000)
})
