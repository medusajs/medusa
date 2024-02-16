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
import {
  MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
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

  const [isDragging, setIsDragging] = useState(false)
  const [anchor, setAnchor] = useState<CellCoordinates | null>(null)
  const [selection, setSelection] = useState<CellCoordinates[]>([])

  const handleMouseDown = (e: ReactMouseEvent<HTMLTableCellElement>) => {
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

    setIsDragging(true)

    const coordinates: CellCoordinates = {
      row: rowIndex,
      column: columnIndex,
    }

    setSelection([coordinates])
    setAnchor(coordinates)
  }

  const getIsAnchor = (rowIndex: number, columnIndex: number) => {
    return anchor?.row === rowIndex && anchor?.column === columnIndex
  }

  const handleMouseOver = (e: ReactMouseEvent<HTMLTableCellElement>) => {
    /**
     * If we're not dragging or there is no anchor,
     * then we don't want to do anything.
     */
    if (!isDragging || !anchor) {
      return
    }

    const target = e.target

    /**
     * Check if the click was on a presentation element.
     * If so, we don't want to add it to the selection.
     */
    if (
      target instanceof HTMLElement &&
      target.querySelector("[data-role=presentation]")
    ) {
      return
    }

    const rowIndex = parseInt(e.currentTarget.dataset.rowIndex!)
    const columnIndex = parseInt(e.currentTarget.dataset.columnIndex!)

    /**
     * If the target column is not the same as the anchor column,
     * we don't want to add it to the selection.
     */
    if (anchor?.column !== columnIndex) {
      return
    }

    const direction =
      rowIndex > anchor.row ? "down" : rowIndex < anchor.row ? "up" : "none"

    const last = selection[selection.length - 1] ?? anchor

    /**
     * Check if the current cell is a direct neighbour of the last cell
     * in the selection.
     */
    const isNeighbour = Math.abs(rowIndex - last.row) === 1

    /**
     * If the current cell is a neighbour, we can simply update
     * the selection based on the direction.
     */
    if (isNeighbour) {
      setSelection((prev) => {
        return prev
          .filter((cell) => {
            if (direction === "down") {
              return (
                (cell.row <= rowIndex && cell.row >= anchor.row) ||
                cell.row === anchor.row
              )
            }

            if (direction === "up") {
              return (
                (cell.row >= rowIndex && cell.row <= anchor.row) ||
                cell.row === anchor.row
              )
            }

            return cell.row === anchor.row
          })
          .concat({ row: rowIndex, column: columnIndex })
      })

      return
    }

    /**
     * If the current cell is not a neighbour, we instead
     * need to calculate all the valid cells between the
     * anchor and the current cell.
     */
    const cells: CellCoordinates[] = []

    function selectCell(i: number, columnIndex: number) {
      const possibleCell = document.querySelector(
        `[data-row-index="${i}"][data-column-index="${columnIndex}"]`
      )

      if (!possibleCell) {
        return
      }

      const isPresentation = possibleCell.querySelector(
        "[data-role=presentation]"
      )

      if (isPresentation) {
        return
      }

      cells.push({ row: i, column: columnIndex })
    }

    if (direction === "down") {
      for (let i = anchor.row; i <= rowIndex; i++) {
        selectCell(i, columnIndex)
      }
    }

    if (direction === "up") {
      for (let i = anchor.row; i >= rowIndex; i--) {
        selectCell(i, columnIndex)
      }
    }

    setSelection(cells)
  }

  const getIsSelected = (rowIndex: number, columnIndex: number) => {
    return selection.some(
      (cell) => cell.row === rowIndex && cell.column === columnIndex
    )
  }

  const handleMouseUp = useCallback((_e: MouseEvent) => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [handleMouseUp])

  return (
    <Container className="overflow-hidden p-0">
      <div className="border-b p-4"></div>
      <div
        ref={tableContainerRef}
        style={{
          overflow: "auto",
          position: "relative",
          height: "600px",
          userSelect: isDragging ? "none" : "auto",
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
                        onMouseDown={handleMouseDown}
                        onMouseOver={handleMouseOver}
                        data-row-index={virtualRow.index}
                        data-column-index={index}
                        className={clx(
                          "bg-ui-bg-base has-[:disabled]:bg-ui-bg-subtle relative flex items-center border-b border-r px-4 py-2.5 outline-none",
                          "after:transition-fg after:border-ui-fg-interactive after:invisible after:absolute after:-bottom-px after:-left-px after:-right-px after:-top-px after:box-border after:border-[2px] after:content-['']",
                          {
                            "after:visible": getIsAnchor(
                              virtualRow.index,
                              index
                            ),
                            "bg-ui-bg-highlight": getIsSelected(
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
