import { PluginDetails } from "@medusajs/types"
import path from "path"
import { FileSystem } from "../../common/file-system"
import { generatePluginAugmentations } from "../generate-plugin-augmentations"

const BASE_DIR = path.join(__dirname, "sample-proj-plugin-augmentations")
const fs = new FileSystem(BASE_DIR)

afterEach(async () => {
  await fs.cleanup()
})

function makePlugin(
  name: string,
  overrides: Partial<PluginDetails> = {}
): PluginDetails {
  return {
    name,
    id: name,
    resolve: path.join(BASE_DIR, "node_modules", name, ".medusa/server/src"),
    options: {},
    version: "1.0.0",
    ...overrides,
  }
}

describe("generatePluginAugmentations", () => {
  it("should emit a reference for plugin that exposes root types via exports map", async () => {
    await fs.createJson(`node_modules/@my-org/plugin-a/package.json`, {
      name: "@my-org/plugin-a",
      exports: {
        ".": { types: "./index.d.ts" },
        "./admin": "./admin.js",
        "./package.json": "./package.json",
      },
    })

    await generatePluginAugmentations({
      directory: BASE_DIR,
      plugins: [
        makePlugin("@my-org/plugin-a", {
          admin: { type: "package", resolve: "@my-org/plugin-a/admin" },
        }),
      ],
    })

    const content = await fs.contents(".medusa/types/plugin-augmentations.d.ts")
    expect(content).toContain('/// <reference types="@my-org/plugin-a" />')
  })

  it("should include backend-only plugin(with no admin extension)", async () => {
    await fs.createJson(`node_modules/@my-org/backend-plugin/package.json`, {
      name: "@my-org/backend-plugin",
      exports: { ".": { types: "./index.d.ts" }, "./package.json": "./package.json" },
    })

    await generatePluginAugmentations({
      directory: BASE_DIR,
      plugins: [makePlugin("@my-org/backend-plugin")],
    })

    const content = await fs.contents(".medusa/types/plugin-augmentations.d.ts")
    expect(content).toContain('/// <reference types="@my-org/backend-plugin" />')
  })

  it("skips npm plugin that has no root types in exports", async () => {
    await fs.createJson(`node_modules/@my-org/no-types/package.json`, {
      name: "@my-org/no-types",
      exports: { "./admin": "./admin.js", "./package.json": "./package.json" },
    })

    await generatePluginAugmentations({
      directory: BASE_DIR,
      plugins: [
        makePlugin("@my-org/no-types", {
          admin: { type: "package", resolve: "@my-org/no-types/admin" },
        }),
      ],
    })

    const content = await fs.contents(".medusa/types/plugin-augmentations.d.ts")
    expect(content).not.toContain("@my-org/no-types")
    expect(content).toContain("No plugin type packages detected")
  })

  it("skips the project-plugin entry", async () => {
    await generatePluginAugmentations({
      directory: BASE_DIR,
      plugins: [
        makePlugin("project-plugin", {
          admin: { type: "local", resolve: path.join(BASE_DIR, "src/admin") },
        }),
      ],
    })

    const content = await fs.contents(".medusa/types/plugin-augmentations.d.ts")
    expect(content).not.toContain("project-plugin")
  })

  it("detects types condition nested inside import/require conditions", async () => {
    await fs.createJson(`node_modules/@my-org/nested/package.json`, {
      name: "@my-org/nested",
      exports: {
        ".": {
          import: { types: "./index.d.mts", default: "./index.mjs" },
          require: { types: "./index.d.ts", default: "./index.cjs" },
        },
        "./package.json": "./package.json",
      },
    })

    await generatePluginAugmentations({
      directory: BASE_DIR,
      plugins: [makePlugin("@my-org/nested")],
    })

    const content = await fs.contents(".medusa/types/plugin-augmentations.d.ts")
    expect(content).toContain('/// <reference types="@my-org/nested" />')
  })

  it("writes multiple references when several plugins have root types", async () => {
    await fs.createJson(`node_modules/@my-org/plugin-a/package.json`, {
      name: "@my-org/plugin-a",
      exports: { ".": { types: "./index.d.ts" }, "./package.json": "./package.json" },
    })
    await fs.createJson(`node_modules/@my-org/plugin-b/package.json`, {
      name: "@my-org/plugin-b",
      exports: { ".": { types: "./index.d.ts" }, "./package.json": "./package.json" },
    })

    await generatePluginAugmentations({
      directory: BASE_DIR,
      plugins: [makePlugin("@my-org/plugin-a"), makePlugin("@my-org/plugin-b")],
    })

    const content = await fs.contents(".medusa/types/plugin-augmentations.d.ts")
    expect(content).toContain('/// <reference types="@my-org/plugin-a" />')
    expect(content).toContain('/// <reference types="@my-org/plugin-b" />')
  })

  it("generates placeholder file when no plugins have root types", async () => {
    await generatePluginAugmentations({ directory: BASE_DIR, plugins: [] })

    const content = await fs.contents(".medusa/types/plugin-augmentations.d.ts")
    expect(content).toContain("No plugin type packages detected")
    expect(content).toContain("export {}")
  })
})
