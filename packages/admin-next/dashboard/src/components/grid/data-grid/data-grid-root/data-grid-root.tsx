import { clx } from "@medusajs/ui"
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
import { FieldValues, Path, UseFormReturn } from "react-hook-form"

import {
  Command,
  useCommandHistory,
} from "../../../../hooks/use-command-history"
import { GridCellType, NON_INTERACTIVE_CELL_TYPES } from "../../constants"

type FieldCoordinates = {
  column: number
  row: number
}

export interface DataGridRootProps<
  TData,
  TFieldValues extends FieldValues = FieldValues
> {
  data?: TData[]
  columns: ColumnDef<TData>[]
  state: UseFormReturn<TFieldValues>
  getSubRows?: (row: TData) => TData[]
}

const ROW_HEIGHT = 40

/**
 * TODO: THIS IS OLD DATAGRID COMPONENT - REMOVE THIS AFTER ALL TABLE HAVE BEEN MIGRATED TO THE NEW DATAGRIDROOT FROM ../../data-grid
 */

export const DataGridRoot = <
  TData,
  TFieldValues extends FieldValues = FieldValues
>({
  data = [],
  columns,
  state,
  getSubRows,
}: DataGridRootProps<TData, TFieldValues>) => {
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const { execute, undo, redo, canRedo, canUndo } = useCommandHistory()
  const { register, control, getValues, setValue } = state

  const grid = useReactTable({
    data: data,
    columns,
    getSubRows,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      register: register,
      control: control,
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

  const [anchor, setAnchor] = useState<FieldCoordinates | null>(null)

  const [isSelecting, setIsSelecting] = useState(false)
  const [selection, setSelection] = useState<FieldCoordinates[]>([])

  const [isDragging, setIsDragging] = useState(false)
  const [dragSelection, setDragSelection] = useState<FieldCoordinates[]>([])

  const handleFocusInner = (target: HTMLElement) => {
    const editableField = target.querySelector("[data-field-id]")

    if (editableField instanceof HTMLInputElement) {
      requestAnimationFrame(() => {
        editableField.focus()
        editableField.setSelectionRange(
          editableField.value.length,
          editableField.value.length
        )
      })
    }
  }

  const handleBlurAnchor = () => {
    const activeElement = document.activeElement

    if (anchor && activeElement instanceof HTMLElement) {
      activeElement.blur()
    }
  }

  const isNonInteractive = (element: HTMLElement) => {
    const type = element.getAttribute("data-cell-type")

    if (!type) {
      return true
    }

    return NON_INTERACTIVE_CELL_TYPES.includes(type as GridCellType)
  }

  const handleMouseDown = (e: ReactMouseEvent<HTMLTableCellElement>) => {
    e.stopPropagation()
    e.preventDefault()

    const target = e.target

    /**
     * Check if the click was on a presentation element.
     * If so, we don't want to set the anchor.
     */
    if (target instanceof HTMLElement && isNonInteractive(target)) {
      return
    }

    const rowIndex = parseInt(e.currentTarget.dataset.rowIndex!)
    const columnIndex = parseInt(e.currentTarget.dataset.columnIndex!)

    const isAnchor = getIsAnchor(rowIndex, columnIndex)

    if (e.detail === 2 || isAnchor) {
      handleFocusInner(e.currentTarget)
      return
    } else {
      // reset focus so the previous cell doesn't keep the focus
      handleBlurAnchor()
    }

    const coordinates: FieldCoordinates = {
      row: rowIndex,
      column: columnIndex,
    }

    setSelection([coordinates])
    setAnchor(coordinates)
    setIsSelecting(true)
  }

  const handleDragDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setIsDragging(true)
  }

  const getIsAnchor = (rowIndex: number, columnIndex: number) => {
    return anchor?.row === rowIndex && anchor?.column === columnIndex
  }

  const handleMouseOver = (e: ReactMouseEvent<HTMLTableCellElement>) => {
    /**
     * If we're not dragging and not selecting or there is no anchor,
     * then we don't want to do anything.
     */
    if ((!isSelecting && !isDragging) || !anchor) {
      return
    }

    const target = e.target

    /**
     * Check if the click was on a presentation element.
     * If so, we don't want to add it to the selection.
     */
    if (target instanceof HTMLElement && isNonInteractive(target)) {
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
      if (isSelecting) {
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

      if (isDragging) {
        if (anchor.row === rowIndex) {
          return
        }

        setDragSelection((prev) => {
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
    }

    /**
     * If the current cell is not a neighbour, we instead
     * need to calculate all the valid cells between the
     * anchor and the current cell.
     */
    let cells: FieldCoordinates[] = []

    function selectCell(i: number, columnIndex: number) {
      const possibleCell = tableContainerRef.current?.querySelector(
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

    if (isSelecting) {
      setSelection(cells)
      return
    }

    if (isDragging) {
      cells = cells.filter((cell) => cell.row !== anchor.row)

      setDragSelection(cells)
      return
    }
  }

  const getIsDragTarget = (rowIndex: number, columnIndex: number) => {
    return dragSelection.some(
      (cell) => cell.row === rowIndex && cell.column === columnIndex
    )
  }

  const getIsSelected = (rowIndex: number, columnIndex: number) => {
    return selection.some(
      (cell) => cell.row === rowIndex && cell.column === columnIndex
    )
  }

  const getSelectionIds = useCallback((fields: FieldCoordinates[]) => {
    return fields
      .map((field) => {
        const element = document.querySelector(
          `[data-row-index="${field.row}"][data-column-index="${field.column}"]`
        ) as HTMLTableCellElement

        return element
          ?.querySelector("[data-field-id]")
          ?.getAttribute("data-field-id")
      })
      .filter(Boolean) as string[]
  }, [])

  const getSelectionValues = useCallback(
    (ids: string[]): string[] => {
      const rawValues = ids.map((id) => {
        return getValues(id as Path<TFieldValues>)
      })

      return rawValues.map((v) => JSON.stringify(v))
    },
    [getValues]
  )

  const setSelectionValues = useCallback(
    (ids: string[], values: string[]) => {
      ids.forEach((id, i) => {
        const value = values[i]

        if (!value) {
          return
        }

        setValue(id as Path<TFieldValues>, JSON.parse(value), {
          shouldDirty: true,
          shouldTouch: true,
        })
      })
    },
    [setValue]
  )

  const handleCopy = useCallback(
    (e: ClipboardEvent) => {
      if (selection.length === 0) {
        return
      }

      const fieldIds = getSelectionIds(selection)
      const values = getSelectionValues(fieldIds)

      const clipboardData = values.join("\n")

      e.clipboardData?.setData("text/plain", clipboardData)
      e.preventDefault()
    },
    [selection, getSelectionIds, getSelectionValues]
  )

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      const data = e.clipboardData?.getData("text/plain")

      if (!data) {
        return
      }

      const fieldIds = getSelectionIds(selection)

      const prev = getSelectionValues(fieldIds)
      const next = data.split("\n")

      const command = new GridCommand({
        next,
        prev,
        selection: fieldIds,
        setter: setSelectionValues,
      })

      execute(command)
    },
    [
      selection,
      execute,
      getSelectionValues,
      setSelectionValues,
      getSelectionIds,
    ]
  )

  const handleCommandHistory = useCallback(
    (e: KeyboardEvent) => {
      if (!canRedo && !canUndo) {
        return
      }

      if (e.key.toLowerCase() === "z" && e.metaKey && !e.shiftKey) {
        console.log(canUndo)
        e.preventDefault()
        undo()
      }

      if (e.key.toLowerCase() === "z" && e.metaKey && e.shiftKey) {
        e.preventDefault()
        redo()
      }
    },
    [undo, redo, canRedo, canUndo]
  )

  const handleEndDrag = useCallback(() => {
    if (!anchor) {
      return
    }

    const fieldIds = getSelectionIds(dragSelection)
    const anchorId = getSelectionIds([anchor])

    const anchorValue = getSelectionValues(anchorId)?.[0]

    const prev = getSelectionValues(fieldIds)
    const next = prev.map(() => anchorValue)

    const command = new GridCommand({
      next,
      prev,
      selection: fieldIds,
      setter: setSelectionValues,
    })

    execute(command)

    setSelection(dragSelection)
    setDragSelection([])
    setIsDragging(false)
  }, [
    anchor,
    getSelectionIds,
    dragSelection,
    getSelectionValues,
    setSelectionValues,
    execute,
  ])

  const handleMouseUp = useCallback(
    (_e: MouseEvent) => {
      if (isSelecting) {
        setIsSelecting(false)
        return
      }

      if (isDragging) {
        handleEndDrag()
        return
      }
    },
    [isDragging, isSelecting, handleEndDrag]
  )

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("copy", handleCopy)
    document.addEventListener("paste", handlePaste)
    document.addEventListener("keydown", handleCommandHistory)

    return () => {
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("copy", handleCopy)
      document.removeEventListener("paste", handlePaste)
      document.removeEventListener("keydown", handleCommandHistory)
    }
  }, [handleMouseUp, handleCopy, handlePaste, handleCommandHistory])

  return (
    <div className="bg-ui-bg-subtle size-full overflow-hidden">
      <div
        ref={tableContainerRef}
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
                    const isAnchor = getIsAnchor(virtualRow.index, index)
                    const isSelected = getIsSelected(virtualRow.index, index)
                    const isDragTarget = getIsDragTarget(
                      virtualRow.index,
                      index
                    )

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
                          "bg-ui-bg-base has-[[data-role='presentation']]:bg-ui-bg-subtle relative flex items-center border-b border-r p-0 outline-none",
                          "after:transition-fg after:border-ui-fg-interactive after:pointer-events-none after:invisible after:absolute after:-bottom-px after:-left-px after:-right-px after:-top-px after:box-border after:border-[2px] after:content-['']",
                          {
                            "after:visible": isAnchor,
                            "bg-ui-bg-highlight focus-within:bg-ui-bg-base":
                              isSelected || isAnchor,
                            "bg-ui-bg-base-hover": isDragTarget,
                          }
                        )}
                        tabIndex={-1}
                      >
                        <div className="relative h-full w-full">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                          {isAnchor && (
                            <div
                              onMouseDown={handleDragDown}
                              className="bg-ui-fg-interactive absolute bottom-0 right-0 z-[3] size-1.5 cursor-ns-resize"
                            />
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
  )
}

type GridCommandArgs = {
  selection: string[]
  setter: (selection: string[], values: string[]) => void
  prev: string[]
  next: string[]
}

class GridCommand implements Command {
  private _selection: string[]

  private _prev: string[]
  private _next: string[]

  private _setter: (selection: string[], values: string[]) => void

  constructor({ selection, setter, prev, next }: GridCommandArgs) {
    this._selection = selection
    this._setter = setter
    this._prev = prev
    this._next = next
  }

  execute() {
    this._setter(this._selection, this._next)
  }

  undo() {
    this._setter(this._selection, this._prev)
  }

  redo() {
    this.execute()
  }
}
