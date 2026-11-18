// @vitest-environment jsdom
import { cleanup, renderHook, waitFor } from "@testing-library/react"
import { ReactNode } from "react"
import { MemoryRouter, useLocation } from "react-router-dom"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useTableConfiguration } from "../use-table-configuration"

const mocks = vi.hoisted(() => ({
  activeView: {} as Record<string, any>,
  columns: [
    { field: "title", context: "display", default_visible: true },
    { field: "status", context: "filter" },
  ],
}))

vi.mock("../../../providers/feature-flag-provider", () => ({
  useFeatureFlag: () => true,
}))

vi.mock("../../use-view-configurations", () => ({
  useViewConfigurations: () => ({
    activeView: mocks.activeView,
    createView: {},
  }),
  useViewConfiguration: () => ({ updateView: {} }),
}))

vi.mock("../../api/views", () => ({
  useEntityColumns: () => ({ columns: mocks.columns, isLoading: false }),
}))

vi.mock("../use-column-filters", () => ({
  useColumnFilters: () => ({
    filters: [{ id: "status" }],
    isLoading: false,
  }),
}))

vi.mock("../columns/use-column-state", () => ({
  useColumnState: () => ({
    visibleColumns: { title: true },
    columnOrder: ["title"],
    currentColumns: { visible: ["title"], order: ["title"] },
    setColumnOrder: vi.fn(),
    handleColumnVisibilityChange: vi.fn(),
    handleViewChange: vi.fn(),
  }),
}))

const savedView = {
  view_configuration: {
    id: "view_1",
    configuration: {
      filters: { status: ["published"] },
      sorting: { id: "title", desc: false },
      search: "",
    },
  },
}

const renderOnUrl = (
  url: string,
  defaultFilters?: Record<string, any>,
  reactStrictMode = false
) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
  )

  return renderHook(
    () => {
      useTableConfiguration({
        entity: "product",
        queryPrefix: "p",
        defaultFilters,
      })
      return new URLSearchParams(useLocation().search)
    },
    { wrapper, reactStrictMode }
  )
}

const returningUrl =
  "/products?p_order=-created_at&p_offset=40&p_q=shirt&p_status=%5B%22draft%22%5D"

describe("useTableConfiguration", () => {
  beforeEach(() => {
    mocks.activeView = { isLoading: false }
  })

  afterEach(() => {
    cleanup()
  })

  it("should keep the page, sorting, search and filters from the URL when returning to the list without a saved view", async () => {
    const { result } = renderOnUrl(returningUrl)

    await new Promise((resolve) => setTimeout(resolve, 20))

    expect(result.current.get("p_offset")).toBe("40")
    expect(result.current.get("p_order")).toBe("-created_at")
    expect(result.current.get("p_q")).toBe("shirt")
    expect(result.current.get("p_status")).toBe('["draft"]')
  })

  it("should keep the URL state when returning to the list with a saved view active", async () => {
    mocks.activeView = { ...savedView, isLoading: false }

    const { result } = renderOnUrl(returningUrl)

    await new Promise((resolve) => setTimeout(resolve, 20))

    expect(result.current.get("p_offset")).toBe("40")
    expect(result.current.get("p_order")).toBe("-created_at")
    expect(result.current.get("p_q")).toBe("shirt")
    expect(result.current.get("p_status")).toBe('["draft"]')
  })

  it("should keep the URL state when returning to the list in strict mode", async () => {
    mocks.activeView = { ...savedView, isLoading: false }

    const { result } = renderOnUrl(returningUrl, undefined, true)

    await new Promise((resolve) => setTimeout(resolve, 20))

    expect(result.current.get("p_offset")).toBe("40")
    expect(result.current.get("p_order")).toBe("-created_at")
    expect(result.current.get("p_q")).toBe("shirt")
    expect(result.current.get("p_status")).toBe('["draft"]')
  })

  it("should apply the saved view on a fresh visit in strict mode", async () => {
    mocks.activeView = { ...savedView, isLoading: false }

    const { result } = renderOnUrl("/products", undefined, true)

    await waitFor(() => {
      expect(result.current.get("p_status")).toBe('["published"]')
    })
    expect(result.current.get("p_order")).toBe("title")
  })

  it("should keep the URL state when the active view loads after the columns", async () => {
    mocks.activeView = { isLoading: true }

    const { result, rerender } = renderOnUrl(returningUrl)

    await new Promise((resolve) => setTimeout(resolve, 20))

    mocks.activeView = { ...savedView, isLoading: false }
    rerender()

    await new Promise((resolve) => setTimeout(resolve, 20))

    expect(result.current.get("p_offset")).toBe("40")
    expect(result.current.get("p_order")).toBe("-created_at")
    expect(result.current.get("p_status")).toBe('["draft"]')
  })

  it("should apply the saved view on a fresh visit", async () => {
    mocks.activeView = { ...savedView, isLoading: false }

    const { result } = renderOnUrl("/products")

    await waitFor(() => {
      expect(result.current.get("p_status")).toBe('["published"]')
    })
    expect(result.current.get("p_order")).toBe("title")
  })

  it("should apply the default filters on a fresh visit once the active view has loaded without a saved view", async () => {
    mocks.activeView = { isLoading: true }

    const { result, rerender } = renderOnUrl("/products", {
      status: ["draft"],
    })

    await new Promise((resolve) => setTimeout(resolve, 20))

    mocks.activeView = { view_configuration: null, isLoading: false }
    rerender()

    await waitFor(() => {
      expect(result.current.get("p_status")).toBe('["draft"]')
    })
  })
})
