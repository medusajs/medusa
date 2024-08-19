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
        "[&_pre>div]:mt-docs_1",
        "shadow-elevation-card-rest dark:shadow-elevation-card-rest-dark",
        "rounded-docs_DEFAULT"
      )}
      {...props}
    />
  )
}

type HeaderProps = React.HTMLAttributes<HTMLTableSectionElement>

const Header = ({ className, ...props }: HeaderProps) => {
  return (
    <UiTable.Header
      className={clsx(
        className,
        "!border-0 bg-medusa-bg-component [&_tr]:!bg-medusa-bg-component",
        "rounded-docs_DEFAULT"
      )}
      {...props}
    />
  )
}

type HeaderCellProps = React.HTMLAttributes<HTMLTableCellElement>

const HeaderCell = ({ className, ...props }: HeaderCellProps) => {
  return (
    <UiTable.HeaderCell
      className={clsx(
        className,
        "text-left px-docs_0.75 py-docs_0.5 break-words",
        "!text-compact-small-plus text-medusa-fg-subtle"
      )}
      {...props}
    />
  )
}

type RowProps = React.HTMLAttributes<HTMLTableRowElement>

const Row = ({ className, ...props }: RowProps) => {
  return (
    <UiTable.Row
      className={clsx(
        className
        // "[&_td:last-child]:pr-docs_1.5 [&_th:last-child]:pr-docs_1.5 [&_td:first-child]:pl-docs_1.5 [&_th:first-child]:pl-docs_1.5"
      )}
      {...props}
    />
  )
}

type CellProps = React.HTMLAttributes<HTMLTableCellElement>

const Cell = ({ className, ...props }: CellProps) => {
  return (
    <UiTable.Cell
      className={clsx(className, "px-docs_0.75 py-docs_0.5 break-words")}
      {...props}
    />
  )
}

const Table = Object.assign(Root, {
  Row,
  Cell,
  Header,
  HeaderCell,
  Body: UiTable.Body,
})

export { Table }
