import { PluginDetails } from "@medusajs/types"
import path from "path"
import { FileSystem } from "../../common/file-system"
import { generateAugmentationRefs } from "../generate-augmentation-refs"

const BASE_DIR = path.join(__dirname, "sample-proj-augmentation-refs")
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

describe("generateAugmentationRefs", () => {
  it("should emit a reference for plugin that exposes root types via exports map", async () => {
    await fs.createJson(`node_modules/@my-org/plugin-a/package.json`, {
      name: "@my-org/plugin-a",
      exports: {
        ".": { types: "./index.d.ts" },
        "./admin": "./admin.js",
        "./package.json": "./package.json",
      },
    })

    await generateAugmentationRefs({
      directory: BASE_DIR,
      plugins: [
        makePlugin("@my-org/plugin-a", {
          admin: { type: "package", resolve: "@my-org/plugin-a/admin" },
        }),
      ],
    })

    const content = await fs.contents(".medusa/types/augmentation-refs.d.ts")
    expect(content).toContain('/// <reference types="@my-org/plugin-a" />')
  })

  it("should include backend-only plugin(with no admin extension)", async () => {
    await fs.createJson(`node_modules/@my-org/backend-plugin/package.json`, {
      name: "@my-org/backend-plugin",
      exports: {
        ".": { types: "./index.d.ts" },
        "./package.json": "./package.json",
      },
    })

    await generateAugmentationRefs({
      directory: BASE_DIR,
      plugins: [makePlugin("@my-org/backend-plugin")],
    })

    const content = await fs.contents(".medusa/types/augmentation-refs.d.ts")
    expect(content).toContain(
      '/// <reference types="@my-org/backend-plugin" />'
    )
  })

  it("skips npm plugin that has no root types in exports", async () => {
    await fs.createJson(`node_modules/@my-org/no-types/package.json`, {
      name: "@my-org/no-types",
      exports: { "./admin": "./admin.js", "./package.json": "./package.json" },
    })

    await generateAugmentationRefs({
      directory: BASE_DIR,
      plugins: [
        makePlugin("@my-org/no-types", {
          admin: { type: "package", resolve: "@my-org/no-types/admin" },
        }),
      ],
    })

    const content = await fs.contents(".medusa/types/augmentation-refs.d.ts")
    expect(content).not.toContain("@my-org/no-types")
    expect(content).toContain("No plugin or module type packages detected")
  })

  it("skips the project-plugin entry", async () => {
    await generateAugmentationRefs({
      directory: BASE_DIR,
      plugins: [
        makePlugin("project-plugin", {
          admin: { type: "local", resolve: path.join(BASE_DIR, "src/admin") },
        }),
      ],
    })

    const content = await fs.contents(".medusa/types/augmentation-refs.d.ts")
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

    await generateAugmentationRefs({
      directory: BASE_DIR,
      plugins: [makePlugin("@my-org/nested")],
    })

    const content = await fs.contents(".medusa/types/augmentation-refs.d.ts")
    expect(content).toContain('/// <reference types="@my-org/nested" />')
  })

  it("writes multiple references when several plugins have root types", async () => {
    await fs.createJson(`node_modules/@my-org/plugin-a/package.json`, {
      name: "@my-org/plugin-a",
      exports: {
        ".": { types: "./index.d.ts" },
        "./package.json": "./package.json",
      },
    })
    await fs.createJson(`node_modules/@my-org/plugin-b/package.json`, {
      name: "@my-org/plugin-b",
      exports: {
        ".": { types: "./index.d.ts" },
        "./package.json": "./package.json",
      },
    })

    await generateAugmentationRefs({
      directory: BASE_DIR,
      plugins: [makePlugin("@my-org/plugin-a"), makePlugin("@my-org/plugin-b")],
    })

    const content = await fs.contents(".medusa/types/augmentation-refs.d.ts")
    expect(content).toContain('/// <reference types="@my-org/plugin-a" />')
    expect(content).toContain('/// <reference types="@my-org/plugin-b" />')
  })

  it("generates placeholder file when no plugins have root types", async () => {
    await generateAugmentationRefs({ directory: BASE_DIR, plugins: [] })

    const content = await fs.contents(".medusa/types/augmentation-refs.d.ts")
    expect(content).toContain("No plugin or module type packages detected")
    expect(content).toContain("export {}")
  })

  it("emits a reference for a package-based module that ships types", async () => {
    await fs.create(
      `node_modules/@my-org/some-module/index.js`,
      "module.exports = {}"
    )
    await fs.create(`node_modules/@my-org/some-module/index.d.ts`, "export {}")
    await fs.createJson(`node_modules/@my-org/some-module/package.json`, {
      name: "@my-org/some-module",
      main: "./index.js",
      types: "./index.d.ts",
    })

    await generateAugmentationRefs({
      directory: BASE_DIR,
      plugins: [],
      modules: {
        someModule: {
          __definition: {
            key: "someModule",
            resolvePath: "@my-org/some-module",
          },
        } as any,
      },
    })

    const content = await fs.contents(".medusa/types/augmentation-refs.d.ts")
    expect(content).toContain('/// <reference types="@my-org/some-module" />')
  })

  it("normalizes a core module registered through its bare package name to the canonical medusa subpath", async () => {
    await fs.create(
      `node_modules/@medusajs/medusa/rbac.js`,
      "module.exports = {}"
    )
    await fs.create(`node_modules/@medusajs/medusa/rbac.d.ts`, "export {}")
    await fs.createJson(`node_modules/@medusajs/medusa/package.json`, {
      name: "@medusajs/medusa",
      exports: {
        "./rbac": "./rbac.js",
        "./event-bus-redis": "./event-bus-redis.js",
      },
    })

    await generateAugmentationRefs({
      directory: BASE_DIR,
      plugins: [],
      modules: {
        rbac: {
          __definition: {
            key: "rbac",
            resolvePath: "@medusajs/rbac",
          },
        } as any,
      },
    })

    const content = await fs.contents(".medusa/types/augmentation-refs.d.ts")
    expect(content).toContain('/// <reference types="@medusajs/medusa/rbac" />')
    expect(content).not.toContain('"@medusajs/rbac"')
  })

  it("keeps a core module's @medusajs/medusa subpath resolve path as is", async () => {
    await fs.create(
      `node_modules/@medusajs/medusa/event-bus-redis.js`,
      "module.exports = {}"
    )
    await fs.create(
      `node_modules/@medusajs/medusa/event-bus-redis.d.ts`,
      "export {}"
    )
    await fs.createJson(`node_modules/@medusajs/medusa/package.json`, {
      name: "@medusajs/medusa",
      exports: {
        "./rbac": "./rbac.js",
        "./event-bus-redis": "./event-bus-redis.js",
      },
    })

    await generateAugmentationRefs({
      directory: BASE_DIR,
      plugins: [],
      modules: {
        event_bus: {
          __definition: {
            key: "event_bus",
            resolvePath: "@medusajs/medusa/event-bus-redis",
          },
        } as any,
      },
    })

    const content = await fs.contents(".medusa/types/augmentation-refs.d.ts")
    expect(content).toContain(
      '/// <reference types="@medusajs/medusa/event-bus-redis" />'
    )
  })

  it("skips local modules registered through a relative path", async () => {
    await generateAugmentationRefs({
      directory: BASE_DIR,
      plugins: [],
      modules: {
        brand: {
          __definition: {
            key: "brand",
            resolvePath: "./src/modules/brand",
          },
        } as any,
      },
    })

    const content = await fs.contents(".medusa/types/augmentation-refs.d.ts")
    expect(content).not.toContain("./src/modules/brand")
    expect(content).toContain("No plugin or module type packages detected")
  })
})
