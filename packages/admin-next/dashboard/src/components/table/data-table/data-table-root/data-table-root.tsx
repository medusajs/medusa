import { CommandBar, Table, clx } from "@medusajs/ui"
import {
  ColumnDef,
  Table as ReactTable,
  Row,
  flexRender,
} from "@tanstack/react-table"
import { ComponentPropsWithoutRef, Fragment, UIEvent, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { NoResults } from "../../../common/empty-table-content"

type BulkCommand = {
  label: string
  shortcut: string
  action: (selection: Record<string, boolean>) => Promise<void>
}

export interface DataTableRootProps<TData> {
  /**
   * The table instance to render
   */
  table: ReactTable<TData>
  /**
   * The columns to render
   */
  columns: ColumnDef<TData, any>[]
  /**
   * Function to generate a link to navigate to when clicking on a row
   */
  navigateTo?: (row: Row<TData>) => string
  /**
   * Bulk actions to render
   */
  commands?: BulkCommand[]
  /**
   * The total number of items in the table
   */
  count?: number
  /**
   * Whether to display pagination controls
   */
  pagination?: boolean
  /**
   * Whether the table is empty due to no results from the active query
   */
  noResults?: boolean
  /**
   * The layout of the table
   */
  layout?: "fill" | "fit"
}

/**
 * TODO
 *
 * Add a sticky header to the table that shows the column name when scrolling through the table vertically.
 *
 * This is a bit tricky as we can't support horizontal scrolling and sticky headers at the same time, natively
 * with CSS. We need to implement a custom solution for this. One solution is to render a duplicate table header
 * using a DIV that, but it will require rerendeing the duplicate header every time the window is resized, to keep
 * the columns aligned.
 */

/**
 * Table component for rendering a table with pagination, filtering and ordering.
 */
export const DataTableRoot = <TData,>({
  table,
  columns,
  pagination,
  navigateTo,
  commands,
  count = 0,
  noResults = false,
  layout = "fit",
}: DataTableRootProps<TData>) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [showStickyBorder, setShowStickyBorder] = useState(false)

  const hasSelect = columns.find((c) => c.id === "select")
  const hasActions = columns.find((c) => c.id === "actions")
  const hasCommandBar = commands && commands.length > 0

  const rowSelection = table.getState().rowSelection
  const { pageIndex, pageSize } = table.getState().pagination

  const colCount = columns.length - (hasSelect ? 1 : 0) - (hasActions ? 1 : 0)
  const colWidth = 100 / colCount

  const handleHorizontalScroll = (e: UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft

    if (scrollLeft > 0) {
      setShowStickyBorder(true)
    } else {
      setShowStickyBorder(false)
    }
  }

  const handleAction = async (action: BulkCommand["action"]) => {
    await action(rowSelection).then(() => {
      table.resetRowSelection()
    })
  }

  return (
    <div
      className={clx("flex w-full flex-col overflow-hidden", {
        "flex flex-1 flex-col": layout === "fill",
      })}
    >
      <div
        onScroll={handleHorizontalScroll}
        className={clx("w-full", {
          "min-h-0 flex-grow overflow-auto": layout === "fill",
          "overflow-x-auto": layout === "fit",
        })}
      >
        {!noResults ? (
          <Table className="w-full">
            <Table.Header className="border-t-0">
              {table.getHeaderGroups().map((headerGroup) => {
                return (
                  <Table.Row
                    key={headerGroup.id}
                    className={clx({
                      "border-b-0 [&_th:last-of-type]:w-[1%] [&_th:last-of-type]:whitespace-nowrap":
                        hasActions,
                      "[&_th:first-of-type]:w-[1%] [&_th:first-of-type]:whitespace-nowrap":
                        hasSelect,
                    })}
                  >
                    {headerGroup.headers.map((header, index) => {
                      const isActionHeader = header.id === "actions"
                      const isSelectHeader = header.id === "select"
                      const isSpecialHeader = isActionHeader || isSelectHeader

                      const firstHeader = headerGroup.headers.findIndex(
                        (h) => h.id !== "select"
                      )
                      const isFirstHeader =
                        firstHeader !== -1
                          ? header.id === headerGroup.headers[firstHeader].id
                          : index === 0

                      const isStickyHeader = isSelectHeader || isFirstHeader

                      return (
                        <Table.HeaderCell
                          data-table-header-id={header.id}
                          key={header.id}
                          style={{
                            width: !isSpecialHeader
                              ? `${colWidth}%`
                              : undefined,
                          }}
                          className={clx({
                            "bg-ui-bg-base sticky left-0 after:absolute after:inset-y-0 after:right-0 after:h-full after:w-px after:bg-transparent after:content-['']":
                              isStickyHeader,
                            "left-[68px]":
                              isStickyHeader && hasSelect && !isSelectHeader,
                            "after:bg-ui-border-base":
                              showStickyBorder &&
                              isStickyHeader &&
                              !isSpecialHeader,
                          })}
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
                const to = navigateTo ? navigateTo(row) : undefined
                const isRowDisabled = hasSelect && !row.getCanSelect()

                return (
                  <Table.Row
                    key={row.id}
                    data-selected={row.getIsSelected()}
                    className={clx(
                      "transition-fg group/row [&_td:last-of-type]:w-[1%] [&_td:last-of-type]:whitespace-nowrap",
                      {
                        "cursor-pointer": !!to,
                        "bg-ui-bg-highlight hover:bg-ui-bg-highlight-hover":
                          row.getIsSelected(),
                        "!bg-ui-bg-disabled !hover:bg-ui-bg-disabled":
                          isRowDisabled,
                      }
                    )}
                    onClick={to ? () => navigate(to) : undefined}
                  >
                    {row.getVisibleCells().map((cell, index) => {
                      const visibleCells = row.getVisibleCells()
                      const isSelectCell = cell.column.id === "select"

                      const firstCell = visibleCells.findIndex(
                        (h) => h.column.id !== "select"
                      )
                      const isFirstCell =
                        firstCell !== -1
                          ? cell.column.id === visibleCells[firstCell].column.id
                          : index === 0

                      const isStickyCell = isSelectCell || isFirstCell

                      /**
                       * If the table has nested rows, we need to offset the cell padding
                       * to indicate the depth of the row.
                       */
                      const depthOffset =
                        row.depth > 0 && isFirstCell
                          ? row.depth * 14 + 24
                          : undefined

                      return (
                        <Table.Cell
                          key={cell.id}
                          className={clx({
                            "bg-ui-bg-base group-data-[selected=true]/row:bg-ui-bg-highlight group-data-[selected=true]/row:group-hover/row:bg-ui-bg-highlight-hover group-hover/row:bg-ui-bg-base-hover transition-fg sticky left-0 after:absolute after:inset-y-0 after:right-0 after:h-full after:w-px after:bg-transparent after:content-['']":
                              isStickyCell,
                            "left-[68px]":
                              isStickyCell && hasSelect && !isSelectCell,
                            "after:bg-ui-border-base":
                              showStickyBorder && isStickyCell && !isSelectCell,
                            "!bg-ui-bg-disabled !hover:bg-ui-bg-disabled":
                              isRowDisabled,
                          })}
                          style={{
                            paddingLeft: depthOffset
                              ? `${depthOffset}px`
                              : undefined,
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Table.Cell>
                      )
                    })}
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
        ) : (
          <div className={clx({ "border-b": layout === "fit" })}>
            <NoResults />
          </div>
        )}
      </div>
      {pagination && (
        <div className={clx({ "border-t": layout === "fill" })}>
          <Pagination
            canNextPage={table.getCanNextPage()}
            canPreviousPage={table.getCanPreviousPage()}
            nextPage={table.nextPage}
            previousPage={table.previousPage}
            count={count}
            pageIndex={pageIndex}
            pageCount={table.getPageCount()}
            pageSize={pageSize}
          />
        </div>
      )}
      {hasCommandBar && (
        <CommandBar open={!!Object.keys(rowSelection).length}>
          <CommandBar.Bar>
            <CommandBar.Value>
              {t("general.countSelected", {
                count: Object.keys(rowSelection).length,
              })}
            </CommandBar.Value>
            <CommandBar.Seperator />
            {commands?.map((command, index) => {
              return (
                <Fragment key={index}>
                  <CommandBar.Command
                    label={command.label}
                    shortcut={command.shortcut}
                    action={() => handleAction(command.action)}
                  />
                  {index < commands.length - 1 && <CommandBar.Seperator />}
                </Fragment>
              )
            })}
          </CommandBar.Bar>
        </CommandBar>
      )}
    </div>
  )
}

type PaginationProps = Omit<
  ComponentPropsWithoutRef<typeof Table.Pagination>,
  "translations"
>

const Pagination = (props: PaginationProps) => {
  const { t } = useTranslation()

  const translations = {
    of: t("general.of"),
    results: t("general.results"),
    pages: t("general.pages"),
    prev: t("general.prev"),
    next: t("general.next"),
  }

  return (
    <Table.Pagination
      className="flex-shrink-0"
      {...props}
      translations={translations}
    />
  )
}
