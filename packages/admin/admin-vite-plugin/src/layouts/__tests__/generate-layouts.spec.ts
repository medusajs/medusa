import { describe, expect, it, vi } from "vitest"

import fs from "fs/promises"
import * as utils from "../../utils"
import { generateLayouts } from "../generate-layouts"

vi.mock("../../utils", async () => {
  const actual = await vi.importActual<typeof utils>("../../utils")
  return {
    ...actual,
    crawl: vi.fn(),
  }
})

vi.mock("fs/promises", () => ({
  default: {
    readFile: vi.fn(),
  },
}))

const validLayoutFile = `
    import { defineLayoutConfig } from "@medusajs/admin-sdk"

    const Layout = () => {
        return <div>Layout 1</div>
    }

    export const config = defineLayoutConfig({
        id: "three-column",
        sections: [
            { id: "main", ordering: "list" },
            { id: "sidebar", ordering: "list" },
        ],
    })

    export default Layout
`

const layoutFileWithoutDefaultExport = `
    import { defineLayoutConfig } from "@medusajs/admin-sdk"

    export const config = defineLayoutConfig({
        id: "no-default-export",
        sections: [{ id: "main", ordering: "list" }],
    })
`

const layoutFileWithoutConfigExport = `
    const Layout = () => {
        return <div>Layout without config</div>
    }

    export default Layout
`

function getExpectedNames(index: number) {
  return {
    componentName: `LayoutComponent${index}`,
    configName: `LayoutConfig${index}`,
  }
}

describe("generateLayouts", () => {
  it("should generate layouts", async () => {
    const mockFiles = ["Users/user/medusa/src/admin/layouts/layout.tsx"]
    vi.mocked(utils.crawl).mockResolvedValue(mockFiles)

    vi.mocked(fs.readFile).mockImplementation(async () =>
      Promise.resolve(validLayoutFile)
    )

    const result = await generateLayouts(
      new Set(["Users/user/medusa/src/admin"])
    )

    const { componentName, configName } = getExpectedNames(0)

    expect(result.imports).toEqual([
      `import ${componentName}, { config as ${configName} } from "${mockFiles[0]}"`,
    ])
    expect(utils.normalizeString(result.code)).toEqual(
      utils.normalizeString(`
        layouts: [
          { ...${configName}, Component: ${componentName} }
        ]
      `)
    )
  })

  it("should handle windows paths", async () => {
    const mockFiles = ["C:\\medusa\\src\\admin\\layouts\\layout.tsx"]
    vi.mocked(utils.crawl).mockResolvedValue(mockFiles)

    vi.mocked(fs.readFile).mockImplementation(async () =>
      Promise.resolve(validLayoutFile)
    )

    const result = await generateLayouts(new Set(["C:\\medusa\\src\\admin"]))

    const { componentName, configName } = getExpectedNames(0)
    const normalizedPath = utils.normalizePath(mockFiles[0])

    expect(result.imports).toEqual([
      `import ${componentName}, { config as ${configName} } from "${normalizedPath}"`,
    ])
    expect(utils.normalizeString(result.code)).toEqual(
      utils.normalizeString(`
        layouts: [
          { ...${configName}, Component: ${componentName} }
        ]
      `)
    )
  })

  it("should generate multiple layouts", async () => {
    const mockFiles = [
      "Users/user/medusa/src/admin/layouts/one.tsx",
      "Users/user/medusa/src/admin/layouts/two.tsx",
    ]
    vi.mocked(utils.crawl).mockResolvedValue(mockFiles)

    vi.mocked(fs.readFile).mockImplementation(async () =>
      Promise.resolve(validLayoutFile)
    )

    const result = await generateLayouts(
      new Set(["Users/user/medusa/src/admin"])
    )

    const first = getExpectedNames(0)
    const second = getExpectedNames(1)

    expect(result.imports).toEqual([
      `import ${first.componentName}, { config as ${first.configName} } from "${mockFiles[0]}"`,
      `import ${second.componentName}, { config as ${second.configName} } from "${mockFiles[1]}"`,
    ])
    expect(utils.normalizeString(result.code)).toEqual(
      utils.normalizeString(`
        layouts: [
          { ...${first.configName}, Component: ${first.componentName} },
          { ...${second.configName}, Component: ${second.componentName} }
        ]
      `)
    )
  })

  it("should skip files without a default export", async () => {
    const mockFiles = ["Users/user/medusa/src/admin/layouts/layout.tsx"]
    vi.mocked(utils.crawl).mockResolvedValue(mockFiles)

    vi.mocked(fs.readFile).mockImplementation(async () =>
      Promise.resolve(layoutFileWithoutDefaultExport)
    )

    const result = await generateLayouts(
      new Set(["Users/user/medusa/src/admin"])
    )

    expect(result.imports).toEqual([])
    expect(utils.normalizeString(result.code)).toEqual(
      utils.normalizeString("layouts: [ ]")
    )
  })

  it("should skip files without a config export", async () => {
    const mockFiles = ["Users/user/medusa/src/admin/layouts/layout.tsx"]
    vi.mocked(utils.crawl).mockResolvedValue(mockFiles)

    vi.mocked(fs.readFile).mockImplementation(async () =>
      Promise.resolve(layoutFileWithoutConfigExport)
    )

    const result = await generateLayouts(
      new Set(["Users/user/medusa/src/admin"])
    )

    expect(result.imports).toEqual([])
    expect(utils.normalizeString(result.code)).toEqual(
      utils.normalizeString("layouts: [ ]")
    )
  })

  it("should return an empty layouts array when no files are found", async () => {
    vi.mocked(utils.crawl).mockResolvedValue([])

    const result = await generateLayouts(
      new Set(["Users/user/medusa/src/admin"])
    )

    expect(result.imports).toEqual([])
    expect(utils.normalizeString(result.code)).toEqual(
      utils.normalizeString("layouts: [ ]")
    )
  })
})
