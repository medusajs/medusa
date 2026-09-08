import { describe, expect, it, vi } from "vitest"
import type { ProjectReflection, Reflection } from "typedoc"
import type { MarkdownTheme } from "../../theme.js"
import {
  buildSlugMap,
  resolveLink,
  resolvePageSlug,
} from "../resolve-page-slug.js"

const makeTheme = (frontmatterData?: Record<string, unknown>): MarkdownTheme =>
  ({
    getFormattingOptions: vi.fn(() => ({ frontmatterData })),
  }) as unknown as MarkdownTheme

const reflection = { name: "createCart" } as unknown as Reflection

describe("resolveLink", () => {
  const map = new Map([["cart/create/page.mdx", "/references/cart/create"]])

  it("returns absolute http/ftp urls unchanged", () => {
    expect(resolveLink(map, "https://docs.medusajs.com/x")).toBe(
      "https://docs.medusajs.com/x"
    )
    expect(resolveLink(map, "ftp://x/y")).toBe("ftp://x/y")
  })

  it("returns empty input unchanged", () => {
    expect(resolveLink(map, "")).toBe("")
  })

  it("resolves a mapped page url to its final slug", () => {
    expect(resolveLink(map, "cart/create/page.mdx")).toBe(
      "/references/cart/create"
    )
  })

  it("preserves an anchor when resolving a mapped url", () => {
    expect(resolveLink(map, "cart/create/page.mdx#parameters")).toBe(
      "/references/cart/create#parameters"
    )
  })

  it("falls back to a path-derived slug when the target isn't mapped", () => {
    expect(resolveLink(map, "cart/update/page.mdx")).toBe(
      "/references/cart/update"
    )
    expect(resolveLink(map, "order/list/page.json#result")).toBe(
      "/references/order/list#result"
    )
  })
})

describe("resolvePageSlug", () => {
  it("derives the slug from the page location when there is no frontmatter slug", () => {
    const theme = makeTheme(undefined)
    expect(
      resolvePageSlug(theme, reflection, "cart/methods/cart.create/page.mdx")
    ).toBe("/references/cart/methods/cart.create")
  })

  it("uses the frontmatter slug when one is configured", () => {
    const theme = makeTheme({ slug: "/references/cart/create" })
    expect(
      resolvePageSlug(theme, reflection, "cart/methods/cart.create/page.mdx")
    ).toBe("/references/cart/create")
  })

  it("resolves `{{alias}}` template variables in the slug", () => {
    const theme = makeTheme({ slug: "/references/cart/{{alias}}" })
    expect(
      resolvePageSlug(theme, reflection, "cart/methods/cart.create/page.mdx")
    ).toBe("/references/cart/createCart")
  })
})

describe("buildSlugMap", () => {
  it("maps own-document pages to final slugs, skipping external + undocumented", () => {
    const theme = makeTheme(undefined)
    const leaf = (url: string, hasOwnDocument: boolean) =>
      ({
        url,
        hasOwnDocument,
        traverse: () => {},
      }) as unknown as Reflection

    const owned = leaf("cart/create/page.mdx", true)
    const undocumented = leaf("cart/internal/page.mdx", false)
    const external = leaf("https://external.com/x", true)

    const project = {
      url: undefined,
      hasOwnDocument: false,
      traverse: (cb: (child: Reflection) => boolean) => {
        ;[owned, undocumented, external].forEach((child) => cb(child))
      },
    } as unknown as ProjectReflection

    const map = buildSlugMap(theme, project)

    expect(map.get("cart/create/page.mdx")).toBe("/references/cart/create")
    expect(map.has("cart/internal/page.mdx")).toBe(false)
    expect(map.has("https://external.com/x")).toBe(false)
  })
})
