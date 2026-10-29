import { describe, expect, it } from "@jest/globals"
import { getCodemod, listCodemods } from "../index"

describe("Codemod dispatcher", () => {
  describe("listCodemods", () => {
    it("should return array of available codemod names", () => {
      const codemods = listCodemods()
      expect(Array.isArray(codemods)).toBe(true)
      expect(codemods.length).toBeGreaterThan(0)
      expect(codemods).toContain("replace-zod-imports")
    })
  })

  describe("getCodemod", () => {
    it("should return codemod for valid name", () => {
      const codemod = getCodemod("replace-zod-imports")
      expect(codemod).not.toBeNull()
      expect(codemod?.name).toBe("replace-zod-imports")
      expect(codemod?.description).toBeTruthy()
      expect(typeof codemod?.run).toBe("function")
    })

    it("should return null for invalid codemod name", () => {
      const codemod = getCodemod("non-existent-codemod")
      expect(codemod).toBeNull()
    })

    it("should return codemod with correct interface", () => {
      const codemod = getCodemod("replace-zod-imports")
      expect(codemod).toHaveProperty("name")
      expect(codemod).toHaveProperty("description")
      expect(codemod).toHaveProperty("run")
    })
  })
})
