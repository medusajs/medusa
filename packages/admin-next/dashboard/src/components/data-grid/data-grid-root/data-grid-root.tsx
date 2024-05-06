import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { clx } from "@medusajs/ui"
import {
  CellContext,
  ColumnDef,
  Row,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"
import { FieldValues, UseFormReturn } from "react-hook-form"
import { useCommandHistory } from "../../../hooks/use-command-history"
import { DataGridContext } from "../context"
import { SortedSet } from "../models"
import { CellCoords } from "../types"
import { generateCellId, isCellMatch } from "../utils"

interface DataGridRootProps<
  TData,
  TFieldValues extends FieldValues = FieldValues
> {
  data?: TData[]
  columns: ColumnDef<TData>[]
  state: UseFormReturn<TFieldValues>
  getSubRows?: (row: TData) => TData[]
}

const ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]
const ROW_HEIGHT = 40

export const DataGridRoot = <
  TData,
  TFieldValues extends FieldValues = FieldValues
>({
  data = [],
  columns,
  state,
  getSubRows,
}: DataGridRootProps<TData, TFieldValues>) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const { redo, undo, execute } = useCommandHistory()
  const { register, control, getValues, setValue } = state

  const [columnVisibility, onColumnVisibilityChange] =
    useState<VisibilityState>({})

  const grid = useReactTable({
    data: data,
    columns,
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange,
    getSubRows,
    getCoreRowModel: getCoreRowModel(),
  })

  const { flatRows } = grid.getRowModel()

  const rowVirtualizer = useVirtualizer({
    count: flatRows.length,
    estimateSize: () => ROW_HEIGHT,
    getScrollElement: () => containerRef.current,
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  })

  const cols = useMemo(() => new SortedSet<number>(), [])
  const rows = useMemo(() => new SortedSet<number>(), [])

  const [cells, setCells] = useState<Record<string, boolean>>({})

  const [anchor, setAnchor] = useState<CellCoords | null>(null)
  const [selection, setSelection] = useState<CellCoords[]>([])

  const [isSelecting, setIsSelecting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const onClickOverlay = useCallback((coords: CellCoords) => {
    setAnchor(coords)
    setSelection([coords])
  }, [])

  const onRegisterCell = useCallback(
    (coordinates: CellCoords) => {
      cols.insert(coordinates.col)
      rows.insert(coordinates.row)

      const id = generateCellId(coordinates)

      setCells((prev) => {
        return {
          ...prev,
          [id]: true,
        }
      })
    },
    [cols, rows]
  )

  const onUnregisterCell = useCallback(
    (coordinates: CellCoords) => {
      cols.remove(coordinates.col)
      rows.remove(coordinates.row)

      const id = generateCellId(coordinates)

      setCells((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
    },
    [cols, rows]
  )

  const handleArrowKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!anchor) {
        return
      }

      e.preventDefault()

      const { row, col } = anchor

      switch (e.key) {
        case "ArrowUp": {
          const previousRow = rows.getPrev(row)

          if (previousRow === null) {
            return
          }

          rowVirtualizer.scrollToIndex(previousRow, {
            align: "center",
            behavior: "auto",
          })
          setAnchor({ row: previousRow, col })

          break
        }
        case "ArrowDown": {
          const nextRow = rows.getNext(row)

          if (nextRow === null) {
            return
          }

          rowVirtualizer.scrollToIndex(nextRow, {
            align: "center",
            behavior: "auto",
          })
          setAnchor({ row: nextRow, col })

          break
        }
        case "ArrowLeft": {
          const previousCol = cols.getPrev(col)

          if (previousCol === null) {
            return
          }

          setAnchor({ row, col: previousCol })

          break
        }
        case "ArrowRight": {
          const nextCol = cols.getNext(col)

          if (nextCol === null) {
            return
          }

          setAnchor({ row, col: nextCol })

          break
        }
      }
    },
    [anchor, cols, rows, rowVirtualizer]
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (ARROW_KEYS.includes(e.key)) {
        handleArrowKeyDown(e)
      }
    },
    [handleArrowKeyDown]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <DataGridContext.Provider
      value={{
        control,
        anchor,
        onRegisterCell,
        onUnregisterCell,
        onClickOverlay,
      }}
    >
      <div className="bg-ui-bg-subtle size-full overflow-hidden">
        <div
          ref={containerRef}
          style={{
            overflow: "auto",
            position: "relative",
            height: "100%",
            userSelect: isSelecting || isDragging ? "none" : "auto",
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
                        className="bg-ui-bg-base txt-compact-small-plus flex items-center border-b border-r px-4 py-2.5"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
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
                      const coords: CellCoords = {
                        row: virtualRow.index,
                        col: index,
                      }

                      const isAnchor = isCellMatch(coords, anchor)
                      const isSelected = selection.some((cell) =>
                        isCellMatch(coords, cell)
                      )

                      return (
                        <td
                          key={cell.id}
                          style={{
                            width: cell.column.getSize(),
                          }}
                          data-row-index={virtualRow.index}
                          data-column-index={index}
                          className={clx(
                            "bg-ui-bg-base relative flex items-center border-b border-r p-0 outline-none",
                            "after:transition-fg after:border-ui-fg-interactive after:pointer-events-none after:invisible after:absolute after:-bottom-px after:-left-px after:-right-px after:-top-px after:box-border after:border-[2px] after:content-['']",
                            {
                              "after:visible": isAnchor,
                            },
                            {
                              "bg-ui-bg-highlight focus-within:bg-ui-bg-base":
                                isSelected || isAnchor,
                            }
                          )}
                          tabIndex={-1}
                        >
                          <div className="relative h-full w-full">
                            {flexRender(cell.column.columnDef.cell, {
                              ...cell.getContext(),
                              columnIndex: index,
                            } as CellContext<TData, any>)}
                            {isAnchor && (
                              <div className="bg-ui-fg-interactive absolute bottom-0 right-0 z-[3] size-1.5 cursor-ns-resize" />
                            )}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DataGridContext.Provider>
  )
}
