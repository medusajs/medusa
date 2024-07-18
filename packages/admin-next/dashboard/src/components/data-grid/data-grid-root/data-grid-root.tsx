import {
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
  CellContext,
  ColumnDef,
  Row,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form"
import { useCommandHistory } from "../../../hooks/use-command-history"
import { DataGridContext } from "../context"
import { PasteCommand, SortedSet, UpdateCommand } from "../models"
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
 * - [Critical] Fix bug where the virtualizers will fail to scroll to the next/prev cell due to the element measurement not being part of the virtualizers memoized array of measurements.
 * - [Critical] Fix performing commands on cells that aren't currently rendered by the virtualizer.
 * - [Critical] Prevent action handlers from firing while editing a cell.
 * - [Important] Show field errors in the grid, and in topbar, possibly also an option to only show
 * - [Minor] Extend the commands to also support modifying the anchor and rangeEnd, to restore the previous focus after undo/redo.
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

  const [cells, setCells] = useState<Record<string, boolean>>({})

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

  /**
   * Moves the anchor to the specified point. Also attempts to blur
   * the active element to reset the focus.
   */
  const moveAnchor = useCallback((point: CellCoords | null) => {
    const activeElement = document.activeElement

    if (activeElement instanceof HTMLElement) {
      activeElement.blur()
    }

    setAnchor(point)
  }, [])

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
        moveAnchor(null)
        setSelection({})
        setRangeEnd(null)
      }

      setDragSelection({})
    },
    [anchor, selection, moveAnchor]
  )

  const setSingleRange = useCallback(
    (coordinates: CellCoords | null) => {
      clearRange(coordinates)

      moveAnchor(coordinates)
      setRangeEnd(coordinates)
    },
    [clearRange, moveAnchor]
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

      const virtualizer =
        direction === "horizontal" ? columnVirtualizer : rowVirtualizer

      const colsOrRows = direction === "horizontal" ? cols : rows

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

      const handleNavigation = (index: number | null) => {
        if (index === null) {
          return
        }

        e.preventDefault()

        virtualizer.scrollToIndex(index, {
          align: "center",
          behavior: "auto",
        })

        const newRange =
          direction === "horizontal" ? { row, col: index } : { row: index, col }
        updater(newRange)
      }

      switch (e.key) {
        case "ArrowLeft":
        case "ArrowUp": {
          const index =
            e.metaKey || e.ctrlKey
              ? colsOrRows.getFirst()
              : colsOrRows.getPrev(direction === "horizontal" ? col : row)
          handleNavigation(index)
          break
        }
        case "ArrowRight":
        case "ArrowDown": {
          const index =
            e.metaKey || e.ctrlKey
              ? colsOrRows.getLast()
              : colsOrRows.getNext(direction === "horizontal" ? col : row)
          handleNavigation(index)
          break
        }
      }
    },
    [
      isEditing,
      anchor,
      rangeEnd,
      columnVirtualizer,
      rowVirtualizer,
      cols,
      rows,
      setSingleRange,
    ]
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

  const handleEnterKey = useCallback(
    (e: KeyboardEvent) => {
      if (!anchor) {
        return
      }

      e.preventDefault()

      const id = generateCellId(anchor)
      const container = containerRef.current

      if (isEditing) {
        if (e.shiftKey) {
          const prevRow = rows.getPrev(anchor.row)

          if (prevRow) {
            const prev = { row: prevRow, col: anchor.col }
            setSingleRange(prev)
            return
          }

          const prevCol = cols.getPrev(anchor.col)
          const lastRow = rows.getLast()

          if (prevCol === null || lastRow === null) {
            return
          }

          const prev = { row: lastRow, col: prevCol }
          setSingleRange(prev)

          return
        }

        const nextRow = rows.getNext(anchor.row)

        if (nextRow) {
          const next = { row: nextRow, col: anchor.col }
          setSingleRange(next)
          return
        }

        const nextCol = cols.getNext(anchor.col)
        const firstRow = rows.getFirst()

        if (nextCol === null || firstRow === null) {
          return
        }

        const next = { row: firstRow, col: nextCol }
        setSingleRange(next)

        return
      }

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

      input.focus()
    },
    [anchor, cols, isEditing, rows, setSingleRange]
  )

  const handleTabKey = useCallback(
    (e: KeyboardEvent) => {
      if (!anchor) {
        return
      }

      e.preventDefault()

      if (e.shiftKey) {
        const prevCol = cols.getPrev(anchor.col)

        if (prevCol === null) {
          const prevRow = rows.getPrev(anchor.row)
          const lastCol = cols.getLast()

          if (prevRow === null || lastCol === null) {
            return
          }

          const prev = { row: prevRow, col: lastCol }
          setSingleRange(prev)
          return
        }

        const prev = { row: anchor.row, col: prevCol }
        setSingleRange(prev)
        return
      }

      const nextCol = cols.getNext(anchor.col)

      if (nextCol === null) {
        const nextRow = rows.getNext(anchor.row)
        const firstCol = cols.getFirst()

        if (nextRow === null || firstCol === null) {
          return
        }

        const next = { row: nextRow, col: firstCol }
        setSingleRange(next)
        return
      }

      const next = { row: anchor.row, col: nextCol }
      setSingleRange(next)
    },
    [anchor, cols, rows, setSingleRange]
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

  const handleCatchAllKey = useCallback(
    (e: KeyboardEvent) => {
      if (!anchor || isEditing) {
        return
      }

      const container = containerRef.current
      const id = generateCellId(anchor)

      if (!container) {
        return
      }

      const input = container.querySelector(
        `[data-cell-id="${id}"]`
      ) as HTMLElement

      if (!input) {
        return
      }

      console.log(e.target)
    },
    [anchor, isEditing]
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

      if (e.key === "Tab") {
        handleTabKey(e)
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

      handleCatchAllKey(e)
    },
    [
      handleKeyboardNavigation,
      handleUndo,
      handleSpaceKey,
      handleEnterKey,
      handleTabKey,
      handleDeleteKey,
      handleCatchAllKey,
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
      console.log("found", cell)
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

  return (
    <DataGridContext.Provider
      value={{
        register,
        control,
        anchor,
        onRegisterCell,
        onUnregisterCell,
        getOverlayMouseDownHandler,
        getInputMouseDownHandler,
        getInputChangeHandler,
        onInputFocus,
        onInputBlur,
        getWrapperMouseOverHandler,
      }}
    >
      <div className="bg-ui-bg-subtle flex size-full flex-col overflow-hidden">
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
        <div
          ref={containerRef}
          className="relative h-full select-none overflow-auto"
        >
          <table className="text-ui-fg-subtle grid">
            <thead className="txt-compact-small-plus bg-ui-bg-subtle sticky top-0 z-[1] grid">
              {grid.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="flex h-10 w-full">
                  {virtualPaddingLeft ? (
                    // Empty columns to fill the virtual padding
                    <th
                      style={{ display: "flex", width: virtualPaddingLeft }}
                    />
                  ) : null}
                  {virtualColumns.map((vc) => {
                    const header = headerGroup.headers[vc.index]

                    return (
                      <th
                        key={header.id}
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
                      </th>
                    )
                  })}
                  {virtualPaddingRight ? (
                    // Empty columns to fill the virtual padding
                    <th
                      style={{ display: "flex", width: virtualPaddingRight }}
                    />
                  ) : null}
                </tr>
              ))}
            </thead>
            <tbody
              className="relative grid"
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
              }}
            >
              {virtualRows.map((virtualRow) => {
                const row = flatRows[virtualRow.index] as Row<TData>
                const visibleCells = row.getVisibleCells()

                return (
                  <tr
                    key={row.id}
                    style={{
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="bg-ui-bg-subtle txt-compact-small absolute flex h-10 w-full"
                  >
                    {virtualPaddingLeft ? (
                      // Empty column to fill the virtual padding
                      <td
                        style={{ display: "flex", width: virtualPaddingLeft }}
                      />
                    ) : null}
                    {virtualColumns.map((vc) => {
                      const cell = visibleCells[vc.index]
                      const column = cell.column

                      const columnIndex = visibleColumns.findIndex(
                        (c) => c.id === column.id
                      )

                      const coords: CellCoords = {
                        row: virtualRow.index,
                        col: columnIndex,
                      }

                      const isAnchor = isCellMatch(coords, anchor)
                      const isSelected = selection[generateCellId(coords)]
                      const isDragSelected =
                        dragSelection[generateCellId(coords)]

                      return (
                        <td
                          key={cell.id}
                          style={{
                            width: cell.column.getSize(),
                          }}
                          data-row-index={virtualRow.index}
                          data-column-index={columnIndex}
                          className={clx(
                            "bg-ui-bg-base relative flex items-center border-b border-r p-0 outline-none",
                            {
                              "bg-ui-bg-highlight focus-within:bg-ui-bg-base":
                                isSelected || isAnchor,
                              "bg-ui-bg-subtle": isDragSelected && !isAnchor,
                            }
                          )}
                          tabIndex={-1}
                        >
                          <div className="relative h-full w-full">
                            {flexRender(cell.column.columnDef.cell, {
                              ...cell.getContext(),
                              columnIndex,
                              rowIndex: virtualRow.index,
                            } as CellContext<TData, any>)}
                            {isAnchor && (
                              <div
                                onMouseDown={onDragToFillStart}
                                className="bg-ui-fg-interactive absolute bottom-0 right-0 z-[3] size-1.5 cursor-ns-resize"
                              />
                            )}
                          </div>
                        </td>
                      )
                    })}
                    {virtualPaddingRight ? (
                      // Empty column to fill the virtual padding
                      <td
                        style={{ display: "flex", width: virtualPaddingRight }}
                      />
                    ) : null}
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
