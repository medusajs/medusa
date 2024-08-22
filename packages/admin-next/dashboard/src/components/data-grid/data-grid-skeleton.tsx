import { Table } from "@medusajs/ui"
import { ColumnDef } from "@tanstack/react-table"
import { Skeleton } from "../common/skeleton"

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
  const colWidth = 100 / colCount

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          {columns.map((_col, i) => {
            return (
              <Table.HeaderCell
                key={i}
                style={{
                  width: `${colWidth}%`,
                }}
              >
                <Skeleton className="h-7" />
              </Table.HeaderCell>
            )
          })}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((_, j) => (
          <Table.Row key={j}>
            {columns.map((_col, k) => {
              return (
                <Table.Cell key={k}>
                  <Skeleton className="h-7" />
                </Table.Cell>
              )
            })}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}
