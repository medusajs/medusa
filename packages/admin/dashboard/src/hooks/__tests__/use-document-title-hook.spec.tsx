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
        data: undefined,
        handle: { breadcrumb: () => "Products" },
      },
    ])

    const { result } = renderHook(() => useDocumentTitle())

    expect(result.current).toBe("Products - Medusa")
  })

  it("uses the most specific (last) breadcrumb match", () => {
    useMatchesMock.mockReturnValue([
      {
        id: "products",
        pathname: "/products",
        params: {},
        data: undefined,
        handle: { breadcrumb: () => "Products" },
      },
      {
        id: "product-detail",
        pathname: "/products/prod_1",
        params: { id: "prod_1" },
        data: { product: { title: "Medusa Sweatpants" } },
        handle: { breadcrumb: () => "Edit" },
      },
    ])

    const { result } = renderHook(() => useDocumentTitle())

    expect(result.current).toBe("Edit - Medusa")
  })

  it("falls back to loader data when breadcrumb returns a React element", () => {
    useMatchesMock.mockReturnValue([
      {
        id: "product-detail",
        pathname: "/products/prod_1",
        params: { id: "prod_1" },
        data: { product: { title: "Medusa Sweatpants" } },
        handle: {
          breadcrumb: () => createElement("span", null, "Hidden"),
        },
      },
    ])

    const { result } = renderHook(() => useDocumentTitle())

    expect(result.current).toBe("Medusa Sweatpants - Medusa")
  })
})
