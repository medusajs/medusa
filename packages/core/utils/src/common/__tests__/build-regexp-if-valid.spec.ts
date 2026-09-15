import { buildRegexpIfValid } from "../build-regexp-if-valid"

describe("buildRegexpIfValid", function () {
  it("should return either a regexp or undefined", () => {
    expect(buildRegexpIfValid("abc")).not.toBeDefined()
    expect(buildRegexpIfValid("/abc/")).toBeTruthy()
    expect(buildRegexpIfValid("/ab#/[c]/ig")).toBeTruthy()
    expect(buildRegexpIfValid("@ab#/[c]@ig")).toBeTruthy()
    expect(buildRegexpIfValid("/ab/[c/ig")).not.toBeDefined()
    expect(buildRegexpIfValid("/abc/gig")).not.toBeDefined()
  })

  it("should strip the global and sticky flags to keep the regexp stateless", () => {
    expect(buildRegexpIfValid("/abc/g")?.flags).toBe("")
    expect(buildRegexpIfValid("/abc/y")?.flags).toBe("")
    expect(buildRegexpIfValid("/abc/gy")?.flags).toBe("")
    expect(buildRegexpIfValid("/abc/gimy")?.flags).toBe("im")
  })

  it("should not alternate between match and no-match on repeated test() calls", () => {
    const regexp = buildRegexpIfValid("/abc/g")!

    expect(regexp.test("abc")).toBe(true)
    expect(regexp.test("abc")).toBe(true)
    expect(regexp.test("abc")).toBe(true)
  })
})
