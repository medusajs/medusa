import { describe, expect, it, vi } from "vitest"

import fs from "fs/promises"
import * as utils from "../../utils"
import { generateMenuItems } from "../generate-menu-items"

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
    import { defineRouteConfig } from "@medusajs/admin-sdk"

    const Page = () => {
        return <div>Page 1</div>
    }

    export const config = defineRouteConfig({
        label: "Page 1",
        icon: "icon1",
    })

    export default Page
    `,
  `
    import { defineRouteConfig } from "@medusajs/admin-sdk"

    const Page = () => {
        return <div>Page 2</div>
    }

    export const config = defineRouteConfig({
        label: "Page 2",
    })

    export default Page
  `,
]

const expectedMenuItems = `
        menuItems: [
          {
            label: RouteConfig0.label,
            icon: RouteConfig0.icon,
            path: "/one",
          },
          {
            label: RouteConfig1.label,
            icon: undefined,
            path: "/two",
          }
        ]
      `

describe("generateMenuItems", () => {
  it("should generate menu items", async () => {
    const mockFiles = [
      "Users/user/medusa/src/admin/routes/one/page.tsx",
      "Users/user/medusa/src/admin/routes/two/page.tsx",
    ]
    vi.mocked(utils.crawl).mockResolvedValue(mockFiles)

    vi.mocked(fs.readFile).mockImplementation(async (file) =>
      Promise.resolve(mockFileContents[mockFiles.indexOf(file as string)])
    )

    const result = await generateMenuItems(
      new Set(["Users/user/medusa/src/admin"])
    )

    expect(result.imports).toEqual([
      `import { config as RouteConfig0 } from "Users/user/medusa/src/admin/routes/one/page.tsx"`,
      `import { config as RouteConfig1 } from "Users/user/medusa/src/admin/routes/two/page.tsx"`,
    ])
    expect(utils.normalizeString(result.code)).toEqual(
      utils.normalizeString(expectedMenuItems)
    )
  })

  it("should handle windows paths", async () => {
    // Setup mocks
    const mockFiles = [
      "C:\\medusa\\src\\admin\\routes\\one\\page.tsx",
      "C:\\medusa\\src\\admin\\routes\\two\\page.tsx",
    ]
    vi.mocked(utils.crawl).mockResolvedValue(mockFiles)

    vi.mocked(fs.readFile).mockImplementation(async (file) =>
      Promise.resolve(mockFileContents[mockFiles.indexOf(file as string)])
    )

    const result = await generateMenuItems(new Set(["C:\\medusa\\src\\admin"]))

    expect(result.imports).toEqual([
      `import { config as RouteConfig0 } from "C:/medusa/src/admin/routes/one/page.tsx"`,
      `import { config as RouteConfig1 } from "C:/medusa/src/admin/routes/two/page.tsx"`,
    ])
    expect(utils.normalizeString(result.code)).toEqual(
      utils.normalizeString(expectedMenuItems)
    )
  })
})
