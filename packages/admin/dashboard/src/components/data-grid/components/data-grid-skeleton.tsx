import { ColumnDef } from "@tanstack/react-table"
import { Skeleton } from "../../common/skeleton"

type DataGridSkeletonProps<TData> = {
  columns: ColumnDef<TData>[]
  rows?: number
}

export const DataGridSkeleton = <TData,>({
  columns,
  rows: rowCount = 10,
}: DataGridSkeletonProps<TData>) => {
  const rows = Array.from({ length: rowCount }, (_, i) => i)

  const colCount = columns.length

  return (
    <div className="size-full bg-ui-bg-subtle">
      <div className="border-b bg-ui-bg-base p-4">
        <div className="h-7 w-[116px] animate-pulse rounded-md bg-ui-button-neutral" />
      </div>
      <div className="size-full overflow-auto bg-ui-bg-subtle">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${colCount}, 1fr)`,
          }}
        >
          {columns.map((_col, i) => {
            return (
              <div
                key={i}
                className="flex h-10 w-[200px] items-center border-b border-r bg-ui-bg-base px-4 py-2.5 last:border-r-0"
              >
                <Skeleton className="h-[14px] w-[164px]" />
              </div>
            )
          })}
        </div>
        <div>
          {rows.map((_, j) => (
            <div
              className="grid"
              style={{ gridTemplateColumns: `repeat(${colCount}, 1fr)` }}
              key={j}
            >
              {columns.map((_col, k) => {
                return (
                  <div
                    key={k}
                    className="flex h-10 w-[200px] items-center border-b border-r bg-ui-bg-base px-4 py-2.5 last:border-r-0"
                  >
                    <Skeleton className="h-[14px] w-[164px]" />
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
