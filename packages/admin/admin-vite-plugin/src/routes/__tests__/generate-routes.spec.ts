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
            handle: { label: HandleConfig0.label, translationNs: HandleConfig0.translationNs }
        },
        {
            Component: RouteComponent1,
            path: "/two",
            handle: { label: HandleConfig1.label, translationNs: HandleConfig1.translationNs }
        }
    ]
`

const mockFileContentsWithParallel = [
  // Parent route
  `
    import { defineRouteConfig } from "@medusajs/admin-sdk"
    const Page = () => {
        return <div>Brands</div>
    }
    export const config = defineRouteConfig({
        label: "Brands",
    })
    export default Page
  `,
  // Parallel route
  `
    import { defineRouteConfig } from "@medusajs/admin-sdk"
    const Page = () => {
        return <div>Create Brand</div>
    }
    export const config = defineRouteConfig({
        label: "Create Brand",
    })
    export default Page
  `,
]

const expectedRoutesWithParallel = `
    routes: [
        {
            Component: RouteComponent0,
            path: "/brands",
            handle: { label: HandleConfig0.label, translationNs: HandleConfig0.translationNs },
            children: [
                {
                    Component: RouteComponent1,
                    path: "/brands/create",
                    handle: { label: HandleConfig1.label, translationNs: HandleConfig1.translationNs }
                }
            ]
        }
    ]
`

const mockFileContentsWithHandleLoader = [
  `
    import { defineRouteConfig } from "@medusajs/admin-sdk"

    const Page = () => {
        return <div>Page 1</div>
    }

    export const handle = {
      someConfig: true
    }

    export const loader = async () => {
      return { data: true }
    }

    export const config = defineRouteConfig({
        label: "Page 1",
    })

    export default Page
  `,
  `
    import { defineRouteConfig } from "@medusajs/admin-sdk"

    const Page = () => {
        return <div>Page 2</div>
    }

    export async function loader() {
      return { data: true }
    }

    export const config = defineRouteConfig({
        label: "Page 2",
    })

    export default Page
  `,
]

const expectedRoutesWithHandleLoader = `
  routes: [
    {
      Component: RouteComponent0,
      path: "/one",
      handle: { label: HandleConfig0.label, translationNs: HandleConfig0.translationNs, ...handle0 },
      loader: loader0
    },
    {
      Component: RouteComponent1,
      path: "/two",
      handle: { label: HandleConfig1.label, translationNs: HandleConfig1.translationNs },
      loader: loader1
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
  it("should handle parallel routes", async () => {
    const mockFiles = [
      "Users/user/medusa/src/admin/routes/brands/page.tsx",
      "Users/user/medusa/src/admin/routes/brands/@create/page.tsx",
    ]
    vi.mocked(utils.crawl).mockResolvedValue(mockFiles)

    vi.mocked(fs.readFile).mockImplementation(async (file) =>
      Promise.resolve(
        mockFileContentsWithParallel[mockFiles.indexOf(file as string)]
      )
    )

    vi.mocked(fs.stat).mockRejectedValue(new Error("File not found"))

    const result = await generateRoutes(
      new Set(["Users/user/medusa/src/admin"])
    )
    expect(utils.normalizeString(result.code)).toEqual(
      utils.normalizeString(expectedRoutesWithParallel)
    )
  })
  it("should handle parallel routes with windows paths", async () => {
    const mockFiles = [
      "C:\\medusa\\src\\admin\\routes\\brands\\page.tsx",
      "C:\\medusa\\src\\admin\\routes\\brands\\@create\\page.tsx",
    ]
    vi.mocked(utils.crawl).mockResolvedValue(mockFiles)

    vi.mocked(fs.readFile).mockImplementation(async (file) =>
      Promise.resolve(
        mockFileContentsWithParallel[mockFiles.indexOf(file as string)]
      )
    )

    vi.mocked(fs.stat).mockRejectedValue(new Error("File not found"))

    const result = await generateRoutes(new Set(["C:\\medusa\\src\\admin"]))

    expect(utils.normalizeString(result.code)).toEqual(
      utils.normalizeString(expectedRoutesWithParallel)
    )
  })
  it("should handle routes with handle and loader exports", async () => {
    const mockFiles = [
      "Users/user/medusa/src/admin/routes/one/page.tsx",
      "Users/user/medusa/src/admin/routes/two/page.tsx",
    ]
    vi.mocked(utils.crawl).mockResolvedValue(mockFiles)

    vi.mocked(fs.readFile).mockImplementation(async (file) =>
      Promise.resolve(
        mockFileContentsWithHandleLoader[mockFiles.indexOf(file as string)]
      )
    )

    vi.mocked(fs.stat).mockRejectedValue(new Error("File not found"))

    const result = await generateRoutes(
      new Set(["Users/user/medusa/src/admin"])
    )

    expect(utils.normalizeString(result.code)).toEqual(
      utils.normalizeString(expectedRoutesWithHandleLoader)
    )
  })
})
