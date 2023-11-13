import { Minus } from "@medusajs/icons"
import * as React from "react"

import { Button } from "@/components/button"
import { clx } from "@/utils/clx"

const Root = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <table
    ref={ref}
    className={clx("text-ui-fg-subtle txt-compact-small w-full", className)}
    {...props}
  />
))
Root.displayName = "Table"

const Row = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={clx(
      "bg-ui-bg-base hover:bg-ui-bg-base-hover border-ui-border-base transition-fg border-b",
      "[&_td:last-child]:pr-8 [&_th:last-child]:pr-8",
      "[&_td:first-child]:pl-8 [&_th:first-child]:pl-8",
      className
    )}
    {...props}
  />
))
Row.displayName = "Table.Row"

const Cell = React.forwardRef<
  HTMLTableCellElement,
  React.HTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td ref={ref} className={clx("h-12 pr-3", className)} {...props} />
))
Cell.displayName = "Table.Cell"

const Header = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={clx(
      "border-ui-border-base txt-compact-small-plus [&_tr:hover]:bg-ui-bg-base border-y",
      className
    )}
    {...props}
  />
))
Header.displayName = "Table.Header"

const HeaderCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th ref={ref} className={clx("h-12 pr-3 text-left", className)} {...props} />
))
HeaderCell.displayName = "Table.HeaderCell"

const Body = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={clx("border-ui-border-base border-b", className)}
    {...props}
  />
))
Body.displayName = "Table.Body"

interface TablePaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  count: number
  pageSize: number
  pageIndex: number
  pageCount: number
  canPreviousPage: boolean
  canNextPage: boolean
  previousPage: () => void
  nextPage: () => void
}

const Pagination = React.forwardRef<HTMLDivElement, TablePaginationProps>(
  (
    {
      className,
      count,
      pageSize,
      pageCount,
      pageIndex,
      canPreviousPage,
      canNextPage,
      nextPage,
      previousPage,
      ...props
    },
    ref
  ) => {
    const { from, to } = React.useMemo(() => {
      const from = count === 0 ? count : pageIndex * pageSize + 1
      const to = Math.min(count, (pageIndex + 1) * pageSize)

      return { from, to }
    }, [count, pageIndex, pageSize])

    return (
      <div
        ref={ref}
        className={clx(
          "text-ui-fg-subtle txt-compact-small-plus flex w-full items-center justify-between px-5 pb-6 pt-4",
          className
        )}
        {...props}
      >
        <div className="inline-flex items-center gap-x-1 px-3 py-[5px]">
          <p>{from}</p>
          <Minus className="text-ui-fg-muted" />
          <p>{`${to} of ${count} results`}</p>
        </div>
        <div className="flex items-center gap-x-2">
          <div className="inline-flex items-center gap-x-1 px-3 py-[5px]">
            <p>
              {pageIndex + 1} of {Math.max(pageCount, 1)}
            </p>
          </div>
          <Button
            variant={"transparent"}
            onClick={previousPage}
            disabled={!canPreviousPage}
          >
            Prev
          </Button>
          <Button
            variant={"transparent"}
            onClick={nextPage}
            disabled={!canNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    )
  }
)
Pagination.displayName = "Table.Pagination"

const Table = Object.assign(Root, {
  Row,
  Cell,
  Header,
  HeaderCell,
  Body,
  Pagination,
})

export { Table }
