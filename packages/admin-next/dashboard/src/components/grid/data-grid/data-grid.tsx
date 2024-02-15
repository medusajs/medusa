import { zodResolver } from "@hookform/resolvers/zod"
import { Container, clx } from "@medusajs/ui"
import {
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"
import { MouseEvent, useRef, useState } from "react"
import { DefaultValues, useForm } from "react-hook-form"
import { infer as Infer, ZodObject } from "zod"
import { CellCoordinates } from "./types"

type DataGridProps<TData, TSchema extends ZodObject<any, any, any>> = {
  data: TData[]
  columns: ColumnDef<TData>[]
  schema: TSchema
  getSubRows: (row: TData) => TData[] | undefined
  formatter: (data: TData[]) => DefaultValues<Infer<TSchema>>
}

const ROW_HEIGHT = 40

export const DataGrid = <TData, TSchema extends ZodObject<any, any, any>>({
  data,
  columns,
  schema,
  formatter,
  getSubRows,
}: DataGridProps<TData, TSchema>) => {
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const form = useForm<Infer<typeof schema>>({
    defaultValues: formatter(data),
    resolver: zodResolver(schema),
  })

  const grid = useReactTable({
    data: data,
    columns,
    getSubRows,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      register: form.register,
    },
  })

  const { flatRows } = grid.getRowModel()

  const rowVirtualizer = useVirtualizer({
    count: flatRows.length,
    estimateSize: () => ROW_HEIGHT,
    getScrollElement: () => tableContainerRef.current,
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  })

  const [anchor, setAnchor] = useState<CellCoordinates | null>(null)

  const handleCellClick = (e: MouseEvent<HTMLTableCellElement>) => {
    const target = e.target

    /**
     * Check if the click was on a presentation element.
     * If so, we don't want to set the anchor.
     */
    if (
      target instanceof HTMLElement &&
      target.querySelector("[data-role=presentation]")
    ) {
      return
    }

    const rowIndex = parseInt(e.currentTarget.dataset.rowIndex!)
    const columnIndex = parseInt(e.currentTarget.dataset.columnIndex!)

    setAnchor({
      row: rowIndex,
      column: columnIndex,
    })
  }

  const getIsAnchor = (rowIndex: number, columnIndex: number) => {
    return anchor?.row === rowIndex && anchor?.column === columnIndex
  }

  return (
    <Container className="overflow-hidden p-0">
      <div className="border-b p-4"></div>
      <div
        ref={tableContainerRef}
        style={{
          overflow: "auto",
          position: "relative",
          height: "600px",
        }}
      >
        <table className="text-ui-fg-subtle grid">
          <thead className="txt-compact-small-plus bg-ui-bg-subtle sticky top-0 z-[1] grid">
            {grid.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="flex h-10 w-full">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      style={{
                        width: header.getSize(),
                      }}
                      className="bg-ui-bg-base flex items-center border-b border-r px-4 py-2.5"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody
            className="relative grid"
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = flatRows[virtualRow.index] as Row<TData>

              return (
                <tr
                  data-index={virtualRow.index}
                  ref={(node) => rowVirtualizer.measureElement(node)}
                  key={row.id}
                  style={{
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className="bg-ui-bg-subtle txt-compact-small absolute flex h-10 w-full"
                >
                  {row.getVisibleCells().map((cell, index) => {
                    return (
                      <td
                        key={cell.id}
                        style={{
                          width: cell.column.getSize(),
                        }}
                        onClick={handleCellClick}
                        data-row-index={virtualRow.index}
                        data-column-index={index}
                        className={clx(
                          "bg-ui-bg-base has-[:disabled]:bg-ui-bg-subtle relative flex items-center border-b border-r px-4 py-2.5 outline-none",
                          "after:transition-fg after:border-ui-fg-interactive after:absolute after:-bottom-px after:-left-px after:-right-px after:-top-px after:box-border after:border after:border-[2px] after:opacity-0 after:content-['']",
                          {
                            "after:opacity-100": getIsAnchor(
                              virtualRow.index,
                              index
                            ),
                          }
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Container>
  )
}
