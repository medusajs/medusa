import { afterEach, describe, expect, it, vi } from "vitest"
import type { DeclarationReflection } from "typedoc"
import { MarkdownTheme } from "../theme.js"
import { JsonTheme } from "../json-theme.js"
import type { Mapping } from "../types.js"

// Build a JsonTheme without running the (renderer-dependent) constructor so the
// overridden methods can be tested in isolation.
const makeTheme = () => Object.create(JsonTheme.prototype) as JsonTheme

afterEach(() => {
  vi.restoreAllMocks()
})

describe("JsonTheme.toUrl", () => {
  it("rewrites a page's `.mdx`/`.md` extension to `.json`", () => {
    const theme = makeTheme()
    vi.spyOn(MarkdownTheme.prototype, "toUrl").mockReturnValue(
      "cart/methods/cart.create/page.mdx"
    )
    expect(
      theme.toUrl({} as Mapping, {} as DeclarationReflection)
    ).toBe("cart/methods/cart.create/page.json")
  })
})

describe("JsonTheme.getFormattingOptions", () => {
  it("normalizes a page.json location back to page.mdx for the base lookup", () => {
    const theme = makeTheme()
    const spy = vi
      .spyOn(MarkdownTheme.prototype, "getFormattingOptions")
      .mockReturnValue({})
    theme.getFormattingOptions("medusa-workflows/createCartWorkflow/page.json")
    expect(spy).toHaveBeenCalledWith(
      "medusa-workflows/createCartWorkflow/page.mdx"
    )
  })

  it("leaves a non-json location unchanged", () => {
    const theme = makeTheme()
    const spy = vi
      .spyOn(MarkdownTheme.prototype, "getFormattingOptions")
      .mockReturnValue({})
    theme.getFormattingOptions("medusa-workflows/createCartWorkflow/page.mdx")
    expect(spy).toHaveBeenCalledWith(
      "medusa-workflows/createCartWorkflow/page.mdx"
    )
  })
})

describe("JsonTheme.getRelativeUrl", () => {
  it("resolves internal links through the slug map and leaves absolute urls", () => {
    const theme = makeTheme()
    theme.getSlugMap = () =>
      new Map([["cart/create/page.mdx", "/references/cart/create"]])
    expect(theme.getRelativeUrl("cart/create/page.mdx")).toBe(
      "/references/cart/create"
    )
    expect(theme.getRelativeUrl("cart/create/page.mdx#returns")).toBe(
      "/references/cart/create#returns"
    )
    expect(theme.getRelativeUrl("https://docs.medusajs.com")).toBe(
      "https://docs.medusajs.com"
    )
  })
})

describe("JsonTheme.globalsFile", () => {
  it("is the json globals file", () => {
    expect(makeTheme().globalsFile).toBe("modules.json")
  })
})
