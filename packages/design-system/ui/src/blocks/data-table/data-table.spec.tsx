import { fireEvent, render, screen } from "@testing-library/react"
import * as React from "react"

import { DataTable } from "./data-table"
import { DataTableRow } from "./types"
import { useDataTable } from "./use-data-table"
import { createDataTableColumnHelper } from "./utils/create-data-table-column-helper"

type ProductRow = {
  id: string
  title: string
}

const columnHelper = createDataTableColumnHelper<ProductRow>()

const columns = [
  columnHelper.accessor("title", {
    header: "Title",
  }),
]

describe("DataTable", () => {
  it("passes a TanStack Row<TData> to onRowClick matching its TypeScript signature", () => {
    const receivedOriginals: ProductRow[] = []
    const receivedRowIds: string[] = []

    const TableExample = () => {
      const instance = useDataTable({
        data: [{ id: "prod_1", title: "Winter Jacket" }],
        columns,
        getRowId: (row) => row.id,
        rowCount: 1,
        onRowClick: (_event, row: DataTableRow<ProductRow>) => {
          receivedRowIds.push(row.id)
          receivedOriginals.push(row.original)
        },
      })

      return (
        <DataTable instance={instance}>
          <DataTable.Table />
        </DataTable>
      )
    }

    render(<TableExample />)

    const cell = screen.getByText("Winter Jacket")
    const rowElement = cell.closest("tr")
    expect(rowElement).not.toBeNull()

    if (rowElement) {
      fireEvent.click(rowElement)
    }

    expect(receivedRowIds).toEqual(["prod_1"])
    expect(receivedOriginals).toEqual([{ id: "prod_1", title: "Winter Jacket" }])
  })
})
