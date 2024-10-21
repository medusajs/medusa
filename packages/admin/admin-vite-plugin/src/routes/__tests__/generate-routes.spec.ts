import { describe, expect, it, vi } from "vitest"

import fs from "fs/promises"
import * as utils from "../../utils"
import { generateRoutes } from "../generate-routes"

// Mock the dependencies
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
    stat: vi.fn(),
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

const expectedRoutesWithoutLoaders = `
    routes: [
        {
            Component: RouteComponent0,
            path: "/one",
        },
        {
            Component: RouteComponent1,
            path: "/two",
        }
    ]
`

describe("generateRoutes", () => {
  it("should generate routes", async () => {
    const mockFiles = [
      "Users/user/medusa/src/admin/routes/one/page.tsx",
      "Users/user/medusa/src/admin/routes/two/page.tsx",
    ]
    vi.mocked(utils.crawl).mockResolvedValue(mockFiles)

    vi.mocked(fs.readFile).mockImplementation(async (file) =>
      Promise.resolve(mockFileContents[mockFiles.indexOf(file as string)])
    )

    vi.mocked(fs.stat).mockRejectedValue(new Error("File not found"))

    const result = await generateRoutes(
      new Set(["Users/user/medusa/src/admin"])
    )
    expect(utils.normalizeString(result.code)).toEqual(
      utils.normalizeString(expectedRoutesWithoutLoaders)
    )
  })
  it("should handle windows paths", async () => {
    const mockFiles = [
      "C:\\medusa\\src\\admin\\routes\\one\\page.tsx",
      "C:\\medusa\\src\\admin\\routes\\two\\page.tsx",
    ]
    vi.mocked(utils.crawl).mockResolvedValue(mockFiles)

    vi.mocked(fs.readFile).mockImplementation(async (file) =>
      Promise.resolve(mockFileContents[mockFiles.indexOf(file as string)])
    )

    vi.mocked(fs.stat).mockRejectedValue(new Error("File not found"))

    const result = await generateRoutes(new Set(["C:\\medusa\\src\\admin"]))

    expect(utils.normalizeString(result.code)).toEqual(
      utils.normalizeString(expectedRoutesWithoutLoaders)
    )
  })
})
