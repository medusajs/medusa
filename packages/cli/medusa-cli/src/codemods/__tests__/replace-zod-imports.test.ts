import fs from "fs"
import path from "path"
import { afterEach, beforeEach, describe, expect, it } from "@jest/globals"
import replaceZodImports from "../replace-zod-imports"

describe("replace-zod-imports codemod", () => {
  const tempDir = path.join(__dirname, "temp-test-codemod")
  let originalCwd: string

  beforeEach(() => {
    // Save original working directory
    originalCwd = process.cwd()

    // Create temp directory for test files
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true })
    }
    fs.mkdirSync(tempDir, { recursive: true })

    // Change to temp directory so codemod runs there
    process.chdir(tempDir)
  })

  afterEach(() => {
    // Restore original working directory
    process.chdir(originalCwd)

    // Clean up temp directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true })
    }
  })

  describe("codemod metadata", () => {
    it("should have correct name and description", () => {
      expect(replaceZodImports.name).toBe("replace-zod-imports")
      expect(replaceZodImports.description).toBeTruthy()
      expect(typeof replaceZodImports.run).toBe("function")
    })
  })

  describe("named import transformations", () => {
    it("should transform named imports from zod", async () => {
      const testFile = path.join(tempDir, "test1.ts")
      fs.writeFileSync(testFile, `import { z, ZodSchema } from "zod"`)

      await replaceZodImports.run({ dryRun: false })

      const result = fs.readFileSync(testFile, "utf8")
      expect(result).toBe(
        `import { z, ZodSchema } from "@medusajs/framework/zod"`
      )
    })

    it("should transform named imports with single quotes", async () => {
      const testFile = path.join(tempDir, "test2.ts")
      fs.writeFileSync(testFile, `import { z } from 'zod'`)

      await replaceZodImports.run({ dryRun: false })

      const result = fs.readFileSync(testFile, "utf8")
      expect(result).toBe(`import { z } from "@medusajs/framework/zod"`)
    })
  })

  describe("default import transformations", () => {
    it("should transform default imports with identifier zod to aliased named imports", async () => {
      const testFile = path.join(tempDir, "test3.ts")
      fs.writeFileSync(testFile, `import zod from "zod"`)

      await replaceZodImports.run({ dryRun: false })

      const result = fs.readFileSync(testFile, "utf8")
      expect(result).toBe(`import { z as zod } from "@medusajs/framework/zod"`)
    })

    it("should transform default imports with identifier z to named imports", async () => {
      const testFile = path.join(tempDir, "test3b.ts")
      fs.writeFileSync(testFile, `import z from "zod"`)

      await replaceZodImports.run({ dryRun: false })

      const result = fs.readFileSync(testFile, "utf8")
      expect(result).toBe(`import { z } from "@medusajs/framework/zod"`)
    })
  })

  describe("namespace import transformations", () => {
    it("should transform namespace imports with identifier z", async () => {
      const testFile = path.join(tempDir, "test4.ts")
      fs.writeFileSync(testFile, `import * as z from "zod"`)

      await replaceZodImports.run({ dryRun: false })

      const result = fs.readFileSync(testFile, "utf8")
      expect(result).toBe(`import { z as z } from "@medusajs/framework/zod"`)
    })

    it("should transform namespace imports with custom identifier", async () => {
      const testFile = path.join(tempDir, "test4b.ts")
      fs.writeFileSync(testFile, `import * as validator from "zod"`)

      await replaceZodImports.run({ dryRun: false })

      const result = fs.readFileSync(testFile, "utf8")
      expect(result).toBe(
        `import { z as validator } from "@medusajs/framework/zod"`
      )
    })

    it("should transform namespace imports with zod identifier", async () => {
      const testFile = path.join(tempDir, "test4c.ts")
      fs.writeFileSync(testFile, `import * as zod from "zod"`)

      await replaceZodImports.run({ dryRun: false })

      const result = fs.readFileSync(testFile, "utf8")
      expect(result).toBe(`import { z as zod } from "@medusajs/framework/zod"`)
    })
  })

  describe("type import transformations", () => {
    it("should transform type imports", async () => {
      const testFile = path.join(tempDir, "test5.ts")
      fs.writeFileSync(testFile, `import type { ZodSchema } from "zod"`)

      await replaceZodImports.run({ dryRun: false })

      const result = fs.readFileSync(testFile, "utf8")
      expect(result).toBe(
        `import type { ZodSchema } from "@medusajs/framework/zod"`
      )
    })
  })

  describe("require statement transformations", () => {
    it("should transform require statements", async () => {
      const testFile = path.join(tempDir, "test6.js")
      fs.writeFileSync(testFile, `const zod = require("zod")`)

      await replaceZodImports.run({ dryRun: false })

      const result = fs.readFileSync(testFile, "utf8")
      expect(result).toBe(`const zod = require("@medusajs/framework/zod")`)
    })

    it("should transform require with single quotes", async () => {
      const testFile = path.join(tempDir, "test7.js")
      fs.writeFileSync(testFile, `const z = require('zod')`)

      await replaceZodImports.run({ dryRun: false })

      const result = fs.readFileSync(testFile, "utf8")
      expect(result).toBe(`const z = require("@medusajs/framework/zod")`)
    })
  })

  describe("multiple imports in one file", () => {
    it("should handle multiple zod imports", async () => {
      const testFile = path.join(tempDir, "test8.ts")
      const content = `import { z } from "zod"
import { something } from "other-package"
import type { ZodSchema } from "zod"
const zodRequire = require("zod")`
      fs.writeFileSync(testFile, content)

      await replaceZodImports.run({ dryRun: false })

      const result = fs.readFileSync(testFile, "utf8")
      const expected = `import { z } from "@medusajs/framework/zod"
import { something } from "other-package"
import type { ZodSchema } from "@medusajs/framework/zod"
const zodRequire = require("@medusajs/framework/zod")`
      expect(result).toBe(expected)
    })
  })

  describe("dry-run mode", () => {
    it("should not modify files in dry-run mode", async () => {
      const testFile = path.join(tempDir, "test9.ts")
      const originalContent = `import { z } from "zod"`
      fs.writeFileSync(testFile, originalContent)

      const result = await replaceZodImports.run({ dryRun: true })

      const afterContent = fs.readFileSync(testFile, "utf8")
      expect(afterContent).toBe(originalContent)
      expect(result.filesModified).toBeGreaterThan(0)
      expect(result.errors).toBe(0)
    })
  })

  describe("files without zod imports", () => {
    it("should not modify files without zod imports", async () => {
      const testFile = path.join(tempDir, "test10.ts")
      const originalContent = `import { something } from "other-package"`
      fs.writeFileSync(testFile, originalContent)

      await replaceZodImports.run({ dryRun: false })

      const afterContent = fs.readFileSync(testFile, "utf8")
      expect(afterContent).toBe(originalContent)
    })

    it("should not modify partial matches like zodiac", async () => {
      const testFile = path.join(tempDir, "test11.ts")
      const originalContent = `import { something } from "zodiac"`
      fs.writeFileSync(testFile, originalContent)

      await replaceZodImports.run({ dryRun: false })

      const afterContent = fs.readFileSync(testFile, "utf8")
      expect(afterContent).toBe(originalContent)
    })
  })

  describe("multiple files", () => {
    it("should handle multiple files with different extensions", async () => {
      const file1 = path.join(tempDir, "file1.ts")
      const file2 = path.join(tempDir, "file2.js")
      const file3 = path.join(tempDir, "file3.tsx")

      fs.writeFileSync(file1, `import { z } from "zod"`)
      fs.writeFileSync(file2, `const z = require("zod")`)
      fs.writeFileSync(file3, `import type { ZodType } from "zod"`)

      const result = await replaceZodImports.run({ dryRun: false })

      expect(fs.readFileSync(file1, "utf8")).toBe(
        `import { z } from "@medusajs/framework/zod"`
      )
      expect(fs.readFileSync(file2, "utf8")).toBe(
        `const z = require("@medusajs/framework/zod")`
      )
      expect(fs.readFileSync(file3, "utf8")).toBe(
        `import type { ZodType } from "@medusajs/framework/zod"`
      )
      expect(result.filesModified).toBeGreaterThanOrEqual(3)
      expect(result.errors).toBe(0)
    })
  })

  describe("result reporting", () => {
    it("should return correct counts", async () => {
      const file1 = path.join(tempDir, "count1.ts")
      const file2 = path.join(tempDir, "count2.ts")
      const file3 = path.join(tempDir, "no-zod.ts")

      fs.writeFileSync(file1, `import { z } from "zod"`)
      fs.writeFileSync(file2, `import { z } from "zod"`)
      fs.writeFileSync(file3, `import { x } from "other"`)

      const result = await replaceZodImports.run({ dryRun: false })

      expect(result.filesScanned).toBeGreaterThanOrEqual(2)
      expect(result.filesModified).toBeGreaterThanOrEqual(2)
      expect(result.errors).toBe(0)
    })

    it("should return zero counts when no files have zod imports", async () => {
      const testFile = path.join(tempDir, "empty.ts")
      fs.writeFileSync(testFile, `import { x } from "other"`)

      const result = await replaceZodImports.run({ dryRun: false })

      expect(result.filesScanned).toBe(0)
      expect(result.filesModified).toBe(0)
      expect(result.errors).toBe(0)
    })
  })

  describe("file formatting preservation", () => {
    it("should preserve whitespace and comments", async () => {
      const testFile = path.join(tempDir, "formatted.ts")
      const content = `// Header comment
import { z } from "zod"

// Function comment
export function validate() {
  return z.string()
}`
      fs.writeFileSync(testFile, content)

      await replaceZodImports.run({ dryRun: false })

      const result = fs.readFileSync(testFile, "utf8")
      const expected = `// Header comment
import { z } from "@medusajs/framework/zod"

// Function comment
export function validate() {
  return z.string()
}`
      expect(result).toBe(expected)
    })
  })

  describe("directory exclusions", () => {
    it("should ignore files in src/admin directories", async () => {
      const adminDir = path.join(tempDir, "src", "admin")
      fs.mkdirSync(adminDir, { recursive: true })

      const adminFile = path.join(adminDir, "admin-component.tsx")
      const originalContent = `import { z } from "zod"`
      fs.writeFileSync(adminFile, originalContent)

      const regularFile = path.join(tempDir, "regular-file.ts")
      fs.writeFileSync(regularFile, `import { z } from "zod"`)

      const result = await replaceZodImports.run({ dryRun: false })

      // Admin file should not be modified
      const adminContent = fs.readFileSync(adminFile, "utf8")
      expect(adminContent).toBe(originalContent)

      // Regular file should be modified
      const regularContent = fs.readFileSync(regularFile, "utf8")
      expect(regularContent).toBe(`import { z } from "@medusajs/framework/zod"`)

      // Result should only count the regular file
      expect(result.filesModified).toBe(1)
    })
  })
})
