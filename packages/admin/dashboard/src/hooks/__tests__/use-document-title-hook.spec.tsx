// @vitest-environment jsdom
import { renderHook } from "@testing-library/react"
import { createElement } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const useMatchesMock = vi.fn()

vi.mock("react-router-dom", () => ({
  useMatches: () => useMatchesMock(),
}))

import { useDocumentTitle } from "../use-document-title"

describe("useDocumentTitle", () => {
  beforeEach(() => {
    useMatchesMock.mockReset()
  })

  it("returns the default title when no match yields a title", () => {
    useMatchesMock.mockReturnValue([
      { id: "root", pathname: "/", params: {}, data: undefined, handle: {} },
    ])

    const { result } = renderHook(() => useDocumentTitle())

    expect(result.current).toBe("Medusa")
  })

  it("appends the page title from a string breadcrumb", () => {
    useMatchesMock.mockReturnValue([
      {
        id: "products",
        pathname: "/products",
        params: {},
        loaderData: undefined,
        handle: { breadcrumb: () => "Products" },
      },
    ])

    const { result } = renderHook(() => useDocumentTitle())

    expect(result.current).toBe("Products - Medusa")
  })

  it("uses a route's seo resolver for detail pages", () => {
    useMatchesMock.mockReturnValue([
      {
        id: "products",
        pathname: "/products",
        params: {},
        loaderData: undefined,
        handle: { breadcrumb: () => "Products" },
      },
      {
        id: "product-detail",
        pathname: "/products/prod_1",
        params: { id: "prod_1" },
        loaderData: { product: { title: "Medusa Sweatpants" } },
        handle: {
          breadcrumb: () => createElement("span", null, "Hidden"),
          seo: (match: { loaderData: { product: { title: string } } }) => ({
            title: match.loaderData?.product?.title,
          }),
        },
      },
    ])

    const { result } = renderHook(() => useDocumentTitle())

    expect(result.current).toBe("Medusa Sweatpants - Medusa")
  })

  it("uses the most specific (last) match that yields a title", () => {
    useMatchesMock.mockReturnValue([
      {
        id: "products",
        pathname: "/products",
        params: {},
        loaderData: undefined,
        handle: { breadcrumb: () => "Products" },
      },
      {
        id: "product-detail",
        pathname: "/products/prod_1",
        params: { id: "prod_1" },
        loaderData: { product: { title: "Medusa Sweatpants" } },
        handle: { seo: () => ({ title: "Medusa Sweatpants" }) },
      },
    ])

    const { result } = renderHook(() => useDocumentTitle())

    expect(result.current).toBe("Medusa Sweatpants - Medusa")
  })

  it("skips a detail match without a title and uses the parent breadcrumb", () => {
    useMatchesMock.mockReturnValue([
      {
        id: "products",
        pathname: "/products",
        params: {},
        loaderData: undefined,
        handle: { breadcrumb: () => "Products" },
      },
      {
        id: "product-detail",
        pathname: "/products/prod_1",
        params: { id: "prod_1" },
        loaderData: undefined,
        handle: {
          breadcrumb: () => createElement("span", null, "Hidden"),
          seo: () => ({ title: undefined }),
        },
      },
    ])

    const { result } = renderHook(() => useDocumentTitle())

    expect(result.current).toBe("Products - Medusa")
  })

  describe("brand", () => {
    const productsMatch = {
      id: "products",
      pathname: "/products",
      params: {},
      loaderData: undefined,
      handle: { breadcrumb: () => "Products" },
    }

    it("uses the brand as the title suffix", () => {
      useMatchesMock.mockReturnValue([productsMatch])

      const { result } = renderHook(() => useDocumentTitle("ACME"))

      expect(result.current).toBe("Products - ACME")
    })

    it("uses the brand alone when no match yields a title", () => {
      useMatchesMock.mockReturnValue([
        { id: "root", pathname: "/", params: {}, data: undefined, handle: {} },
      ])

      const { result } = renderHook(() => useDocumentTitle("ACME"))

      expect(result.current).toBe("ACME")
    })

    it.each([null, "", "   "])(
      "falls back to Medusa when the brand is %j",
      (brand) => {
        useMatchesMock.mockReturnValue([productsMatch])

        const { result } = renderHook(() => useDocumentTitle(brand))

        expect(result.current).toBe("Products - Medusa")
      }
    )

    it("updates the title when the brand changes", () => {
      useMatchesMock.mockReturnValue([productsMatch])

      const { result, rerender } = renderHook(
        ({ brand }: { brand?: string }) => useDocumentTitle(brand),
        { initialProps: { brand: undefined as string | undefined } }
      )

      expect(result.current).toBe("Products - Medusa")

      rerender({ brand: "ACME" })

      expect(result.current).toBe("Products - ACME")
    })
  })
})
