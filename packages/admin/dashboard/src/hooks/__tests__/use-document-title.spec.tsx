import { createElement } from "react"
import type { UIMatch } from "react-router-dom"
import { describe, expect, it } from "vitest"

import { getTitleFromMatch, RouteHandle } from "../use-document-title"

const buildMatch = (
  overrides: Partial<UIMatch<unknown, RouteHandle>> = {}
): UIMatch<unknown, RouteHandle> =>
  ({
    id: "match",
    pathname: "/",
    params: {},
    data: undefined,
    handle: undefined,
    ...overrides,
  } as UIMatch<unknown, RouteHandle>)

describe("getTitleFromMatch", () => {
  it("returns null when the handle is undefined", () => {
    expect(getTitleFromMatch(buildMatch())).toBeNull()
  })

  it("returns null when the handle has neither seo nor breadcrumb", () => {
    expect(getTitleFromMatch(buildMatch({ handle: {} }))).toBeNull()
  })

  describe("seo resolver", () => {
    it("returns the resolved title", () => {
      const match = buildMatch({
        data: { order: { display_id: 12345 } },
        handle: {
          seo: (m) => ({
            title: `#${
              (m.data as { order: { display_id: number } }).order.display_id
            }`,
          }),
        },
      })

      expect(getTitleFromMatch(match)).toBe("#12345")
    })

    it("takes precedence over a string breadcrumb", () => {
      const match = buildMatch({
        handle: {
          breadcrumb: () => "Orders",
          seo: () => ({ title: "#12345" }),
        },
      })

      expect(getTitleFromMatch(match)).toBe("#12345")
    })

    it("falls back to the breadcrumb when it returns undefined", () => {
      const match = buildMatch({
        handle: {
          breadcrumb: () => "Orders",
          seo: () => ({ title: undefined }),
        },
      })

      expect(getTitleFromMatch(match)).toBe("Orders")
    })

    it("ignores empty or whitespace-only titles", () => {
      expect(
        getTitleFromMatch(
          buildMatch({ handle: { seo: () => ({ title: "" }) } })
        )
      ).toBeNull()
      expect(
        getTitleFromMatch(
          buildMatch({ handle: { seo: () => ({ title: "   " }) } })
        )
      ).toBeNull()
    })

    it("returns null when the resolver throws", () => {
      const match = buildMatch({
        handle: {
          seo: () => {
            throw new Error("boom")
          },
        },
      })

      expect(getTitleFromMatch(match)).toBeNull()
    })
  })

  describe("breadcrumb fallback", () => {
    it("returns the breadcrumb string", () => {
      expect(
        getTitleFromMatch(
          buildMatch({ handle: { breadcrumb: () => "Products" } })
        )
      ).toBe("Products")
    })

    it("ignores empty or whitespace-only breadcrumb strings", () => {
      expect(
        getTitleFromMatch(buildMatch({ handle: { breadcrumb: () => "" } }))
      ).toBeNull()
      expect(
        getTitleFromMatch(buildMatch({ handle: { breadcrumb: () => "  " } }))
      ).toBeNull()
    })

    it("returns null for React-element breadcrumbs", () => {
      const match = buildMatch({
        data: { product: { title: "Medusa Sweatpants" } },
        handle: { breadcrumb: () => createElement("span", null, "Hidden") },
      })

      expect(getTitleFromMatch(match)).toBeNull()
    })

    it("returns null for non-string, non-element breadcrumb values", () => {
      const match = buildMatch({
        handle: { breadcrumb: () => 42 as unknown as string },
      })

      expect(getTitleFromMatch(match)).toBeNull()
    })

    it("returns null when the breadcrumb throws", () => {
      const match = buildMatch({
        handle: {
          breadcrumb: () => {
            throw new Error("boom")
          },
        },
      })

      expect(getTitleFromMatch(match)).toBeNull()
    })
  })
})
