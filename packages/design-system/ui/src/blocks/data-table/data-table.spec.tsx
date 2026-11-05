import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react"
import * as React from "react"
import { describe, expect, it, vi } from "vitest"

import { TooltipProvider } from "@/components/tooltip"
import { DataTable } from "./data-table"
import { useDataTable } from "./use-data-table"
import { createDataTableColumnHelper } from "./utils/create-data-table-column-helper"
import type { DataTableRowSelectionState } from "./types"

type Item = { id: string; name: string; price: number }

const data: Item[] = [
  { id: "a", name: "Alpha", price: 1 },
  { id: "b", name: "Bravo", price: 2 },
  { id: "c", name: "Charlie", price: 3 },
]

const helper = createDataTableColumnHelper<Item>()
const columns = [
  helper.select(),
  helper.accessor("name", { header: "Name", size: 200, enableSorting: true }),
  helper.accessor("price", { header: "Price" }),
]

const Table = ({
  selection,
  onSelection,
  visibility = {},
}: {
  selection: DataTableRowSelectionState
  onSelection: (s: DataTableRowSelectionState) => void
  visibility?: Record<string, boolean>
}) => {
  const instance = useDataTable({
    data,
    columns,
    getRowId: (r) => r.id,
    rowCount: data.length,
    rowSelection: { state: selection, onRowSelectionChange: onSelection },
    columnVisibility: { state: visibility, onColumnVisibilityChange: () => {} },
  })
  return (
    <TooltipProvider>
      <DataTable instance={instance}>
        <DataTable.Table />
      </DataTable>
    </TooltipProvider>
  )
}

Element.prototype.scroll = () => {}

describe("DataTable", () => {
  it("renders rows and selects them through the select column", () => {
    const onSelection = vi.fn()
    const { rerender } = render(
      <Table selection={{}} onSelection={onSelection} />
    )
    expect(screen.getByText("Alpha")).toBeTruthy()
    expect(screen.getByText("Charlie")).toBeTruthy()
    let boxes = screen.getAllByRole("checkbox")
    expect(boxes).toHaveLength(4)
    expect(boxes[0].getAttribute("aria-checked")).toBe("false")

    fireEvent.click(boxes[1])
    expect(onSelection).toHaveBeenLastCalledWith({ a: true })

    rerender(<Table selection={{ a: true }} onSelection={onSelection} />)
    boxes = screen.getAllByRole("checkbox")
    expect(boxes[0].getAttribute("aria-checked")).toBe("mixed")
    expect(boxes[1].getAttribute("aria-checked")).toBe("true")

    rerender(
      <Table
        selection={{ a: true, b: true, c: true }}
        onSelection={onSelection}
      />
    )
    boxes = screen.getAllByRole("checkbox")
    expect(boxes[0].getAttribute("aria-checked")).toBe("true")

    fireEvent.click(boxes[0])
    expect(onSelection).toHaveBeenLastCalledWith({})

    rerender(<Table selection={{ a: false }} onSelection={onSelection} />)
    boxes = screen.getAllByRole("checkbox")
    expect(boxes[1].getAttribute("aria-checked")).toBe("false")
  })

  it("hides columns and keeps default column sizes", () => {
    render(
      <Table
        selection={{}}
        onSelection={() => {}}
        visibility={{ price: false }}
      />
    )
    expect(screen.queryByText("Price")).toBeNull()
    const nameHeader = screen.getByText("Name").closest("th")!
    expect(nameHeader.style.width).toBe("200px")
  })

  it("exposes sorting, pagination, filtering and column order state", () => {
    const onSortingChange = vi.fn()
    const onPaginationChange = vi.fn()
    const onFilteringChange = vi.fn()
    const { result } = renderHook(() =>
      useDataTable({
        data,
        columns,
        getRowId: (r) => r.id,
        rowCount: 30,
        sorting: { state: { id: "name", desc: true }, onSortingChange },
        pagination: {
          state: { pageIndex: 0, pageSize: 10 },
          onPaginationChange,
        },
        filtering: { state: { name: "Al" }, onFilteringChange },
        columnOrder: {
          state: ["price", "name"],
          onColumnOrderChange: () => {},
        },
      })
    )
    expect(result.current.getSorting()).toEqual({ id: "name", desc: true })
    expect(result.current.getFiltering()).toEqual({ name: "Al" })
    expect(result.current.getPageCount()).toBe(3)
    expect(result.current.getCanNextPage()).toBe(true)
    expect(result.current.getCanPreviousPage()).toBe(false)
    expect(result.current.pageIndex).toBe(0)
    expect(result.current.pageSize).toBe(10)
    expect(result.current.columnOrder).toEqual(["price", "name"])
    expect(result.current.getRowModel().rows).toHaveLength(3)
    expect(
      result.current.getHeaderGroups()[0].headers.map((h) => h.id)
    ).toEqual(["price", "name", "select"])

    act(() => result.current.nextPage())
    expect(onPaginationChange).toHaveBeenLastCalledWith({
      pageIndex: 1,
      pageSize: 10,
    })

    act(() => result.current.setSorting({ id: "price", desc: false }))
    expect(onSortingChange).toHaveBeenLastCalledWith({
      id: "price",
      desc: false,
    })
    expect(onPaginationChange).toHaveBeenLastCalledWith({
      pageIndex: 0,
      pageSize: 10,
    })

    act(() => result.current.removeFilter("name"))
    expect(onFilteringChange).toHaveBeenLastCalledWith({})
  })
})
