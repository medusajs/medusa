import path from "path"
import { shouldIgnoreFile } from "../compiler"

const SEP = path.sep

// Normalise a POSIX-style path to the platform separator so tests are
// portable between Unix and Windows.
const p = (...parts: string[]) => parts.join(SEP)

describe("shouldIgnoreFile", () => {
  const ignoreList = ["integration-tests", "test", "unit-tests", "src/admin"]

  // ── files that MUST be excluded ─────────────────────────────────────────
  describe("excludes files inside ignored directories", () => {
    it("excludes a file directly inside test/", () => {
      expect(shouldIgnoreFile(p("test", "foo.ts"), ignoreList)).toBe(true)
    })

    it("excludes a file nested inside test/", () => {
      expect(shouldIgnoreFile(p("test", "helpers", "bar.ts"), ignoreList)).toBe(
        true
      )
    })

    it("excludes a file inside unit-tests/", () => {
      expect(
        shouldIgnoreFile(p("unit-tests", "services", "order.spec.ts"), ignoreList)
      ).toBe(true)
    })

    it("excludes a file inside integration-tests/", () => {
      expect(
        shouldIgnoreFile(
          p("integration-tests", "__tests__", "cart.spec.ts"),
          ignoreList
        )
      ).toBe(true)
    })

    it("excludes a file inside src/admin/", () => {
      expect(
        shouldIgnoreFile(p("src", "admin", "routes", "page.tsx"), ignoreList)
      ).toBe(true)
    })
  })

  // ── files that MUST be included (regression cases from the bug report) ──
  describe("includes files whose name contains 'test' but are not inside an ignored directory", () => {
    it("includes src/scripts/reset-test-vendor-password.ts", () => {
      expect(
        shouldIgnoreFile(
          p("src", "scripts", "reset-test-vendor-password.ts"),
          ignoreList
        )
      ).toBe(false)
    })

    it("includes src/scripts/seed-test-accounts.ts", () => {
      expect(
        shouldIgnoreFile(p("src", "scripts", "seed-test-accounts.ts"), ignoreList)
      ).toBe(false)
    })

    it("includes src/scripts/my-test-helper.ts", () => {
      expect(
        shouldIgnoreFile(p("src", "scripts", "my-test-helper.ts"), ignoreList)
      ).toBe(false)
    })

    it("includes a top-level file with 'test' in the name", () => {
      expect(shouldIgnoreFile("contest-results.ts", ignoreList)).toBe(false)
    })

    it("includes src/subscribers/test-order-subscriber.ts", () => {
      expect(
        shouldIgnoreFile(
          p("src", "subscribers", "test-order-subscriber.ts"),
          ignoreList
        )
      ).toBe(false)
    })
  })

  // ── edge cases ───────────────────────────────────────────────────────────
  describe("edge cases", () => {
    it("returns false for a normal source file", () => {
      expect(
        shouldIgnoreFile(p("src", "workflows", "create-order.ts"), ignoreList)
      ).toBe(false)
    })

    it("returns false when chunksToIgnore is empty", () => {
      expect(shouldIgnoreFile(p("test", "foo.ts"), [])).toBe(false)
    })

    it("does not confuse a directory named 'testutils' with 'test'", () => {
      expect(
        shouldIgnoreFile(p("src", "testutils", "helpers.ts"), ignoreList)
      ).toBe(false)
    })
  })
})
