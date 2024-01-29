import { Table, clx } from "@medusajs/ui"
import {
  Cell,
  ColumnDef,
  Table as ReactTable,
  flexRender,
} from "@tanstack/react-table"
import { Link } from "react-router-dom"
import { DataTableOrderBy } from "./data-table-order-by"
import { DataTableSearch } from "./data-table-search"

interface DataTableProps<TData, TValue> {
  /**
   * The table instance to render
   */
  table: ReactTable<TData>
  /**
   * The columns to render
   */
  columns: ColumnDef<TData, TValue>[]
  /**
   * Keys to allow ordering by
   */
  orderBy?: (keyof TData)[]
  /**
   * Whether to allow searching
   */
  searchable?: boolean
  /**
   * Prefix to destinguish between multiple tables on the same page. When
   * prefix is set, the table will use the prefix to write search params.
   */
  prefix?: string
  /**
   * Function to generate a link to navigate to when clicking on a row
   */
  navigateTo?: (cell: Cell<TData, unknown>) => string
}

export const DataTable = <TData, TValue>({
  table,
  columns,
  searchable,
  orderBy,
  prefix,
  navigateTo,
}: DataTableProps<TData, TValue>) => {
  const hasSelect = columns.find((c) => c.id === "select")
  const hasActions = columns.find((c) => c.id === "actions")
  const showToolbar = searchable || orderBy

  return (
    <div>
      {showToolbar && (
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div></div>
          <div className="flex items-center gap-x-2">
            {searchable && <DataTableSearch prefix={prefix} />}
            {orderBy && <DataTableOrderBy keys={orderBy} />}
          </div>
        </div>
      )}
      <Table>
        <Table.Header className="border-t-0">
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <Table.Row
                key={headerGroup.id}
                className={clx("[&_th]:w-1/3", {
                  "[&_th:last-of-type]:w-[1%] [&_th:last-of-type]:whitespace-nowrap":
                    hasActions,
                  "[&_th:first-of-type]:w-[1%] [&_th:first-of-type]:whitespace-nowrap":
                    hasSelect,
                })}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <Table.HeaderCell key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </Table.HeaderCell>
                  )
                })}
              </Table.Row>
            )
          })}
        </Table.Header>
        <Table.Body className="border-b-0">
          {table.getRowModel().rows.map((row) => {
            return (
              <Table.Row
                key={row.id}
                className={clx(
                  "transition-fg [&_td:last-of-type]:w-[1%] [&_td:last-of-type]:whitespace-nowrap",
                  {
                    "bg-ui-bg-highlight hover:bg-ui-bg-highlight-hover":
                      row.getIsSelected(),
                  }
                )}
              >
                {row.getVisibleCells().map((cell) => {
                  const to = navigateTo ? navigateTo(cell) : undefined

                  return (
                    <Table.Cell
                      key={cell.id}
                      className="has-[a]:cursor-pointer"
                    >
                      {renderCell(cell, to)}
                    </Table.Cell>
                  )
                })}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </div>
  )
}

const renderCell = <TData,>(cell: Cell<TData, unknown>, to?: string) => {
  const renderResult = (
    <div className="w-full flex items-center h-full">
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </div>
  )
  const isAction = cell.column.id === "actions" || cell.column.id === "select"

  if (to && !isAction) {
    return (
      <Link to={to} className="w-full">
        {renderResult}
      </Link>
    )
  }

  return renderResult
}
