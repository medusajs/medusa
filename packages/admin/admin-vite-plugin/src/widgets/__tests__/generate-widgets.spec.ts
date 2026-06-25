import { vi } from "vitest"

import fs from "fs/promises"
import * as utils from "../../utils"
import { generateWidgets } from "../generate-widgets"

vi.mock("../../utils", async () => {
  const actual = await vi.importActual("../../utils")
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

const mockFileContents = [
  `
    import { defineWidgetConfig } from "@medusajs/admin-sdk"

    const Widget = () => {
        return <div>Widget 1</div>
    }

    export const config = defineWidgetConfig({
        zone: "product.details.after",
    })

    export default Widget
`,
]

const expectedWidgets = `
    widgets: [
        {
            Component: WidgetComponent0,
            zone: ["product.details.after"]
        }
    ]
`

describe("generateWidgets", () => {
  it("should generate widgets", async () => {
    const mockFiles = ["Users/user/medusa/src/admin/widgets/widget.tsx"]
    vi.mocked(utils.crawl).mockResolvedValue(mockFiles)

    vi.mocked(fs.readFile).mockImplementation(async (file) =>
      Promise.resolve(mockFileContents[mockFiles.indexOf(file as string)])
    )

    const result = await generateWidgets(
      new Set(["Users/user/medusa/src/admin"])
    )

    expect(result.imports).toEqual([
      `import WidgetComponent0, { config as WidgetConfig0 } from "Users/user/medusa/src/admin/widgets/widget.tsx"`,
    ])
    expect(utils.normalizeString(result.code)).toEqual(
      utils.normalizeString(expectedWidgets)
    )
  })
  it("should handle windows paths", async () => {
    const mockFiles = ["C:\\medusa\\src\\admin\\widgets\\widget.tsx"]
    vi.mocked(utils.crawl).mockResolvedValue(mockFiles)

    vi.mocked(fs.readFile).mockImplementation(async (file) =>
      Promise.resolve(mockFileContents[mockFiles.indexOf(file as string)])
    )

    const result = await generateWidgets(new Set(["C:\\medusa\\src\\admin"]))

    expect(result.imports).toEqual([
      `import WidgetComponent0, { config as WidgetConfig0 } from "C:/medusa/src/admin/widgets/widget.tsx"`,
    ])
    expect(utils.normalizeString(result.code)).toEqual(
      utils.normalizeString(expectedWidgets)
    )
  })

  it("should forward topbar metadata (type, icon, label) from the config", async () => {
    const mockFiles = ["Users/user/medusa/src/admin/widgets/topbar-widget.tsx"]
    const fileContents = `
      import { defineWidgetConfig } from "@medusajs/admin-sdk"
      import { Cog } from "@medusajs/icons"

      const Widget = () => {
          return <div>Topbar widget</div>
      }

      export const config = defineWidgetConfig({
          zone: "topbar.after",
          type: "icon",
          icon: Cog,
          label: "My widget",
      })

      export default Widget
    `

    vi.mocked(utils.crawl).mockResolvedValue(mockFiles)
    vi.mocked(fs.readFile).mockImplementation(async () =>
      Promise.resolve(fileContents)
    )

    const result = await generateWidgets(
      new Set(["Users/user/medusa/src/admin"])
    )

    const expected = `
      widgets: [
          {
              Component: WidgetComponent0,
              zone: ["topbar.after"],
              type: WidgetConfig0?.type,
              icon: WidgetConfig0?.icon,
              label: WidgetConfig0?.label
          }
      ]
    `

    expect(utils.normalizeString(result.code)).toEqual(
      utils.normalizeString(expected)
    )
  })
})
