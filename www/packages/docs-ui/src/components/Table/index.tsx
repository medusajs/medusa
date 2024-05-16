import React from "react"
import { Table as UiTable } from "@medusajs/ui"
import clsx from "clsx"

type RootProps = React.HTMLAttributes<HTMLTableElement>

const Root = ({ className, ...props }: RootProps) => {
  return (
    <UiTable
      className={clsx(
        className,
        "table-fixed mb-docs_1",
        "[&_pre_span]:!max-w-full [&_pre_span]:!break-words [&_pre_span]:!whitespace-break-spaces",
        "[&_pre>div]:mt-docs_1"
      )}
      {...props}
    />
  )
}

type HeaderCellProps = React.HTMLAttributes<HTMLTableCellElement>

const HeaderCell = ({ className, ...props }: HeaderCellProps) => {
  return (
    <UiTable.HeaderCell
      className={clsx(className, "text-left pr-docs_1.5 h-docs_3 break-words")}
      {...props}
    />
  )
}

type RowProps = React.HTMLAttributes<HTMLTableRowElement>

const Row = ({ className, ...props }: RowProps) => {
  return (
    <UiTable.Row
      className={clsx(
        className,
        "[&_td:last-child]:pr-docs_1.5 [&_th:last-child]:pr-docs_1.5 [&_td:first-child]:pl-docs_1.5 [&_th:first-child]:pl-docs_1.5"
      )}
      {...props}
    />
  )
}

type CellProps = React.HTMLAttributes<HTMLTableCellElement>

const Cell = ({ className, ...props }: CellProps) => {
  return (
    <UiTable.Cell
      className={clsx(className, "pr-docs_1.5 h-docs_3 break-words")}
      {...props}
    />
  )
}

const Table = Object.assign(Root, {
  Row,
  Cell,
  Header: UiTable.Header,
  HeaderCell,
  Body: UiTable.Body,
})

export { Table }
