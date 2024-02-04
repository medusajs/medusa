import { Minus } from "@medusajs/icons"
import * as React from "react"

import { Button } from "@/components/button"
import { clx } from "@/utils/clx"

/**
 * This component is based on the table element and its various children:
 *
 * - `Table`: `table`
 * - `Table.Header`: `thead`
 * - `Table.Row`: `tr`
 * - `Table.HeaderCell`: `th`
 * - `Table.Body`: `tbody`
 * - `Table.Cell`: `td`
 *
 * Each component supports the props or attributes of its equivalent HTML element.
 */
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
      "[&_td:last-child]:pr-6 [&_th:last-child]:pr-6",
      "[&_td:first-child]:pl-6 [&_th:first-child]:pl-6",
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
  <td ref={ref} className={clx("h-12 pr-6", className)} {...props} />
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
  <th
    ref={ref}
    className={clx("txt-compact-small-plus h-12 pr-6 text-left", className)}
    {...props}
  />
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
  translations?: {
    of?: string
    results?: string
    pages?: string
    prev?: string
    next?: string
  }
  previousPage: () => void
  nextPage: () => void
}

/**
 * This component is based on the `div` element and supports all of its props
 */
const Pagination = React.forwardRef<HTMLDivElement, TablePaginationProps>(
  (
    {
      className,
      /**
       * The total number of items.
       */
      count,
      /**
       * The number of items per page.
       */
      pageSize,
      /**
       * The total number of pages.
       */
      pageCount,
      /**
       * The current page index.
       */
      pageIndex,
      /**
       * Whether there's a previous page that can be navigated to.
       */
      canPreviousPage,
      /**
       * Whether there's a next page that can be navigated to.
       */
      canNextPage,
      /**
       * A function that handles navigating to the next page.
       * This function should handle retrieving data for the next page.
       */
      nextPage,
      /**
       * A function that handles navigating to the previous page.
       * This function should handle retrieving data for the previous page.
       */
      previousPage,
      /**
       * An optional object of words to use in the pagination component.
       * Use this to override the default words, or translate them into another language.
       */
      translations = {
        of: "of",
        results: "results",
        pages: "pages",
        prev: "Prev",
        next: "Next",
      },
      ...props
    }: TablePaginationProps,
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
          "text-ui-fg-subtle txt-compact-small-plus flex w-full items-center justify-between px-3 py-4",
          className
        )}
        {...props}
      >
        <div className="inline-flex items-center gap-x-1 px-3 py-[5px]">
          <p>{from}</p>
          <Minus className="text-ui-fg-muted" />
          <p>{`${to} ${translations.of} ${count} ${translations.results}`}</p>
        </div>
        <div className="flex items-center gap-x-2">
          <div className="inline-flex items-center gap-x-1 px-3 py-[5px]">
            <p>
              {pageIndex + 1} {translations.of} {Math.max(pageCount, 1)}{" "}
              {translations.pages}
            </p>
          </div>
          <Button
            type="button"
            variant={"transparent"}
            onClick={previousPage}
            disabled={!canPreviousPage}
          >
            {translations.prev}
          </Button>
          <Button
            type="button"
            variant={"transparent"}
            onClick={nextPage}
            disabled={!canNextPage}
          >
            {translations.next}
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
