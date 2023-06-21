import path from "path"
import { createPath } from "../validate-extensions"

describe("validate extensions", () => {
  beforeEach(function () {
    jest.clearAllMocks()
  })

  describe("createPath", () => {
    it("should return a URL path", async () => {
      const testPath = path.join("/", "custom", "page.tsx")

      const result = createPath(testPath)

      expect(result).toEqual("/custom")
    })

    it("should return a URL path with a parameter", async () => {
      const testPath = path.join("/", "custom", "[id]", "page.tsx")

      const result = createPath(testPath)

      expect(result).toEqual("/custom/:id")
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

    describe("createPath", () => {
      it("should return a URL path on Windows", async () => {
        const testPath = path.win32.join("/", "custom", "page.tsx")

        const result = createPath(testPath)

        expect(result).toEqual("/custom")
      })

      it("should return a URL path with a parameter on Windows", async () => {
        const testPath = path.win32.join("/", "custom", "[id]", "page.tsx")

        const result = createPath(testPath)

        expect(result).toEqual("/custom/:id")
      })
    })
  })
})
