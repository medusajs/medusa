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
  `
    import { defineRouteConfig } from "@medusajs/admin-sdk"

    const Page = () => {
        return <div>Page 2</div>
    }

    export const config = defineRouteConfig({
        label: "Page 3",
        icon: "icon1",
        nested: "/products"
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
            nested: undefined,
            rank: undefined,
            translationNs: undefined
          },
          {
            label: RouteConfig1.label,
            icon: undefined,
            path: "/two",
            nested: undefined,
            rank: undefined,
            translationNs: undefined
          },
          {
            label: RouteConfig2.label,
            icon: RouteConfig2.icon,
            path: "/three",
            nested: "/products",
            rank: undefined,
            translationNs: undefined
          }
        ]
      `

describe("generateMenuItems", () => {
  it("should generate menu items", async () => {
    const mockFiles = [
      "Users/user/medusa/src/admin/routes/one/page.tsx",
      "Users/user/medusa/src/admin/routes/two/page.tsx",
      "Users/user/medusa/src/admin/routes/three/page.tsx",
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
      `import { config as RouteConfig2 } from "Users/user/medusa/src/admin/routes/three/page.tsx"`,
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
      "C:\\medusa\\src\\admin\\routes\\three\\page.tsx",
    ]
    vi.mocked(utils.crawl).mockResolvedValue(mockFiles)

    vi.mocked(fs.readFile).mockImplementation(async (file) =>
      Promise.resolve(mockFileContents[mockFiles.indexOf(file as string)])
    )

    const result = await generateMenuItems(new Set(["C:\\medusa\\src\\admin"]))

    expect(result.imports).toEqual([
      `import { config as RouteConfig0 } from "C:/medusa/src/admin/routes/one/page.tsx"`,
      `import { config as RouteConfig1 } from "C:/medusa/src/admin/routes/two/page.tsx"`,
      `import { config as RouteConfig2 } from "C:/medusa/src/admin/routes/three/page.tsx"`,
    ])
    expect(utils.normalizeString(result.code)).toEqual(
      utils.normalizeString(expectedMenuItems)
    )
  })

  it("should include rank property in generated menu items", async () => {
    const mockFilesWithRank = [
      "Users/user/medusa/src/admin/routes/analytics/page.tsx",
      "Users/user/medusa/src/admin/routes/reports/page.tsx",
    ]

    const mockFileContentsWithRank = [
      `
        import { defineRouteConfig } from "@medusajs/admin-sdk"

        const Page = () => {
            return <div>Analytics</div>
        }

        export const config = defineRouteConfig({
            label: "Analytics",
            icon: "ChartBar",
            rank: 1,
        })

        export default Page
      `,
      `
        import { defineRouteConfig } from "@medusajs/admin-sdk"

        const Page = () => {
            return <div>Reports</div>
        }

        export const config = defineRouteConfig({
            label: "Reports",
            rank: 2,
        })

        export default Page
      `,
    ]

    vi.mocked(utils.crawl).mockResolvedValue(mockFilesWithRank)

    vi.mocked(fs.readFile).mockImplementation(async (file) =>
      Promise.resolve(
        mockFileContentsWithRank[mockFilesWithRank.indexOf(file as string)]
      )
    )

    const result = await generateMenuItems(
      new Set(["Users/user/medusa/src/admin"])
    )

    const expectedMenuItemsWithRank = `
      menuItems: [
        {
          label: RouteConfig0.label,
          icon: RouteConfig0.icon,
          path: "/analytics",
          nested: undefined,
          rank: 1,
          translationNs: undefined
        },
        {
          label: RouteConfig1.label,
          icon: undefined,
          path: "/reports",
          nested: undefined,
          rank: 2,
          translationNs: undefined
        }
      ]
    `

    expect(utils.normalizeString(result.code)).toEqual(
      utils.normalizeString(expectedMenuItemsWithRank)
    )
  })

  it("should handle translationNs field", async () => {
    const mockFileWithTranslation = `
      import { defineRouteConfig } from "@medusajs/admin-sdk"

      const Page = () => {
          return <div>Custom Page</div>
      }

      export const config = defineRouteConfig({
          label: "menuItems.customFeature",
          translationNs: "my-plugin",
      })

      export default Page
    `

    const mockFiles = ["Users/user/medusa/src/admin/routes/custom/page.tsx"]
    vi.mocked(utils.crawl).mockResolvedValue(mockFiles)
    vi.mocked(fs.readFile).mockResolvedValue(mockFileWithTranslation)

    const result = await generateMenuItems(
      new Set(["Users/user/medusa/src/admin"])
    )

    expect(result.imports).toEqual([
      `import { config as RouteConfig0 } from "Users/user/medusa/src/admin/routes/custom/page.tsx"`,
    ])

    const expectedOutput = `
      menuItems: [
        {
          label: RouteConfig0.label,
          icon: undefined,
          path: "/custom",
          nested: undefined,
          rank: undefined,
          translationNs: RouteConfig0.translationNs
        }
      ]
    `

    expect(utils.normalizeString(result.code)).toEqual(
      utils.normalizeString(expectedOutput)
    )
  })

  it("should handle mixed ranked and unranked routes", async () => {
    const mockMixedFiles = [
      "Users/user/medusa/src/admin/routes/first/page.tsx",
      "Users/user/medusa/src/admin/routes/second/page.tsx",
      "Users/user/medusa/src/admin/routes/third/page.tsx",
    ]

    const mockMixedContents = [
      `
        import { defineRouteConfig } from "@medusajs/admin-sdk"

        const Page = () => {
            return <div>First</div>
        }

        export const config = defineRouteConfig({
            label: "First",
            rank: 1,
        })

        export default Page
      `,
      `
        import { defineRouteConfig } from "@medusajs/admin-sdk"

        const Page = () => {
            return <div>Second</div>
        }

        export const config = defineRouteConfig({
            label: "Second",
        })

        export default Page
      `,
      `
        import { defineRouteConfig } from "@medusajs/admin-sdk"

        const Page = () => {
            return <div>Third</div>
        }

        export const config = defineRouteConfig({
            label: "Third",
            rank: 0,
        })

        export default Page
      `,
    ]

    vi.mocked(utils.crawl).mockResolvedValue(mockMixedFiles)

    vi.mocked(fs.readFile).mockImplementation(async (file) =>
      Promise.resolve(mockMixedContents[mockMixedFiles.indexOf(file as string)])
    )

    const result = await generateMenuItems(
      new Set(["Users/user/medusa/src/admin"])
    )

    const expectedMixedMenuItems = `
      menuItems: [
        {
          label: RouteConfig0.label,
          icon: undefined,
          path: "/first",
          nested: undefined,
          rank: 1,
          translationNs: undefined
        },
        {
          label: RouteConfig1.label,
          icon: undefined,
          path: "/second",
          nested: undefined,
          rank: undefined,
          translationNs: undefined
        },
        {
          label: RouteConfig2.label,
          icon: undefined,
          path: "/third",
          nested: undefined,
          rank: 0,
          translationNs: undefined
        }
      ]
    `

    expect(utils.normalizeString(result.code)).toEqual(
      utils.normalizeString(expectedMixedMenuItems)
    )
  })
})
