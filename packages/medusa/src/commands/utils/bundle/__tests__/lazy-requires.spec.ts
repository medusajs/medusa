import { usedOnlyThroughMembers } from "../bundle-backend"

describe("usedOnlyThroughMembers", () => {
  it("accepts property access only", () => {
    expect(
      usedOnlyThroughMembers(
        "utils_1",
        `(0, utils_1.isDefined)(x); utils_1?.foo; utils_1["bar"];`
      )
    ).toBe(true)
  })

  it("rejects calls and constructors", () => {
    // `import express = require("express")` compiles to a bare require
    expect(usedOnlyThroughMembers("express", "const app = express();")).toBe(
      false
    )
    expect(usedOnlyThroughMembers("Redis", "new Redis(url)")).toBe(false)
    expect(usedOnlyThroughMembers("cb", "cb?.()")).toBe(false)
  })

  it("rejects the binding used as a value", () => {
    expect(usedOnlyThroughMembers("helmet", "app.use(helmet)")).toBe(false)
    expect(usedOnlyThroughMembers("Foo", "x instanceof Foo")).toBe(false)
    expect(usedOnlyThroughMembers("mod", "typeof mod")).toBe(false)
  })

  it("ignores other identifiers containing the name", () => {
    expect(
      usedOnlyThroughMembers("express", "express_1.default(); obj.express()")
    ).toBe(true)
  })
})
