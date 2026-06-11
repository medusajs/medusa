import { shouldIgnoreFile } from "../compiler-utils"

const projectIgnorePatterns = ["src/admin"]

describe("shouldIgnoreFile", () => {
  describe("convention-based test directories", () => {
    it.each([
      ["src/test/foo.ts", "test/"],
      ["src/tests/foo.ts", "tests/"],
      ["src/__tests__/foo.spec.ts", "__tests__/"],
      ["src/__test__/foo.spec.ts", "__test__/"],
      ["src/unit-tests/bar.ts", "unit-tests/"],
      ["src/unit-test/bar.ts", "unit-test/"],
      ["src/integration-tests/api/test.ts", "integration-tests/"],
      ["src/integration-test/api/test.ts", "integration-test/"],
      ["src/e2e-tests/checkout.ts", "e2e-tests/"],
      ["src/e2e-test/checkout.ts", "e2e-test/"],
      ["deep/nested/test/file.ts", "deeply nested test/"],
      ["test/root-level.ts", "test/ at root"],
      ["__tests__/root-level.spec.ts", "__tests__/ at root"],
    ])("ignores %s (%s directory)", (filePath) => {
      expect(shouldIgnoreFile(filePath, projectIgnorePatterns)).toBe(true)
    })
  })

  describe("project-specific ignore patterns", () => {
    it.each([
      ["src/admin/widgets/foo.ts", "src/admin/ widget"],
      ["src/admin/routes/products/page.tsx", "src/admin/ route"],
    ])("ignores %s (%s)", (filePath) => {
      expect(shouldIgnoreFile(filePath, projectIgnorePatterns)).toBe(true)
    })

    it("does not ignore admin outside src/", () => {
      expect(shouldIgnoreFile("lib/admin/util.ts", projectIgnorePatterns)).toBe(
        false
      )
    })
  })

  describe("files with test substring that must NOT be ignored", () => {
    it.each([
      ["src/scripts/reset-test-vendor-password.ts", "test in filename"],
      ["src/scripts/seed-test-accounts.ts", "test in filename"],
      ["src/api/contest/route.ts", "contest contains test"],
      ["src/testutils/helper.ts", "testutils is not test/"],
      ["src/latest/handler.ts", "latest contains test"],
      ["src/models/attestation.ts", "attestation contains test"],
      ["src/services/protest-service.ts", "protest contains test"],
      ["src/utils/detest.ts", "detest contains test"],
    ])("keeps %s (%s)", (filePath) => {
      expect(shouldIgnoreFile(filePath, projectIgnorePatterns)).toBe(false)
    })
  })

  describe("edge cases", () => {
    it("handles empty ignore patterns", () => {
      expect(shouldIgnoreFile("src/test/foo.ts", [])).toBe(true)
    })

    it("handles file at root level", () => {
      expect(shouldIgnoreFile("app.ts", [])).toBe(false)
    })

    it("does not match partial segment names", () => {
      expect(shouldIgnoreFile("src/testing/foo.ts", [])).toBe(false)
    })

    it("does not match test as a file name", () => {
      expect(shouldIgnoreFile("src/test.ts", [])).toBe(false)
    })

    it("matches multi-segment project patterns correctly", () => {
      const patterns = ["src/generated/api"]
      expect(shouldIgnoreFile("src/generated/api/client.ts", patterns)).toBe(
        true
      )
      expect(shouldIgnoreFile("src/generated/types.ts", patterns)).toBe(false)
      expect(shouldIgnoreFile("other/generated/api/client.ts", patterns)).toBe(
        false
      )
    })
  })
})
