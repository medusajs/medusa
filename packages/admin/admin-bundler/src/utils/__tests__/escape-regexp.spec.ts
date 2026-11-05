import { describe, expect, it } from "vitest"

import { escapeRegExp } from "../escape-regexp"

describe("escapeRegExp", () => {
  it("escapes every regex special character", () => {
    expect(escapeRegExp(".*+?^${}()|[]\\")).toBe(
      "\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\"
    )
  })

  it("leaves package name characters that aren't special untouched", () => {
    expect(escapeRegExp("@medusajs/js-sdk")).toBe("@medusajs/js-sdk")
  })

  it("makes a dot match only a literal dot", () => {
    const pattern = new RegExp(`^${escapeRegExp("bignumber.js")}$`)

    expect(pattern.test("bignumber.js")).toBe(true)
    expect(pattern.test("bignumberXjs")).toBe(false)
  })

  it("builds a pattern matching a package and its subpaths only", () => {
    const pattern = new RegExp(`^${escapeRegExp("react")}(/.*)?$`)

    expect(pattern.test("react")).toBe(true)
    expect(pattern.test("react/jsx-runtime")).toBe(true)
    expect(pattern.test("react-dom")).toBe(false)
    expect(pattern.test("preact")).toBe(false)
    expect(pattern.test("./react")).toBe(false)
  })

  it("matches scoped packages and their subpaths", () => {
    const pattern = new RegExp(`^${escapeRegExp("@medusajs/ui")}(/.*)?$`)

    expect(pattern.test("@medusajs/ui")).toBe(true)
    expect(pattern.test("@medusajs/ui/dist/index.js")).toBe(true)
    expect(pattern.test("@medusajs/ui-preset")).toBe(false)
  })
})
