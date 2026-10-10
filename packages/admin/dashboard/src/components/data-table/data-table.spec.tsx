// @vitest-environment jsdom
import { act, cleanup, render, screen } from "@testing-library/react"
import { MemoryRouter, useLocation } from "react-router-dom"
import { afterEach, describe, expect, it, vi } from "vitest"
import { DataTable } from "./data-table"

const state = vi.hoisted(() => ({ options: null as any }))

vi.mock("@medusajs/ui", () => {
  const Empty = () => null
  const Wrapper = ({ children }: any) => children
  return {
    DataTable: Object.assign(Wrapper, {
      Toolbar: Wrapper,
      Table: Empty,
      Pagination: Empty,
      FilterMenu: Empty,
      SortingMenu: Empty,
      Search: Empty,
    }),
    useDataTable: (options: any) => {
      state.options = options
      return {}
    },
    Button: Empty,
    Heading: Empty,
    Text: Empty,
    Tooltip: Empty,
  }
})
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
vi.mock("../../providers/feature-flag-provider", () => ({
  useFeatureFlag: () => false,
}))
vi.mock("../common/action-menu", () => ({ ActionMenu: () => null }))
vi.mock("../table/view-selector", () => ({ ViewPills: () => null }))

afterEach(cleanup)

const Location = () => (
  <output data-testid="location">{useLocation().search}</output>
)

function setup(query: string, prefix?: string) {
  const clearSelection = vi.fn()
  render(
    <MemoryRouter initialEntries={[`/?${query}`]}>
      <DataTable
        data={[]}
        columns={[{ id: "title", enableSorting: true }]}
        filters={[
          { id: "status", label: "Status", type: "select", options: [] },
        ]}
        getRowId={(row: { id: string }) => row.id}
        prefix={prefix}
        pageSize={20}
        rowSelection={{
          state: { old: true },
          onRowSelectionChange: clearSelection,
        }}
      />
      <Location />
    </MemoryRouter>
  )
  return {
    clearSelection,
    params: () =>
      new URLSearchParams(screen.getByTestId("location").textContent!),
  }
}

describe("table query changes", () => {
  it("returns to page one when searching and clears the previous selection", () => {
    const { params, clearSelection } = setup("offset=80&order=title")
    act(() => state.options.search.onSearchChange("new search"))
    expect(params().get("q")).toBe("new search")
    expect(params().has("offset")).toBe(false)
    expect(params().get("order")).toBe("title")
    expect(clearSelection).toHaveBeenCalledWith({})
  })

  it("resets only this table's pagination when filtering", () => {
    const { params } = setup(
      "products_offset=80&other_offset=40&products_q=shoe",
      "products"
    )
    act(() =>
      state.options.filtering.onFilteringChange({ status: ["published"] })
    )
    expect(params().has("products_offset")).toBe(false)
    expect(params().get("other_offset")).toBe("40")
    expect(params().get("products_q")).toBe("shoe")
    expect(JSON.parse(params().get("products_status")!)).toEqual(["published"])
  })

  it("clears filters and starts the new sort on page one", () => {
    const { params } = setup('offset=80&status=["published"]')
    act(() => state.options.filtering.onFilteringChange({}))
    expect(params().has("status")).toBe(false)
    act(() =>
      state.options.pagination.onPaginationChange({
        pageIndex: 2,
        pageSize: 20,
      })
    )
    expect(params().get("offset")).toBe("40")
    act(() =>
      state.options.sorting.onSortingChange({ id: "title", desc: true })
    )
    expect(params().has("offset")).toBe(false)
    expect(params().get("order")).toBe("-title")
  })

  it.each(["invalid", "-20", "Infinity"])(
    "handles an invalid offset (%s)",
    (offset) => {
      setup(`offset=${offset}`)
      expect(state.options.pagination.state.pageIndex).toBe(0)
    }
  )
})
