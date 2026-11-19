// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react"
import { createColumnHelper } from "@tanstack/react-table"
import { createElement, ReactNode } from "react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"

import { DataTableFeatures } from "../../components/table/data-table/data-table-features"
import { useDataTable } from "../use-data-table"

type Item = { id: string; name: string; children?: Item[] }

const columnHelper = createColumnHelper<DataTableFeatures, Item>()
const columns = [columnHelper.accessor("name", { header: "Name" })]

const items: Item[] = Array.from({ length: 25 }, (_, i) => ({
  id: `item_${i}`,
  name: `Item ${i}`,
}))

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(MemoryRouter, null, children)

describe("useDataTable", () => {
  it("shows every row when pagination is disabled", () => {
    const { result } = renderHook(
      () =>
        useDataTable({
          data: items,
          columns,
          enablePagination: false,
          getRowId: (row) => row.id,
        }),
      { wrapper }
    )

    expect(result.current.table.getRowModel().rows).toHaveLength(25)
  })

  it("leaves server-paginated rows as they are and counts pages", () => {
    const { result } = renderHook(
      () =>
        useDataTable({
          data: items.slice(0, 10),
          columns,
          count: 25,
          pageSize: 10,
          getRowId: (row) => row.id,
        }),
      { wrapper }
    )

    const { table } = result.current
    expect(table.getRowModel().rows).toHaveLength(10)
    expect(table.getPageCount()).toBe(3)
    expect(table.getCanNextPage()).toBe(true)
    expect(table.getCanPreviousPage()).toBe(false)
  })

  it("selects rows and reports some and all page rows selected", () => {
    const { result } = renderHook(
      () =>
        useDataTable({
          data: items.slice(0, 2),
          columns,
          enableRowSelection: true,
          getRowId: (row) => row.id,
        }),
      { wrapper }
    )

    act(() => result.current.table.getRowModel().rows[0].toggleSelected(true))
    expect(result.current.table.getIsSomePageRowsSelected()).toBe(true)
    expect(result.current.table.getIsAllPageRowsSelected()).toBe(false)

    act(() => result.current.table.toggleAllPageRowsSelected(true))
    expect(result.current.table.getIsAllPageRowsSelected()).toBe(true)
    expect(result.current.table.state.rowSelection).toEqual({
      item_0: true,
      item_1: true,
    })
  })

  it("expands sub rows only when expandable rows are enabled", () => {
    const tree: Item[] = [
      {
        id: "parent",
        name: "Parent",
        children: [{ id: "child", name: "Child" }],
      },
    ]

    const expandable = renderHook(
      () =>
        useDataTable({
          data: tree,
          columns,
          enableExpandableRows: true,
          getRowId: (row) => row.id,
          getSubRows: (row) => row.children ?? [],
        }),
      { wrapper }
    )

    const parent = expandable.result.current.table.getRowModel().rows[0]
    expect(parent.getCanExpand()).toBe(true)
    act(() => parent.getToggleExpandedHandler()())
    expect(expandable.result.current.table.getRowModel().rows).toHaveLength(2)

    const flat = renderHook(
      () =>
        useDataTable({
          data: tree,
          columns,
          getRowId: (row) => row.id,
          getSubRows: (row) => row.children ?? [],
        }),
      { wrapper }
    )

    expect(flat.result.current.table.getRowModel().rows).toHaveLength(1)
    expect(flat.result.current.table.getRowModel().rows[0].getCanExpand()).toBe(
      false
    )
  })
})
