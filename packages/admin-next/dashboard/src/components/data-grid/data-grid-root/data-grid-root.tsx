import {
  FocusEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { Adjustments } from "@medusajs/icons"
import { Button, DropdownMenu, clx } from "@medusajs/ui"
import {
  Cell,
  CellContext,
  ColumnDef,
  Row,
  Table,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { VirtualItem, useVirtualizer } from "@tanstack/react-virtual"
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form"
import { useCommandHistory } from "../../../hooks/use-command-history"
import { DataGridContext } from "../context"
import { Grid, PasteCommand, SortedSet, UpdateCommand } from "../models"
import { CellCoords } from "../types"
import {
  convertArrayToPrimitive,
  generateCellId,
  getColumnName,
  getColumnType,
  getFieldsInRange,
  getRange,
  isCellMatch,
} from "../utils"

interface DataGridRootProps<
  TData,
  TFieldValues extends FieldValues = FieldValues
> {
  data?: TData[]
  columns: ColumnDef<TData>[]
  state: UseFormReturn<TFieldValues>
  getSubRows?: (row: TData) => TData[] | undefined
}

const ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]
const VERTICAL_KEYS = ["ArrowUp", "ArrowDown"]

const ROW_HEIGHT = 40

/**
 * TODO:
 * - [Critical] Fix performing commands on cells that aren't currently rendered by the virtualizer.
 * - [Critical] Prevent action handlers from firing while editing a cell.
 * - [Important] Show field errors in the grid, and in topbar.
 * - [Minor] Extend the commands to also support modifying the anchor and rangeEnd, to restore the previous focus after undo/redo.
 * - [Stretch] Add support for only showing rows with errors.
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
  const containerRef = useRef<HTMLDivElement>(null)

  const { redo, undo, execute } = useCommandHistory()
  const { register, control, getValues, setValue } = state

  const cols = useMemo(() => new SortedSet<number>(), [])
  const rows = useMemo(() => new SortedSet<number>(), [])

  const [anchor, setAnchor] = useState<CellCoords | null>(null)
  const [rangeEnd, setRangeEnd] = useState<CellCoords | null>(null)
  const [dragEnd, setDragEnd] = useState<CellCoords | null>(null)

  const [selection, setSelection] = useState<Record<string, boolean>>({})
  const [dragSelection, setDragSelection] = useState<Record<string, boolean>>(
    {}
  )

  const [isSelecting, setIsSelecting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const [isEditing, setIsEditing] = useState(false)

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const grid = useReactTable({
    data: data,
    columns,
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getSubRows,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      size: 200,
      maxSize: 400,
    },
  })

  const { flatRows } = grid.getRowModel()

  const rowVirtualizer = useVirtualizer({
    count: flatRows.length,
    estimateSize: () => ROW_HEIGHT,
    getScrollElement: () => containerRef.current,
    overscan: 5,
  })

  const virtualRows = rowVirtualizer.getVirtualItems()
  const visibleColumns = grid.getVisibleLeafColumns()

  const columnVirtualizer = useVirtualizer({
    count: visibleColumns.length,
    estimateSize: (index) => visibleColumns[index].getSize(),
    getScrollElement: () => containerRef.current,
    horizontal: true,
    overscan: 3,
  })

  const virtualColumns = columnVirtualizer.getVirtualItems()

  let virtualPaddingLeft: number | undefined
  let virtualPaddingRight: number | undefined

  if (columnVirtualizer && virtualColumns?.length) {
    virtualPaddingLeft = virtualColumns[0]?.start ?? 0
    virtualPaddingRight =
      columnVirtualizer.getTotalSize() -
      (virtualColumns[virtualColumns.length - 1]?.end ?? 0)
  }

  const scrollToCell = useCallback(
    (coords: [number, number]) => {
      const [row, col] = coords

      columnVirtualizer.scrollToIndex(col, {
        align: "center",
        behavior: "auto",
      })

      rowVirtualizer.scrollToIndex(row, {
        align: "center",
        behavior: "auto",
      })
    },
    [columnVirtualizer, rowVirtualizer]
  )

  const _grid = useMemo(
    () => new Grid(flatRows.length, visibleColumns.length),
    [flatRows, visibleColumns]
  )

  function registerCell(coords: CellCoords) {
    _grid.registerCell(coords.row, coords.col, true)
  }

  /**
   * Clears the start and end of current range.
   */
  const clearRange = useCallback(
    (point?: CellCoords | null) => {
      const keys = Object.keys(selection)
      const anchorKey = anchor ? generateCellId(anchor) : null
      const newKey = point ? generateCellId(point) : null

      const isAnchorOnlySelected = keys.length === 1 && anchorKey === keys[0]
      const isAnchorNewPoint = anchorKey && newKey && anchorKey === newKey

      const shouldIgnoreAnchor = isAnchorOnlySelected && isAnchorNewPoint

      if (!shouldIgnoreAnchor) {
        setAnchor(null)
        setSelection({})
        setRangeEnd(null)
      }

      setDragSelection({})
    },
    [anchor, selection]
  )

  const setSingleRange = useCallback(
    (coordinates: CellCoords | null) => {
      clearRange(coordinates)

      setAnchor(coordinates)
      setRangeEnd(coordinates)
    },
    [clearRange]
  )

  const getSelectionValues = useCallback(
    (selection: Record<string, boolean>): string[] => {
      const ids = Object.keys(selection)

      if (!ids.length) {
        return []
      }

      const fields = getFieldsInRange(selection, containerRef.current)

      return fields.map((field) => {
        if (!field) {
          return ""
        }

        const value = getValues(field as Path<TFieldValues>)

        // Return the value as a string
        return `${value}`
      })
    },
    [getValues]
  )

  const setSelectionValues = useCallback(
    (selection: Record<string, boolean>, values: string[]) => {
      const ids = Object.keys(selection)

      if (!ids.length) {
        return
      }

      const type = getColumnType(ids[0], visibleColumns)
      const convertedValues = convertArrayToPrimitive(values, type)
      const fields = getFieldsInRange(selection, containerRef.current)

      fields.forEach((field, index) => {
        if (!field) {
          return
        }

        const valueIndex = index % values.length
        const value = convertedValues[valueIndex] as PathValue<
          TFieldValues,
          Path<TFieldValues>
        >

        setValue(field as Path<TFieldValues>, value)
      })
    },
    [setValue, visibleColumns]
  )

  /**
   * BUG: Sometimes the virtualizers will fail to scroll to the next/prev cell,
   * due to the element measurement not being part of the virtualizers memoized
   * array of measurements.
   *
   * Need to investigate why this is happening. A potential fix would be to
   * roll our own scroll management.
   */
  const handleKeyboardNavigation = useCallback(
    (e: KeyboardEvent) => {
      /**
       * If the user is currently editing a cell, we don't want to
       * handle the keyboard navigation.
       */
      if (isEditing) {
        return
      }

      const direction = VERTICAL_KEYS.includes(e.key)
        ? "vertical"
        : "horizontal"

      /**
       * If the user performs a horizontal navigation, we want to
       * use the anchor as the basis for the navigation.
       *
       * If the user performs a vertical navigation, the bases depends
       * on the type of interaction. If the user is holding shift, we want
       * to use the rangeEnd as the basis. If the user is not holding shift,
       * we want to use the anchor as the basis.
       */
      const basis =
        direction === "horizontal" ? anchor : e.shiftKey ? rangeEnd : anchor

      const updater =
        direction === "horizontal"
          ? setSingleRange
          : e.shiftKey
          ? setRangeEnd
          : setSingleRange

      if (!basis) {
        return
      }

      const { row, col } = basis

      const handleNavigation = (pos: [number, number]) => {
        e.preventDefault()

        const [row, col] = pos

        scrollToCell(pos)

        const newRange = { row, col }
        updater(newRange)
      }

      const next = _grid.getValidMovement(
        row,
        col,
        e.key,
        e.metaKey || e.ctrlKey
      )

      handleNavigation(next)
    },
    [isEditing, anchor, rangeEnd, scrollToCell, setSingleRange, _grid]
  )

  const handleUndo = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault()

      if (e.shiftKey) {
        redo()
        return
      }

      undo()
    },
    [redo, undo]
  )

  const handleSpaceKey = useCallback(
    (e: KeyboardEvent) => {
      if (!anchor || isEditing) {
        return
      }

      e.preventDefault()

      const id = generateCellId(anchor)
      const container = containerRef.current

      if (!container) {
        return
      }

      const input = container.querySelector(
        `[data-cell-id="${id}"]`
      ) as HTMLElement

      if (!input) {
        return
      }

      const field = input.getAttribute("data-field")

      if (!field) {
        return
      }

      const current = getValues(field as Path<TFieldValues>)
      const next = "" as PathValue<TFieldValues, Path<TFieldValues>>

      const command = new UpdateCommand({
        next,
        prev: current,
        setter: (value) => {
          setValue(field as Path<TFieldValues>, value, {
            shouldDirty: true,
            shouldTouch: true,
          })
        },
      })

      execute(command)
      input.focus()
    },
    [anchor, isEditing, setValue, getValues, execute]
  )

  const handleEnterEditMode = useCallback(
    (e: KeyboardEvent, anchor: { row: number; col: number }) => {
      const direction = e.shiftKey ? "ArrowUp" : "ArrowDown"
      const pos = _grid.getValidMovement(
        anchor.row,
        anchor.col,
        direction,
        false
      )
      const next = { row: pos[0], col: pos[1] }

      if (anchor.row !== next.row || anchor.col !== next.col) {
        setSingleRange(next)
        scrollToCell(pos)
        setIsEditing(false)
      }
    },
    [_grid, scrollToCell, setSingleRange]
  )

  const handleEnterNonEditMode = useCallback(
    (anchor: { row: number; col: number }) => {
      const id = generateCellId(anchor)
      const container = containerRef.current
      if (!container) {
        return
      }

      const input = container.querySelector(
        `[data-cell-id="${id}"]`
      ) as HTMLElement
      const field = input?.getAttribute("data-field")

      if (input && field) {
        input.focus()
        setIsEditing(true)
      }
    },
    []
  )

  const handleEnterKey = useCallback(
    (e: KeyboardEvent) => {
      if (!anchor || !containerRef.current) {
        return
      }

      e.preventDefault()

      if (isEditing) {
        handleEnterEditMode(e, anchor)
      } else {
        handleEnterNonEditMode(anchor)
      }
    },
    [anchor, isEditing, handleEnterEditMode, handleEnterNonEditMode]
  )

  const handleDeleteKey = useCallback(
    (e: KeyboardEvent) => {
      if (!anchor || isEditing) {
        return
      }

      e.preventDefault()

      const id = generateCellId(anchor)
      const container = containerRef.current

      if (!container) {
        return
      }

      const input = container.querySelector(
        `[data-cell-id="${id}"]`
      ) as HTMLElement

      if (!input) {
        return
      }

      const field = input.getAttribute("data-field")

      if (!field) {
        return
      }

      const current = getValues(field as Path<TFieldValues>)
      const next = "" as PathValue<TFieldValues, Path<TFieldValues>>

      const command = new UpdateCommand({
        next,
        prev: current,
        setter: (value) => {
          setValue(field as Path<TFieldValues>, value, {
            shouldDirty: true,
            shouldTouch: true,
          })
        },
      })

      execute(command)
    },
    [anchor, execute, getValues, isEditing, setValue]
  )

  const handleKeyDownEvent = useCallback(
    (e: KeyboardEvent) => {
      if (ARROW_KEYS.includes(e.key)) {
        handleKeyboardNavigation(e)
        return
      }

      if (e.key === "z" && (e.metaKey || e.ctrlKey)) {
        handleUndo(e)
        return
      }

      if (e.key === " ") {
        handleSpaceKey(e)
        return
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        handleDeleteKey(e)
        return
      }

      if (e.key === "Enter") {
        handleEnterKey(e)
        return
      }
    },
    [
      handleKeyboardNavigation,
      handleUndo,
      handleSpaceKey,
      handleEnterKey,
      handleDeleteKey,
    ]
  )

  const handleDragEnd = useCallback(() => {
    if (!isDragging) {
      return
    }

    if (!anchor || !dragEnd || !Object.keys(dragSelection).length) {
      return
    }

    const anchorId = generateCellId(anchor)
    const anchorValue = getSelectionValues({ [anchorId]: true })

    const { [anchorId]: _, ...selection } = dragSelection

    const prev = getSelectionValues(selection)
    const next = Array.from({ length: prev.length }, () => anchorValue[0])

    const command = new PasteCommand({
      selection,
      prev,
      next,
      setter: setSelectionValues,
    })

    execute(command)

    setIsDragging(false)
    setDragEnd(null)
    setDragSelection({})

    // Select the dragged cells.
    setSelection(dragSelection)
  }, [
    isDragging,
    anchor,
    dragEnd,
    dragSelection,
    getSelectionValues,
    setSelectionValues,
    execute,
  ])

  const handleMouseUpEvent = useCallback(() => {
    handleDragEnd()
    setIsSelecting(false)
  }, [handleDragEnd])

  const handleCopyEvent = useCallback(
    (e: ClipboardEvent) => {
      if (!selection) {
        return
      }

      e.preventDefault()

      const values = getSelectionValues(selection)

      const text = values.map((value) => value ?? "").join("\t")

      e.clipboardData?.setData("text/plain", text)
    },
    [selection, getSelectionValues]
  )

  const handlePasteEvent = useCallback(
    (e: ClipboardEvent) => {
      e.preventDefault()

      const text = e.clipboardData?.getData("text/plain")

      if (!text) {
        return
      }

      const next = text.split("\t")
      const prev = getSelectionValues(selection)

      const command = new PasteCommand({
        selection,
        next,
        prev,
        setter: setSelectionValues,
      })

      execute(command)
    },
    [selection, getSelectionValues, setSelectionValues, execute]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDownEvent)
    window.addEventListener("mouseup", handleMouseUpEvent)

    window.addEventListener("copy", handleCopyEvent)
    window.addEventListener("paste", handlePasteEvent)

    return () => {
      window.removeEventListener("keydown", handleKeyDownEvent)
      window.removeEventListener("mouseup", handleMouseUpEvent)

      window.removeEventListener("copy", handleCopyEvent)
      window.removeEventListener("paste", handlePasteEvent)
    }
  }, [
    handleKeyDownEvent,
    handleMouseUpEvent,
    handleCopyEvent,
    handlePasteEvent,
  ])

  const getWrapperFocusHandler = useCallback(
    (coords: CellCoords) => {
      return (_e: FocusEvent<HTMLElement>) => {
        setSingleRange(coords)
      }
    },
    [setSingleRange]
  )

  const getOverlayMouseDownHandler = useCallback(
    (coords: CellCoords) => {
      return (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation()
        e.preventDefault()

        if (e.shiftKey) {
          setRangeEnd(coords)
          return
        }

        setIsSelecting(true)
        clearRange(coords)
        setAnchor(coords)
      }
    },
    [clearRange]
  )

  const getInputMouseDownHandler = useCallback((coords: CellCoords) => {
    return (e: MouseEvent<HTMLElement>) => {
      e.stopPropagation()
      e.preventDefault()

      if (e.detail !== 2) {
        return
      }

      const container = e.target as HTMLElement
      const id = generateCellId(coords)

      // checkt if the container has the attribute data-cell-id
      if (container.hasAttribute("data-cell-id")) {
        container.focus()
        return
      }

      const cell = container.querySelector(`[data-cell-id="${id}"]`)
    }
  }, [])

  const getWrapperMouseOverHandler = useCallback(
    (coords: CellCoords) => {
      if (!isDragging && !isSelecting) {
        return
      }

      return (_e: MouseEvent<HTMLElement>) => {
        /**
         * If the column is not the same as the anchor col,
         * we don't want to select the cell.
         */
        if (anchor?.col !== coords.col) {
          return
        }

        if (isSelecting) {
          setRangeEnd(coords)
        } else {
          setDragEnd(coords)
        }
      }
    },
    [anchor, isDragging, isSelecting]
  )

  const onInputFocus = useCallback(() => {
    setIsEditing(true)
  }, [])

  const onInputBlur = useCallback(() => {
    setIsEditing(false)
  }, [])

  const getInputChangeHandler = useCallback(
    // Using `any` here as the generic type of Path<TFieldValues> will
    // not be inferred correctly.
    (field: any) => {
      return (next: any, prev: any) => {
        const command = new UpdateCommand({
          next,
          prev,
          setter: (value) => {
            setValue(field, value)
          },
        })

        execute(command)
      }
    },
    [setValue, execute]
  )

  const onDragToFillStart = useCallback((_e: MouseEvent<HTMLElement>) => {
    setIsDragging(true)
  }, [])

  /** Effects */

  /**
   * If anchor and rangeEnd are set, then select all cells between them.
   */
  useEffect(() => {
    if (!anchor || !rangeEnd) {
      return
    }

    const range = getRange(anchor, rangeEnd)

    setSelection(range)
  }, [anchor, rangeEnd])

  /**
   * If anchor and dragEnd are set, then select all cells between them.
   */
  useEffect(() => {
    if (!anchor || !dragEnd) {
      return
    }

    const range = getRange(anchor, dragEnd)

    setDragSelection(range)
  }, [anchor, dragEnd])

  /**
   * Auto corrective effect for ensuring that the anchor is always
   * part of the selected cells.
   */
  useEffect(() => {
    if (!anchor) {
      return
    }

    setSelection((prev) => ({
      ...prev,
      [generateCellId(anchor)]: true,
    }))
  }, [anchor])

  /**
   * Auto corrective effect for ensuring we always
   * have a range end.
   */
  useEffect(() => {
    if (!anchor) {
      return
    }

    if (rangeEnd) {
      return
    }

    setRangeEnd(anchor)
  }, [anchor, rangeEnd])

  const startEdit = useCallback(() => {
    setIsEditing(true)
  }, [])

  const values = useMemo(
    () => ({
      register,
      control,
      anchor,
      selection,
      dragSelection,
      startEdit,
      getWrapperFocusHandler,
      getOverlayMouseDownHandler,
      getInputMouseDownHandler,
      getInputChangeHandler,
      onInputFocus,
      onInputBlur,
      getWrapperMouseOverHandler,
    }),
    [
      anchor,
      control,
      dragSelection,
      startEdit,
      getWrapperFocusHandler,
      getInputChangeHandler,
      getInputMouseDownHandler,
      getOverlayMouseDownHandler,
      getWrapperMouseOverHandler,
      onInputBlur,
      onInputFocus,
      register,
      selection,
    ]
  )

  return (
    <DataGridContext.Provider value={values}>
      <div className="bg-ui-bg-subtle flex size-full flex-col overflow-hidden">
        <DataGridHeader grid={grid} />
        <div
          ref={containerRef}
          className="relative h-full select-none overflow-auto"
        >
          <div role="grid" className="text-ui-fg-subtle grid">
            <div
              role="rowgroup"
              className="txt-compact-small-plus bg-ui-bg-subtle sticky top-0 z-[1] grid"
            >
              {grid.getHeaderGroups().map((headerGroup) => (
                <div
                  role="row"
                  key={headerGroup.id}
                  className="flex h-10 w-full"
                >
                  {virtualPaddingLeft ? (
                    // Empty columns to fill the virtual padding
                    <div
                      role="presentation"
                      style={{ display: "flex", width: virtualPaddingLeft }}
                    />
                  ) : null}
                  {virtualColumns.map((vc) => {
                    const header = headerGroup.headers[vc.index]

                    return (
                      <div
                        key={header.id}
                        role="columnheader"
                        data-column-index={vc.index}
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
                      </div>
                    )
                  })}
                  {virtualPaddingRight ? (
                    // Empty columns to fill the virtual padding
                    <div
                      role="presentation"
                      style={{ display: "flex", width: virtualPaddingRight }}
                    />
                  ) : null}
                </div>
              ))}
            </div>
            <div
              role="rowgroup"
              className="relative grid"
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
              }}
            >
              {virtualRows.map((virtualRow) => {
                const row = flatRows[virtualRow.index] as Row<TData>

                return (
                  <DataGridRow
                    key={row.id}
                    row={row}
                    virtualRow={virtualRow}
                    visibleColumns={visibleColumns}
                    virtualColumns={virtualColumns}
                    anchor={anchor}
                    virtualPaddingLeft={virtualPaddingLeft}
                    virtualPaddingRight={virtualPaddingRight}
                    onDragToFillStart={onDragToFillStart}
                    registerCell={registerCell}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </DataGridContext.Provider>
  )
}

type DataGridHeaderProps<TData> = {
  grid: Table<TData>
}

const DataGridHeader = <TData,>({ grid }: DataGridHeaderProps<TData>) => {
  return (
    <div className="bg-ui-bg-base flex items-center justify-between border-b p-4">
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button size="small" variant="secondary">
            <Adjustments />
            Edit columns
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {grid.getAllLeafColumns().map((column) => {
            const checked = column.getIsVisible()
            const disabled = !column.getCanHide()

            if (disabled) {
              return null
            }

            return (
              <DropdownMenu.CheckboxItem
                key={column.id}
                checked={checked}
                onCheckedChange={(value) => column.toggleVisibility(value)}
                onSelect={(e) => e.preventDefault()}
              >
                {getColumnName(column)}
              </DropdownMenu.CheckboxItem>
            )
          })}
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  )
}

type DataGridCellProps<TData> = {
  cell: Cell<TData, unknown>
  columnIndex: number
  rowIndex: number
  anchor: CellCoords | null
  onDragToFillStart: (e: MouseEvent<HTMLElement>) => void
  registerCell: (coords: CellCoords) => void
}

const DataGridCell = <TData,>({
  cell,
  columnIndex,
  rowIndex,
  anchor,
  onDragToFillStart,
  registerCell,
}: DataGridCellProps<TData>) => {
  const coords: CellCoords = {
    row: rowIndex,
    col: columnIndex,
  }

  const isAnchor = isCellMatch(coords, anchor)

  return (
    <div
      role="gridcell"
      style={{
        width: cell.column.getSize(),
      }}
      data-row-index={rowIndex}
      data-column-index={columnIndex}
      className={clx(
        "relative flex items-center border-b border-r p-0 outline-none"
      )}
      tabIndex={-1}
    >
      <div className="relative h-full w-full">
        {flexRender(cell.column.columnDef.cell, {
          ...cell.getContext(),
          columnIndex,
          rowIndex: rowIndex,
          registerCell,
        } as CellContext<TData, any>)}
        {isAnchor && (
          <div
            onMouseDown={onDragToFillStart}
            className="bg-ui-fg-interactive absolute bottom-0 right-0 z-[3] size-1.5 cursor-ns-resize"
          />
        )}
      </div>
    </div>
  )
}

type DataGridRowProps<TData> = {
  row: Row<TData>
  virtualRow: VirtualItem<Element>
  virtualPaddingLeft?: number
  virtualPaddingRight?: number
  virtualColumns: VirtualItem<Element>[]
  visibleColumns: ColumnDef<TData>[]
  anchor: CellCoords | null
  onDragToFillStart: (e: MouseEvent<HTMLElement>) => void
  registerCell: (coords: CellCoords) => void
}

const DataGridRow = <TData,>({
  row,
  virtualRow,
  virtualPaddingLeft,
  virtualPaddingRight,
  virtualColumns,
  visibleColumns,
  anchor,
  onDragToFillStart,
  registerCell,
}: DataGridRowProps<TData>) => {
  const visibleCells = row.getVisibleCells()

  return (
    <div
      role="row"
      style={{
        transform: `translateY(${virtualRow.start}px)`,
      }}
      className="bg-ui-bg-subtle txt-compact-small absolute flex h-10 w-full"
    >
      {virtualPaddingLeft ? (
        // Empty column to fill the virtual padding
        <div
          role="presentation"
          style={{ display: "flex", width: virtualPaddingLeft }}
        />
      ) : null}
      {virtualColumns.map((vc) => {
        const cell = visibleCells[vc.index]
        const column = cell.column

        const columnIndex = visibleColumns.findIndex((c) => c.id === column.id)

        return (
          <DataGridCell
            key={cell.id}
            cell={cell}
            registerCell={registerCell}
            columnIndex={columnIndex}
            rowIndex={virtualRow.index}
            anchor={anchor}
            onDragToFillStart={onDragToFillStart}
          />
        )
      })}
      {virtualPaddingRight ? (
        // Empty column to fill the virtual padding
        <div
          role="presentation"
          style={{ display: "flex", width: virtualPaddingRight }}
        />
      ) : null}
    </div>
  )
}
