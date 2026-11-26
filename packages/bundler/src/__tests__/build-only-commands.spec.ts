import { mkdirSync, mkdtempSync, realpathSync, writeFileSync } from "fs"
import { tmpdir } from "os"
import path from "path"
import { createBuildOnlyCommandMatcher } from "../selection"

/**
 * An install with `@medusajs/medusa` and `@medusajs/cli` next to each other.
 */
function createInstall() {
  const root = realpathSync(mkdtempSync(path.join(tmpdir(), "medusa-stubs-")))
  const write = (file: string, content = "") => {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true })
    writeFileSync(path.join(root, file), content)
  }
  const pkg = (name: string) => JSON.stringify({ name, main: "dist/index.js" })
  write("node_modules/@medusajs/medusa/package.json", pkg("@medusajs/medusa"))
  write("node_modules/@medusajs/medusa/dist/index.js")
  write("node_modules/@medusajs/cli/package.json", pkg("@medusajs/cli"))
  write("node_modules/@medusajs/cli/dist/index.js")
  return {
    medusaDist: path.join(root, "node_modules/@medusajs/medusa/dist"),
    cliDist: path.join(root, "node_modules/@medusajs/cli/dist"),
  }
}

describe("createBuildOnlyCommandMatcher", () => {
  it("matches the commands a bundle never runs", () => {
    const { medusaDist, cliDist } = createInstall()
    const isBuildOnly = createBuildOnlyCommandMatcher(medusaDist)

    expect(isBuildOnly(path.join(medusaDist, "commands/build.js"))).toBe(true)
    expect(isBuildOnly(path.join(medusaDist, "commands/develop.js"))).toBe(true)
    expect(isBuildOnly(path.join(medusaDist, "commands/lint.js"))).toBe(true)
    expect(isBuildOnly(path.join(medusaDist, "commands/plugin/build.js"))).toBe(
      true
    )
    // The CLI's own commands (e.g. `new`, which brings project scaffolding)
    expect(isBuildOnly(path.join(cliDist, "commands/new.js"))).toBe(true)
  })

  it("leaves the commands a bundle runs, and everything else", () => {
    const { medusaDist, cliDist } = createInstall()
    const isBuildOnly = createBuildOnlyCommandMatcher(medusaDist)

    expect(isBuildOnly(path.join(medusaDist, "commands/start.js"))).toBe(false)
    expect(isBuildOnly(path.join(medusaDist, "commands/db/migrate.js"))).toBe(
      false
    )
    expect(isBuildOnly(path.join(cliDist, "index.js"))).toBe(false)
    expect(isBuildOnly(path.join(cliDist, "commands/new.js.map"))).toBe(false)
  })
})
