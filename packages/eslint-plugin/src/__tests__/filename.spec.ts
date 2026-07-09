import { isPathInsideOrEqual } from "../util/filename"

describe("filename utilities", () => {
  it("compares paths after normalizing separators", () => {
    expect(
      isPathInsideOrEqual(
        "C:\\repo\\src\\modules\\company\\models\\office.ts",
        "C:\\repo\\src\\modules\\company"
      )
    ).toBe(true)
  })

  it("does not match sibling paths with the same prefix", () => {
    expect(
      isPathInsideOrEqual(
        "/repo/src/modules/company-old",
        "/repo/src/modules/company"
      )
    ).toBe(false)
  })
})
