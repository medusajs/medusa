import {
  Adjustments,
  AdjustmentsDone,
  ExclamationCircle,
} from "@medusajs/icons"
import { Button, DropdownMenu, clx } from "@medusajs/ui"
import {
  Cell,
  CellContext,
  Column,
  ColumnDef,
  Row,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { VirtualItem, useVirtualizer } from "@tanstack/react-virtual"
import React, {
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { FieldValues, UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { useCommandHistory } from "../../../hooks/use-command-history"
import { ConditionalTooltip } from "../../common/conditional-tooltip"
import { DataGridContext } from "../context"
import {
  useDataGridCellHandlers,
  useDataGridCellMetadata,
  useDataGridCellSnapshot,
  useDataGridClipboardEvents,
  useDataGridColumnVisibility,
  useDataGridErrorHighlighting,
  useDataGridFormHandlers,
  useDataGridKeydownEvent,
  useDataGridMouseUpEvent,
  useDataGridNavigation,
  useDataGridQueryTool,
} from "../hooks"
import { DataGridMatrix } from "../models"
import { DataGridCoordinates, GridColumnOption } from "../types"
import { isCellMatch, isSpecialFocusKey } from "../utils"
import { DataGridKeyboardShortcutModal } from "./data-grid-keyboard-shortcut-modal"
export interface DataGridRootProps<
  TData,
  TFieldValues extends FieldValues = FieldValues,
> {
  data?: TData[]
  columns: ColumnDef<TData>[]
  state: UseFormReturn<TFieldValues>
  getSubRows?: (row: TData) => TData[] | undefined
  onEditingChange?: (isEditing: boolean) => void
}

const ROW_HEIGHT = 40

const getCommonPinningStyles = <TData,>(
  column: Column<TData>
): CSSProperties => {
  const isPinned = column.getIsPinned()

  /**
   * Since our border colors are semi-transparent, we need to set a custom border color
   * that looks the same as the actual border color, but has 100% opacity.
   *
   * We do this by checking if the current theme is dark mode, and then setting the border color
   * to the corresponding color.
   */
  const isDarkMode = document.documentElement.classList.contains("dark")
  const BORDER_COLOR = isDarkMode ? "rgb(50,50,53)" : "rgb(228,228,231)"

  return {
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
    borderBottom: isPinned ? `1px solid ${BORDER_COLOR}` : undefined,
    borderRight: isPinned ? `1px solid ${BORDER_COLOR}` : undefined,
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
  }
}

/**
 * TODO:
 * - [Minor] Add shortcuts overview modal.
 * - [Minor] Extend the commands to also support modifying the anchor and rangeEnd, to restore the previous focus after undo/redo.
 */

export const DataGridRoot = <
  TData,
  TFieldValues extends FieldValues = FieldValues,
>({
  data = [],
  columns,
  state,
  getSubRows,
  onEditingChange,
}: DataGridRootProps<TData, TFieldValues>) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const { redo, undo, execute } = useCommandHistory()
  const {
    register,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = state

  const [trapActive, setTrapActive] = useState(true)

  const [anchor, setAnchor] = useState<DataGridCoordinates | null>(null)
  const [rangeEnd, setRangeEnd] = useState<DataGridCoordinates | null>(null)
  const [dragEnd, setDragEnd] = useState<DataGridCoordinates | null>(null)

  const [isSelecting, setIsSelecting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const [isEditing, setIsEditing] = useState(false)

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowVisibility, setRowVisibility] = useState<VisibilityState>({})

  const grid = useReactTable({
    data: data,
    columns,
    initialState: {
      columnPinning: {
        left: [columns[0].id!],
      },
    },
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
  const flatColumns = grid.getAllFlatColumns()

  const visibleRows = useMemo(
    () => flatRows.filter((_, index) => rowVisibility?.[index] !== false),
    [flatRows, rowVisibility]
  )
  const visibleColumns = grid.getVisibleLeafColumns()

  const rowVirtualizer = useVirtualizer({
    count: visibleRows.length,
    estimateSize: () => ROW_HEIGHT,
    getScrollElement: () => containerRef.current,
    overscan: 5,
    rangeExtractor: (range) => {
      const toRender = new Set(
        Array.from(
          { length: range.endIndex - range.startIndex + 1 },
          (_, i) => range.startIndex + i
        )
      )

      if (anchor && visibleRows[anchor.row]) {
        toRender.add(anchor.row)
      }

      if (rangeEnd && visibleRows[rangeEnd.row]) {
        toRender.add(rangeEnd.row)
      }

      return Array.from(toRender).sort((a, b) => a - b)
    },
  })
  const virtualRows = rowVirtualizer.getVirtualItems()

  const columnVirtualizer = useVirtualizer({
    count: visibleColumns.length,
    estimateSize: (index) => visibleColumns[index].getSize(),
    getScrollElement: () => containerRef.current,
    horizontal: true,
    overscan: 3,
    rangeExtractor: (range) => {
      const startIndex = range.startIndex
      const endIndex = range.endIndex

      const toRender = new Set(
        Array.from(
          { length: endIndex - startIndex + 1 },
          (_, i) => startIndex + i
        )
      )

      if (anchor && visibleColumns[anchor.col]) {
        toRender.add(anchor.col)
      }

      if (rangeEnd && visibleColumns[rangeEnd.col]) {
        toRender.add(rangeEnd.col)
      }

      // The first column is pinned, so we always render it
      toRender.add(0)

      return Array.from(toRender).sort((a, b) => a - b)
    },
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

  const matrix = useMemo(
    () => new DataGridMatrix<TData, TFieldValues>(flatRows, columns),
    [flatRows, columns]
  )
  const queryTool = useDataGridQueryTool(containerRef)

  const setSingleRange = useCallback(
    (coordinates: DataGridCoordinates | null) => {
      setAnchor(coordinates)
      setRangeEnd(coordinates)
    },
    []
  )

  const { errorCount, isHighlighted, toggleErrorHighlighting } =
    useDataGridErrorHighlighting(matrix, grid, errors)

  const handleToggleErrorHighlighting = useCallback(() => {
    toggleErrorHighlighting(
      rowVisibility,
      columnVisibility,
      setRowVisibility,
      setColumnVisibility
    )
  }, [toggleErrorHighlighting, rowVisibility, columnVisibility])

  const {
    columnOptions,
    handleToggleColumn,
    handleResetColumns,
    isDisabled: isColumsDisabled,
  } = useDataGridColumnVisibility(grid, matrix)

  const handleToggleColumnVisibility = useCallback(
    (index: number) => {
      return handleToggleColumn(index)
    },
    [handleToggleColumn]
  )

  const { navigateToField, scrollToCoordinates } = useDataGridNavigation<
    TData,
    TFieldValues
  >({
    matrix,
    queryTool,
    anchor,
    columnVirtualizer,
    rowVirtualizer,
    flatColumns,
    setColumnVisibility,
    setSingleRange,
    visibleColumns,
    visibleRows,
  })

  const { createSnapshot, restoreSnapshot } = useDataGridCellSnapshot<
    TData,
    TFieldValues
  >({
    matrix,
    form: state,
  })

  const onEditingChangeHandler = useCallback(
    (value: boolean) => {
      if (onEditingChange) {
        onEditingChange(value)
      }

      if (value) {
        createSnapshot(anchor)
      }

      setIsEditing(value)
    },
    [anchor, createSnapshot, onEditingChange]
  )

  const { getSelectionValues, setSelectionValues } = useDataGridFormHandlers<
    TData,
    TFieldValues
  >({
    matrix,
    form: state,
    anchor,
  })

  const { handleKeyDownEvent, handleSpecialFocusKeys } =
    useDataGridKeydownEvent<TData, TFieldValues>({
      containerRef,
      matrix,
      queryTool,
      anchor,
      rangeEnd,
      isEditing,
      setTrapActive,
      setRangeEnd,
      getSelectionValues,
      getValues,
      setSelectionValues,
      onEditingChangeHandler,
      restoreSnapshot,
      setSingleRange,
      scrollToCoordinates,
      execute,
      undo,
      redo,
      setValue,
    })

  const { handleMouseUpEvent } = useDataGridMouseUpEvent<TData, TFieldValues>({
    matrix,
    anchor,
    dragEnd,
    setDragEnd,
    isDragging,
    setIsDragging,
    setRangeEnd,
    setIsSelecting,
    getSelectionValues,
    setSelectionValues,
    execute,
  })

  const { handleCopyEvent, handlePasteEvent } = useDataGridClipboardEvents<
    TData,
    TFieldValues
  >({
    matrix,
    isEditing,
    anchor,
    rangeEnd,
    getSelectionValues,
    setSelectionValues,
    execute,
  })

  const {
    getWrapperFocusHandler,
    getInputChangeHandler,
    getOverlayMouseDownHandler,
    getWrapperMouseOverHandler,
    getIsCellDragSelected,
    getIsCellSelected,
    onDragToFillStart,
  } = useDataGridCellHandlers<TData, TFieldValues>({
    matrix,
    anchor,
    rangeEnd,
    setRangeEnd,
    isDragging,
    setIsDragging,
    isSelecting,
    setIsSelecting,
    setSingleRange,
    dragEnd,
    setDragEnd,
    setValue,
    execute,
  })

  const { getCellErrorMetadata, getCellMetadata } = useDataGridCellMetadata<
    TData,
    TFieldValues
  >({
    matrix,
  })

  /** Effects */

  /**
   * Register all handlers for the grid.
   */
  useEffect(() => {
    if (!trapActive) {
      return
    }

    window.addEventListener("keydown", handleKeyDownEvent)
    window.addEventListener("mouseup", handleMouseUpEvent)

    // Copy and paste event listeners need to be added to the window
    window.addEventListener("copy", handleCopyEvent)
    window.addEventListener("paste", handlePasteEvent)

    return () => {
      window.removeEventListener("keydown", handleKeyDownEvent)
      window.removeEventListener("mouseup", handleMouseUpEvent)

      window.removeEventListener("copy", handleCopyEvent)
      window.removeEventListener("paste", handlePasteEvent)
    }
  }, [
    trapActive,
    handleKeyDownEvent,
    handleMouseUpEvent,
    handleCopyEvent,
    handlePasteEvent,
  ])

  useEffect(() => {
    const specialFocusHandler = (e: KeyboardEvent) => {
      if (isSpecialFocusKey(e)) {
        handleSpecialFocusKeys(e)
        return
      }
    }

    window.addEventListener("keydown", specialFocusHandler)

    return () => {
      window.removeEventListener("keydown", specialFocusHandler)
    }
  }, [handleSpecialFocusKeys])

  const handleHeaderInteractionChange = useCallback((isActive: boolean) => {
    if (isActive) {
      setTrapActive(false)
    }
  }, [])

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

  /**
   * Ensure that we set a anchor on first render.
   */
  useEffect(() => {
    if (!anchor && matrix) {
      const coords = matrix.getFirstNavigableCell()

      if (coords) {
        setSingleRange(coords)
      }
    }
  }, [anchor, matrix, setSingleRange])

  const values = useMemo(
    () => ({
      anchor,
      control,
      trapActive,
      errors,
      setTrapActive,
      setIsSelecting,
      setIsEditing: onEditingChangeHandler,
      setSingleRange,
      setRangeEnd,
      getWrapperFocusHandler,
      getInputChangeHandler,
      getOverlayMouseDownHandler,
      getWrapperMouseOverHandler,
      register,
      getIsCellSelected,
      getIsCellDragSelected,
      getCellMetadata,
      getCellErrorMetadata,
      navigateToField,
    }),
    [
      anchor,
      control,
      trapActive,
      errors,
      setTrapActive,
      setIsSelecting,
      onEditingChangeHandler,
      setSingleRange,
      setRangeEnd,
      getWrapperFocusHandler,
      getInputChangeHandler,
      getOverlayMouseDownHandler,
      getWrapperMouseOverHandler,
      register,
      getIsCellSelected,
      getIsCellDragSelected,
      getCellMetadata,
      getCellErrorMetadata,
      navigateToField,
    ]
  )

  const handleRestoreGridFocus = useCallback(() => {
    if (anchor && !trapActive) {
      setTrapActive(true)

      setSingleRange(anchor)
      scrollToCoordinates(anchor, "both")

      requestAnimationFrame(() => {
        queryTool?.getContainer(anchor)?.focus()
      })
    }
  }, [anchor, trapActive, queryTool])

  return (
    <DataGridContext.Provider value={values}>
      <div className="bg-ui-bg-subtle flex size-full flex-col">
        <DataGridHeader
          columnOptions={columnOptions}
          isDisabled={isColumsDisabled}
          onToggleColumn={handleToggleColumnVisibility}
          errorCount={errorCount}
          onToggleErrorHighlighting={handleToggleErrorHighlighting}
          onResetColumns={handleResetColumns}
          isHighlighted={isHighlighted}
          onHeaderInteractionChange={handleHeaderInteractionChange}
        />
        <div className="size-full overflow-hidden">
          <div
            ref={containerRef}
            autoFocus
            tabIndex={0}
            className="relative h-full select-none overflow-auto outline-none"
            onFocus={handleRestoreGridFocus}
            onClick={handleRestoreGridFocus}
            data-container={true}
            role="application"
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
                      <div
                        role="presentation"
                        style={{ display: "flex", width: virtualPaddingLeft }}
                      />
                    ) : null}
                    {virtualColumns.reduce((acc, vc, index, array) => {
                      const header = headerGroup.headers[vc.index]
                      const previousVC = array[index - 1]

                      if (previousVC && vc.index !== previousVC.index + 1) {
                        // If there's a gap between the current and previous virtual columns
                        acc.push(
                          <div
                            key={`padding-${previousVC.index}-${vc.index}`}
                            role="presentation"
                            style={{
                              display: "flex",
                              width: `${vc.start - previousVC.end}px`,
                            }}
                          />
                        )
                      }

                      acc.push(
                        <div
                          key={header.id}
                          role="columnheader"
                          data-column-index={vc.index}
                          style={{
                            width: header.getSize(),
                            ...getCommonPinningStyles(header.column),
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

                      return acc
                    }, [] as ReactNode[])}
                    {virtualPaddingRight ? (
                      <div
                        role="presentation"
                        style={{
                          display: "flex",
                          width: virtualPaddingRight,
                        }}
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
                  const row = visibleRows[virtualRow.index] as Row<TData>
                  const rowIndex = flatRows.findIndex((r) => r.id === row.id)

                  return (
                    <DataGridRow
                      key={row.id}
                      row={row}
                      rowIndex={rowIndex}
                      virtualRow={virtualRow}
                      flatColumns={flatColumns}
                      virtualColumns={virtualColumns}
                      anchor={anchor}
                      virtualPaddingLeft={virtualPaddingLeft}
                      virtualPaddingRight={virtualPaddingRight}
                      onDragToFillStart={onDragToFillStart}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DataGridContext.Provider>
  )
}

type DataGridHeaderProps = {
  columnOptions: GridColumnOption[]
  isDisabled: boolean
  onToggleColumn: (index: number) => (value: boolean) => void
  onResetColumns: () => void
  isHighlighted: boolean
  errorCount: number
  onToggleErrorHighlighting: () => void
  onHeaderInteractionChange: (isActive: boolean) => void
}

const DataGridHeader = ({
  columnOptions,
  isDisabled,
  onToggleColumn,
  onResetColumns,
  isHighlighted,
  errorCount,
  onToggleErrorHighlighting,
  onHeaderInteractionChange,
}: DataGridHeaderProps) => {
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [columnsOpen, setColumnsOpen] = useState(false)
  const { t } = useTranslation()

  // Since all columns are checked by default, we can check if any column is unchecked
  const hasChanged = columnOptions.some((column) => !column.checked)

  const handleShortcutsOpenChange = (value: boolean) => {
    onHeaderInteractionChange(value)
    setShortcutsOpen(value)
  }

  const handleColumnsOpenChange = (value: boolean) => {
    onHeaderInteractionChange(value)
    setColumnsOpen(value)
  }
  return (
    <div className="bg-ui-bg-base flex items-center justify-between border-b p-4">
      <div className="flex items-center gap-x-2">
        <DropdownMenu open={columnsOpen} onOpenChange={handleColumnsOpenChange}>
          <ConditionalTooltip
            showTooltip={isDisabled}
            content={t("dataGrid.columns.disabled")}
          >
            <DropdownMenu.Trigger asChild disabled={isDisabled}>
              <Button size="small" variant="secondary">
                {hasChanged ? <AdjustmentsDone /> : <Adjustments />}
                {t("dataGrid.columns.view")}
              </Button>
            </DropdownMenu.Trigger>
          </ConditionalTooltip>
          <DropdownMenu.Content>
            {columnOptions.map((column, index) => {
              const { checked, disabled, id, name } = column

              if (disabled) {
                return null
              }

              return (
                <DropdownMenu.CheckboxItem
                  key={id}
                  checked={checked}
                  onCheckedChange={onToggleColumn(index)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {name}
                </DropdownMenu.CheckboxItem>
              )
            })}
          </DropdownMenu.Content>
        </DropdownMenu>
        {hasChanged && (
          <Button
            size="small"
            variant="transparent"
            type="button"
            onClick={onResetColumns}
            className="text-ui-fg-muted hover:text-ui-fg-subtle"
            data-id="reset-columns"
          >
            {t("dataGrid.columns.resetToDefault")}
          </Button>
        )}
      </div>
      <div className="flex items-center gap-x-2">
        {errorCount > 0 && (
          <Button
            size="small"
            variant="secondary"
            type="button"
            onClick={onToggleErrorHighlighting}
            className={clx({
              "bg-ui-button-neutral-pressed": isHighlighted,
            })}
          >
            <ExclamationCircle className="text-ui-fg-subtle" />
            <span>
              {t("dataGrid.errors.count", {
                count: errorCount,
              })}
            </span>
          </Button>
        )}
        <DataGridKeyboardShortcutModal
          open={shortcutsOpen}
          onOpenChange={handleShortcutsOpenChange}
        />
      </div>
    </div>
  )
}

type DataGridCellProps<TData> = {
  cell: Cell<TData, unknown>
  columnIndex: number
  rowIndex: number
  anchor: DataGridCoordinates | null
  onDragToFillStart: (e: React.MouseEvent<HTMLElement>) => void
}

const DataGridCell = <TData,>({
  cell,
  columnIndex,
  rowIndex,
  anchor,
  onDragToFillStart,
}: DataGridCellProps<TData>) => {
  const coords: DataGridCoordinates = {
    row: rowIndex,
    col: columnIndex,
  }

  const isAnchor = isCellMatch(coords, anchor)

  return (
    <div
      role="gridcell"
      aria-rowindex={rowIndex}
      aria-colindex={columnIndex}
      style={{
        width: cell.column.getSize(),
        ...getCommonPinningStyles(cell.column),
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
  rowIndex: number
  virtualRow: VirtualItem<Element>
  virtualPaddingLeft?: number
  virtualPaddingRight?: number
  virtualColumns: VirtualItem<Element>[]
  flatColumns: Column<TData, unknown>[]
  anchor: DataGridCoordinates | null
  onDragToFillStart: (e: React.MouseEvent<HTMLElement>) => void
}

const DataGridRow = <TData,>({
  row,
  rowIndex,
  virtualRow,
  virtualPaddingLeft,
  virtualPaddingRight,
  virtualColumns,
  flatColumns,
  anchor,
  onDragToFillStart,
}: DataGridRowProps<TData>) => {
  const visibleCells = row.getVisibleCells()

  return (
    <div
      role="row"
      aria-rowindex={virtualRow.index}
      style={{
        transform: `translateY(${virtualRow.start}px)`,
      }}
      className="bg-ui-bg-subtle txt-compact-small absolute flex h-10 w-full"
    >
      {virtualPaddingLeft ? (
        <div
          role="presentation"
          style={{ display: "flex", width: virtualPaddingLeft }}
        />
      ) : null}
      {virtualColumns.reduce((acc, vc, index, array) => {
        const cell = visibleCells[vc.index]
        const column = cell.column
        const columnIndex = flatColumns.findIndex((c) => c.id === column.id)
        const previousVC = array[index - 1]

        if (previousVC && vc.index !== previousVC.index + 1) {
          // If there's a gap between the current and previous virtual columns
          acc.push(
            <div
              key={`padding-${previousVC.index}-${vc.index}`}
              role="presentation"
              style={{
                display: "flex",
                width: `${vc.start - previousVC.end}px`,
              }}
            />
          )
        }

        acc.push(
          <DataGridCell
            key={cell.id}
            cell={cell}
            columnIndex={columnIndex}
            rowIndex={rowIndex}
            anchor={anchor}
            onDragToFillStart={onDragToFillStart}
          />
        )

        return acc
      }, [] as ReactNode[])}
      {virtualPaddingRight ? (
        <div
          role="presentation"
          style={{ display: "flex", width: virtualPaddingRight }}
        />
      ) : null}
    </div>
  )
}
