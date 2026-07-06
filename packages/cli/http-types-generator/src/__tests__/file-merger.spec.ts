import { mkdtempSync, writeFileSync, rmSync } from "fs"
import { join } from "path"
import { tmpdir } from "os"
import { FileMerger } from "../utils/file-merger"
import { ImportTracker } from "../core/import-tracker"
import type { EmittedInterface } from "../core/type-emitter"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeInterfaces(...names: string[]): EmittedInterface[] {
  return names.map((name) => ({
    name,
    code: `export interface ${name} {\n  id: string\n}`,
  }))
}

function emptyTracker(): ImportTracker {
  return new ImportTracker()
}

// ---------------------------------------------------------------------------
// FileMerger.resolveFileContent
// ---------------------------------------------------------------------------

describe("FileMerger.resolveFileContent", () => {
  let merger: FileMerger
  let tmpDir: string

  beforeEach(() => {
    merger = new FileMerger()
    tmpDir = mkdtempSync(join(tmpdir(), "file-merger-test-"))
  })

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true })
  })

  function writeFixture(filename: string, content: string): string {
    const filepath = join(tmpDir, filename)
    writeFileSync(filepath, content, "utf-8")
    return filepath
  }

  // -------------------------------------------------------------------------
  // Skipping already-declared export interface blocks
  // -------------------------------------------------------------------------

  describe("skipping existing export interface declarations", () => {
    it("returns 'skipped' when all interfaces are already present", async () => {
      const file = writeFixture(
        "payloads.ts",
        `export interface AdminAcceptInvite {\n  email?: string | null | undefined\n}\n\nexport interface AdminCreateInvite {\n  email: string\n}\n`
      )

      const result = await merger.resolveFileContent(
        file,
        makeInterfaces("AdminAcceptInvite", "AdminCreateInvite"),
        emptyTracker(),
        false
      )

      expect(result.status).toBe("skipped")
      expect(result.added).toBe(0)
    })

    it("returns 'updated' when only some interfaces are already present", async () => {
      const file = writeFixture(
        "payloads.ts",
        `export interface AdminAcceptInvite {\n  email?: string | null | undefined\n}\n`
      )

      const result = await merger.resolveFileContent(
        file,
        makeInterfaces("AdminAcceptInvite", "AdminCreateInvite"),
        emptyTracker(),
        false
      )

      expect(result.status).toBe("updated")
      expect(result.added).toBe(1)
      expect(result.content).toContain("AdminCreateInvite")
    })
  })

  // -------------------------------------------------------------------------
  // Bug fix: non-exported interface declarations must also block re-generation
  // -------------------------------------------------------------------------

  describe("skipping non-exported interface declarations", () => {
    it("returns 'skipped' when all names exist as non-exported interfaces", async () => {
      // Simulates helper interfaces like `interface AdminBatchUpdateProduct`
      // in packages/core/types/src/http/product/admin/payloads.ts
      const file = writeFixture(
        "payloads.ts",
        [
          "interface AdminBatchUpdateProduct {",
          "  id: string",
          "}",
          "",
        ].join("\n")
      )

      const result = await merger.resolveFileContent(
        file,
        makeInterfaces("AdminBatchUpdateProduct"),
        emptyTracker(),
        false
      )

      expect(result.status).toBe("skipped")
      expect(result.added).toBe(0)
    })

    it("does not append a duplicate when a non-exported interface already exists", async () => {
      const file = writeFixture(
        "payloads.ts",
        [
          "interface AdminBatchUpdateProduct {",
          "  id: string",
          "}",
          "",
          "export interface AdminCreateProduct {",
          "  title: string",
          "}",
          "",
        ].join("\n")
      )

      const result = await merger.resolveFileContent(
        file,
        makeInterfaces("AdminBatchUpdateProduct", "AdminCreateProduct"),
        emptyTracker(),
        false
      )

      expect(result.status).toBe("skipped")
      expect(result.added).toBe(0)
    })
  })

  // -------------------------------------------------------------------------
  // Bug fix: export type aliases must also block re-generation
  // -------------------------------------------------------------------------

  describe("skipping existing export type aliases (bug fix)", () => {
    it("returns 'skipped' when all names exist as export type aliases", async () => {
      // Simulates packages/core/types/src/http/invite/admin/payloads.ts where
      // types were hand-written as `export type Foo = { ... }`. Previously the
      // merger would append duplicate `export interface Foo` blocks.
      const file = writeFixture(
        "payloads.ts",
        [
          "export type AdminAcceptInvite = {",
          "  email?: string | null",
          "  first_name?: string | null",
          "  last_name?: string | null",
          "}",
          "",
          "export type AdminCreateInvite = {",
          "  email: string",
          "  roles?: string[] | null",
          "  metadata?: Record<string, unknown> | null",
          "}",
          "",
        ].join("\n")
      )

      const result = await merger.resolveFileContent(
        file,
        makeInterfaces("AdminAcceptInvite", "AdminCreateInvite"),
        emptyTracker(),
        false
      )

      expect(result.status).toBe("skipped")
      expect(result.added).toBe(0)
    })

    it("does not append a duplicate export interface when export type already exists", async () => {
      const file = writeFixture(
        "payloads.ts",
        [
          "export type AdminAcceptInvite = {",
          "  email?: string | null",
          "}",
          "",
        ].join("\n")
      )

      const result = await merger.resolveFileContent(
        file,
        makeInterfaces("AdminAcceptInvite"),
        emptyTracker(),
        false
      )

      // Must not produce a duplicate interface named "skip" or a second AdminAcceptInvite block
      expect(result.status).toBe("skipped")
      expect(result.content).not.toContain("export interface AdminAcceptInvite")
    })

    it("only adds interfaces whose names are absent (mixed type alias / interface file)", async () => {
      // File has AdminAcceptInvite as a type alias but AdminCreateInvite is missing
      const file = writeFixture(
        "payloads.ts",
        [
          "export type AdminAcceptInvite = {",
          "  email?: string | null",
          "}",
          "",
        ].join("\n")
      )

      const result = await merger.resolveFileContent(
        file,
        makeInterfaces("AdminAcceptInvite", "AdminCreateInvite"),
        emptyTracker(),
        false
      )

      expect(result.status).toBe("updated")
      expect(result.added).toBe(1)
      expect(result.content).toContain("AdminCreateInvite")
      // Original export type must still be present
      expect(result.content).toContain("AdminAcceptInvite")
      // Must NOT introduce a duplicate interface declaration for AdminAcceptInvite
      expect(result.content).not.toContain("export interface AdminAcceptInvite")
    })
  })
})
