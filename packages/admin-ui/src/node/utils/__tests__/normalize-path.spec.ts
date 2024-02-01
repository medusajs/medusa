import path from "path"
import { normalizePath } from "../normalize-path"

describe("normalize path", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("normalizePath", () => {
    it("should normalize a file path", async () => {
      const testPath = path.join("/", "custom", "page.tsx")

      const result = normalizePath(testPath)

      expect(result).toEqual("/custom/page.tsx")
    })

    it("should normalize a file path with brackets", async () => {
      const testPath = path.join("/", "custom", "[id]", "page.tsx")

      const result = normalizePath(testPath)

      expect(result).toEqual("/custom/[id]/page.tsx")
    })
  })

  describe("test windows platform", () => {
    const originalPlatform = process.platform

    beforeAll(() => {
      Object.defineProperty(process, "platform", {
        value: "win32",
      })
    })

    afterAll(() => {
      Object.defineProperty(process, "platform", {
        value: originalPlatform,
      })
    })

    it("should normalize a file path on Windows", async () => {
      const testPath = path.win32.join("/", "custom", "page.tsx")

      const result = normalizePath(testPath)

      expect(result).toEqual("/custom/page.tsx")
    })

    it("should normalize a file path with brackets on Windows", async () => {
      const testPath = path.win32.join("/", "custom", "[id]", "page.tsx")

      const result = normalizePath(testPath)

      expect(result).toEqual("/custom/[id]/page.tsx")
    })
  })
})
