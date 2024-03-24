import { OnChangeFn, RowSelectionState } from "@tanstack/react-table"
import { useState } from "react"
import { LineItem } from "@medusajs/medusa"

import { DataTable } from "../../../../../components/table/data-table"
import { useDataTable } from "../../../../../hooks/use-data-table.tsx"

import { useItemsTableColumns } from "./use-items-table-columns"

const PAGE_SIZE = 50

export type Option = {
  value: string
  label: string
}

type ItemsTableProps = {
  onSelectionChange: (ids: string[]) => Promise<void>
  selectedItems: string[]
  items: LineItem[]
}

export const ItemsTable = ({
  onSelectionChange,
  selectedItems,
  items,
}: ItemsTableProps) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    selectedItems.reduce((acc, id) => {
      acc[id] = true
      return acc
    }, {})
  )

  const updater: OnChangeFn<RowSelectionState> = (fn) => {
    const newState: RowSelectionState =
      typeof fn === "function" ? fn(rowSelection) : fn

    setRowSelection(newState)
    onSelectionChange(Object.keys(newState))
  }

  const columns = useItemsTableColumns()

  const { table } = useDataTable({
    data: items as LineItem[],
    columns: columns,
    count: items.length,
    enablePagination: true,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
    enableRowSelection: true,
    rowSelection: {
      state: rowSelection,
      updater,
    },
  })

  return (
    <div className="flex size-full flex-col overflow-hidden">
      <DataTable
        table={table}
        columns={columns}
        pageSize={PAGE_SIZE}
        count={items.length}
        pagination
        layout="fill"
      />
    </div>
  )
}
