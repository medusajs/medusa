import { Table, clx } from "@medusajs/ui"
import { ColumnDef } from "@tanstack/react-table"
import { Skeleton } from "../../../common/skeleton"

type DataTableSkeletonProps = {
  columns: ColumnDef<any, any>[]
  rowCount: number
  searchable: boolean
  orderBy: boolean
  filterable: boolean
  pagination: boolean
}

export const DataTableSkeleton = ({
  columns,
  rowCount,
  filterable,
  searchable,
  orderBy,
  pagination,
}: DataTableSkeletonProps) => {
  const rows = Array.from({ length: rowCount }, (_, i) => i)

  const hasToolbar = filterable || searchable || orderBy
  const hasSearchOrOrder = searchable || orderBy

  const hasSelect = columns.find((c) => c.id === "select")
  const hasActions = columns.find((c) => c.id === "actions")
  const colCount = columns.length - (hasSelect ? 1 : 0) - (hasActions ? 1 : 0)
  const colWidth = 100 / colCount

  return (
    <div>
      {hasToolbar && (
        <div className="flex items-center justify-between px-6 py-4">
          {filterable && <Skeleton className="h-7 w-full max-w-[160px]" />}
          {hasSearchOrOrder && (
            <div className="flex items-center gap-x-2">
              {searchable && <Skeleton className="h-7 w-[160px]" />}
              {orderBy && <Skeleton className="h-7 w-7" />}
            </div>
          )}
        </div>
      )}
      <Table>
        <Table.Header>
          <Table.Row
            className={clx({
              "border-b-0 [&_th:last-of-type]:w-[1%] [&_th:last-of-type]:whitespace-nowrap":
                hasActions,
              "[&_th:first-of-type]:w-[1%] [&_th:first-of-type]:whitespace-nowrap":
                hasSelect,
            })}
          >
            {columns.map((col, i) => {
              const isSelectHeader = col.id === "select"
              const isActionsHeader = col.id === "actions"

              const isSpecialHeader = isSelectHeader || isActionsHeader

              return (
                <Table.HeaderCell
                  key={i}
                  style={{
                    width: !isSpecialHeader ? `${colWidth}%` : undefined,
                  }}
                >
                  {isActionsHeader ? null : (
                    <Skeleton
                      className={clx("h-7", {
                        "w-7": isSelectHeader,
                        "w-full": !isSelectHeader,
                      })}
                    />
                  )}
                </Table.HeaderCell>
              )
            })}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((_, j) => (
            <Table.Row key={j}>
              {columns.map((col, k) => {
                const isSpecialCell =
                  col.id === "select" || col.id === "actions"

                return (
                  <Table.Cell key={k}>
                    <Skeleton
                      className={clx("h-7", {
                        "w-7": isSpecialCell,
                        "w-full": !isSpecialCell,
                      })}
                    />
                  </Table.Cell>
                )
              })}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {pagination && (
        <div className="flex items-center justify-between p-4">
          <Skeleton className="h-7 w-[138px]" />
          <div className="flex items-center gap-x-2">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-7 w-11" />
            <Skeleton className="h-7 w-11" />
          </div>
        </div>
      )}
    </div>
  )
}
