import React from "react"
import { useTranslation } from "react-i18next"
import { Table as ReactTable, flexRender } from "@tanstack/react-table"

import { LineItem } from "@medusajs/medusa"
import { Table, clx } from "@medusajs/ui"

type ItemsTableProps<TData> = {
  /**
   * The table instance to render
   */
  table: ReactTable<TData>
}

function ItemsTable({ table }: ItemsTableProps<LineItem>) {
  const { t } = useTranslation()

  return (
    <Table className="shadow-elevation-card-rest w-full rounded-md">
      <Table.Header className="border-t-0">
        {table.getHeaderGroups().map((headerGroup) => {
          return (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Table.HeaderCell
                    className="bg-ui-tag-neutral-bg after:bg-ui-border-base"
                    data-table-header-id={header.id}
                    key={header.id}
                  >
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
                "transition-fg group/row [&_td:last-of-type]:w-[1%] [&_td:last-of-type]:whitespace-nowrap"
              )}
            >
              {row.getVisibleCells().map((cell) => {
                return (
                  <Table.Cell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                )
              })}
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}

export default ItemsTable
