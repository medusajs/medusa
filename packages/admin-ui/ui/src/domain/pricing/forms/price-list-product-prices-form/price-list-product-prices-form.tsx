import { Adjustments, BuildingTax } from "@medusajs/icons"
import type { Currency, Product, Region } from "@medusajs/medusa"
import { Button, DropdownMenu, clx } from "@medusajs/ui"
import * as React from "react"
import AmountField, { formatValue } from "react-currency-input-field"
import { CurrencyInputOnChangeValues } from "react-currency-input-field/dist/components/CurrencyInputProps"
import {
  Controller,
  UseFormGetValues,
  UseFormSetValue,
  type Control,
} from "react-hook-form"

import { useTranslation } from "react-i18next"
import { useCommandHistory } from "../../../../hooks/use-command-history"
import useNotification from "../../../../hooks/use-notification"
import { currencies as CURRENCY_MAP } from "../../../../utils/currencies"
import {
  calculateBoundingBoxes,
  getBorderAttributes,
  getCellAttributes,
  getDragToFillSelection,
  getElementFromPoint,
  getKey,
  getPoint,
  getPointFromElement,
  getRange,
  getRect,
  isParentRow,
  validateTarget,
} from "./helpers"
import { DeleteCommand, PasteCommand, SortedSet } from "./models"
import {
  BoundingBox,
  DragPosition,
  PriceListProductPricesPath,
  RectStyles,
  type CellProps,
  type CellState,
  type Point,
  type PriceListProductPricesSchema,
} from "./types"

type BulkEditorProps = {
  product: Product
  regions: Region[]
  currencies: Currency[]
  control: Control<PriceListProductPricesSchema>
  taxInclEnabled?: boolean
  priceListTaxInclusive?: boolean
  setValue: UseFormSetValue<PriceListProductPricesSchema>
  getValues: UseFormGetValues<PriceListProductPricesSchema>
}

const ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]

const PriceListProductPricesForm = ({
  product,
  regions,
  currencies,
  control,
  taxInclEnabled,
  priceListTaxInclusive,
  setValue,
  getValues,
}: BulkEditorProps) => {
  const { t } = useTranslation()
  const notification = useNotification()

  /**
   * Reference to the table element.
   */
  const tableRef = React.useRef<HTMLTableElement>(null)

  /**
   * Reference to the container element.
   */
  const containerRef = React.useRef<HTMLDivElement>(null)

  /** Command History */

  const { redo, undo, execute } = useCommandHistory()

  /** Editing state */

  const [isEditing, setIsEditing] = React.useState(false)

  /** Cell state */

  const [anchor, setAnchor] = React.useState<Point | null>(null)
  const [rangeEnd, setRangeEnd] = React.useState<Point | null>(null)

  const [selection, setSelection] = React.useState<Record<string, boolean>>({})

  const [boundingBoxes, setBoundingBoxes] = React.useState<BoundingBox[]>([])

  /** Matrix state */

  const cols = React.useMemo(() => new SortedSet<number>(), [])
  const rows = React.useMemo(() => new SortedSet<number>(), [])

  const [cells, setCells] = React.useState<Record<string, boolean>>({})

  /** Mouse interaction state */

  const [isDragging, setIsDragging] = React.useState(false)

  /** Drag to fill state */

  const [isDragToFill, setIsDragtoFill] = React.useState(false)

  const [dragToFillRangeEnd, setDragToFillRangeEnd] =
    React.useState<Point | null>(null)

  const [dragBoundingBoxes, setDragBoundingBoxes] = React.useState<
    BoundingBox[]
  >([])

  const [dragSelection, setDragSelection] = React.useState<
    Record<string, boolean>
  >({})

  const [dragRelativePosition, setDragRelativePosition] =
    React.useState<DragPosition | null>(null)

  /** Column visibility state */

  const [visibleCurrencies, setVisibleCurrencies] = React.useState<string[]>(
    currencies.map((c) => c.code)
  )
  const [visibleRegions, setVisibleRegions] = React.useState<string[]>([])

  const [open, setOpen] = React.useState(false)

  /** Callbacks */

  /**
   * Get the state of a cell.
   */
  const getCellState = React.useCallback(
    (point: Point | null): CellState => {
      const state: CellState = {
        isSelected: false,
        isAnchor: false,
        isRangeEnd: false,
        borders: {
          bottom: false,
          left: false,
          right: false,
          top: false,
        },
        outline: {
          bottom: false,
          left: false,
          right: false,
          top: false,
        },
      }

      if (!point) {
        return state
      }

      const key = getKey(point)

      if (selection[key]) {
        state.isSelected = true
      }

      if (anchor && anchor.row === point.row && anchor.col === point.col) {
        state.isAnchor = true
      }

      if (
        rangeEnd &&
        rangeEnd.row === point.row &&
        rangeEnd.col === point.col
      ) {
        state.isRangeEnd = true
      }

      state.borders = getBorderAttributes(point, boundingBoxes)

      state.outline = getBorderAttributes(point, dragBoundingBoxes)

      return state
    },
    [selection, anchor, rangeEnd, boundingBoxes, dragBoundingBoxes]
  )

  /**
   * Bulk get values of the selected cells.
   */
  const getSelectionValues = React.useCallback(
    (selection: Record<string, boolean>) => {
      const keys = Object.keys(selection)

      if (!keys.length) {
        return []
      }

      const rowData: string[][] = []

      for (const key of keys) {
        const point = getPoint(key)

        const { variantId, currencyCode, regionId, type } = getCellAttributes(
          point,
          point,
          tableRef.current
        )[0]

        const priceType = currencyCode ? "currency" : "region"
        const priceIdentifier = currencyCode || regionId

        const path =
          `variants.${variantId}.${priceType}.${priceIdentifier}.${type}` as const

        const value = getValues(path)

        if (!rowData[point.row]) {
          rowData[point.row] = Array(point.col + 1).fill(null) // Fill empty spaces with null to allow filtering them out later
        }

        rowData[point.row][point.col] = value ?? ""
      }

      const filteredRows = rowData
        .map((row) => row.filter((val) => val !== null))
        .filter(Boolean)

      return filteredRows
    },
    [getValues]
  )

  /**
   * Bulk update the values of the selected cells.
   */
  const setSelectionValues = React.useCallback(
    (selection: Record<string, boolean>, values: string[][]) => {
      if (!values.length) {
        return
      }

      const keys = Object.keys(selection)

      if (!keys.length) {
        return
      }

      const rowData: string[][] = []

      for (const key of keys) {
        const point = getPoint(key)

        const { variantId, currencyCode, regionId, type } = getCellAttributes(
          point,
          point,
          tableRef.current
        )[0]

        const priceType = currencyCode ? "currency" : "region"
        const priceIdentifier = currencyCode || regionId

        const path =
          `variants.${variantId}.${priceType}.${priceIdentifier}.${type}` as const

        if (!rowData[point.row]) {
          rowData[point.row] = Array(point.col + 1).fill(null) // Fill empty spaces with null to allow filtering them out later
        }

        rowData[point.row][point.col] = path
      }

      const filteredRows = rowData
        .map((row) => row.filter((val) => val !== null))
        .filter(Boolean)

      for (let i = 0; i < filteredRows.length; i++) {
        const valuesRow = values[i % values.length]
        const row = filteredRows[i]

        for (let j = 0; j < row.length; j++) {
          const path = row[j]
          const value = valuesRow[j % valuesRow.length]

          setValue(path as PriceListProductPricesPath, value, {
            shouldTouch: true,
            shouldDirty: true,
          })
        }
      }
    },
    [setValue]
  )

  /**
   * Clears the start and end of current range.
   */
  const clearRange = React.useCallback(
    (point?: Point | null) => {
      const keys = Object.keys(selection)
      const anchorKey = anchor ? getKey(anchor) : null
      const newKey = point ? getKey(point) : null

      const isAnchorOnlySelected = keys.length === 1 && anchorKey === keys[0]
      const isAnchorNewPoint = anchorKey && newKey && anchorKey === newKey

      const shouldIgnoreAnchor = isAnchorOnlySelected && isAnchorNewPoint

      if (!shouldIgnoreAnchor) {
        setAnchor(null)
        setSelection({})
        setRangeEnd(null)
      }

      setDragSelection({})
      setBoundingBoxes([])
      setDragBoundingBoxes([])
    },
    [anchor, selection]
  )

  const setSingleRange = React.useCallback((point: Point | null) => {
    setAnchor(point)
    setRangeEnd(point)
  }, [])

  /**
   * Adds a cell to the matrix.
   */
  const onRegisterCell = React.useCallback(
    (point: Point) => {
      cols.insert(point.col)
      rows.insert(point.row)

      const key = getKey(point)

      setCells((prev) => ({
        ...prev,
        [key]: true,
      }))
    },
    [cols, rows]
  )

  /**
   * Removes a cell from the matrix.
   */
  const onUnregisterCell = React.useCallback(
    (point: Point) => {
      /**
       * We only need to remove the column,
       * as rows are determined by the
       * product variants, and aren't
       * hideable.
       */
      cols.remove(point.col)

      const key = getKey(point)
      const { [key]: _, ...rest } = cells

      setCells(rest)
    },
    [cells, cols]
  )

  /** Mouse event callbacks */

  /**
   * Event handler for when the mouse is pressed down.
   */
  const onCellMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      if (isDragToFill) {
        return
      }

      const target = e.target as HTMLElement | null

      const cell = validateTarget(target)

      if (!cell) {
        return
      }

      setIsDragging(true)

      const point = getPointFromElement(target)

      if (e.shiftKey) {
        setRangeEnd(point)
        return
      }

      clearRange(point)
      setAnchor(point)
    },
    [isDragToFill, clearRange]
  )

  const onDragOver = React.useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) {
        return
      }

      const target = e.target as HTMLElement | null

      const cell = validateTarget(target)

      if (!cell) {
        return
      }

      const point = getPointFromElement(target)

      let animationFrameId: number | null = null

      const updateRangeEnd = () => {
        setRangeEnd(point)
      }

      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(updateRangeEnd)
      }

      // Cancel the previous animation frame if a new mousemove event occurs
      return () => {
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId)
        }
      }
    },
    [isDragging]
  )

  const onDragToFillOver = React.useCallback(
    (e: React.MouseEvent) => {
      if (!isDragToFill || !anchor || !rangeEnd) {
        return
      }

      const target = e.target as HTMLElement | null

      const dragSelection = getDragToFillSelection(target, selection)

      if (!dragSelection) {
        setDragSelection({})
        setDragRelativePosition(null)

        return
      }

      setDragSelection(dragSelection.range)
      setDragRelativePosition(dragSelection.position)
    },
    [isDragToFill, anchor, rangeEnd, selection]
  )

  /**
   * Event handler for when the mouse is moved.
   */
  const onCellOver = React.useCallback(
    (e: React.MouseEvent) => {
      onDragOver(e)
      onDragToFillOver(e)
    },
    [onDragOver, onDragToFillOver]
  )

  const onDragToFillEnd = React.useCallback(() => {
    setIsDragtoFill(false)
    setDragSelection({})
    setDragRelativePosition(null)
    setDragToFillRangeEnd(null)
    setDragSelectionRect(null)

    if (!Object.keys(dragSelection).length || !Object.keys(selection).length) {
      return
    }

    const next = getSelectionValues(selection)
    const prev = getSelectionValues(dragSelection)

    const fillCommand = new PasteCommand({
      selection: dragSelection,
      next,
      prev,
      setter: setSelectionValues,
    })

    execute(fillCommand)

    /**
     * Merge the drag selection into the main selection
     * after a successful drag to fill.
     */
    setSelection({
      ...selection,
      ...dragSelection,
    })
  }, [
    execute,
    dragSelection,
    getSelectionValues,
    selection,
    setSelectionValues,
  ])

  /**
   * Event handler for when the mouse is released.
   */
  const onMouseUp = React.useCallback(
    (_e: MouseEvent) => {
      if (isDragToFill) {
        onDragToFillEnd()
      } else if (isDragging) {
        setIsDragging(false)
      }
    },
    [isDragToFill, isDragging, onDragToFillEnd]
  )

  /** Keyboard event callbacks */

  /**
   * Callback for handling when the user presses one of the arrow keys.
   */
  const onMoveAnchor = React.useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault()

      if (isEditing) {
        /**
         * If a cell is being edited, do nothing
         * as we want to allow the user to move
         * the cursor around the input.
         */
        return
      }

      if (!anchor) {
        const firstRow = rows.getFirst()
        const firstCol = cols.getFirst()

        if (!firstRow || !firstCol) {
          return
        }

        setSingleRange({ row: firstRow, col: firstCol })
        return
      }

      if (e.key === "ArrowUp") {
        if (e.shiftKey) {
          if (!rangeEnd) {
            return
          }

          const previousRow = rows.getPrev(rangeEnd.row)

          if (!previousRow) {
            return
          }

          const point = { row: previousRow, col: rangeEnd.col }

          setRangeEnd(point)

          const element = getElementFromPoint(point, tableRef.current)

          if (!element) {
            return
          }

          element.scrollIntoView({ block: "nearest" })

          return
        }

        if (e.metaKey || e.ctrlKey) {
          const previousRow = rows.getFirst()

          if (!previousRow) {
            return
          }

          const point = { row: previousRow, col: anchor.col }

          setSingleRange(point)

          const element = getElementFromPoint(point, tableRef.current)

          if (!element) {
            return
          }

          element.scrollIntoView({ block: "nearest" })

          return
        }

        const previousRow = rows.getPrev(anchor.row)

        if (!previousRow) {
          return
        }

        const point = { row: previousRow, col: anchor.col }

        setSingleRange(point)

        const element = getElementFromPoint(point, tableRef.current)

        if (!element) {
          return
        }

        element.scrollIntoView({ block: "nearest" })
      }

      if (e.key === "ArrowDown") {
        if (e.shiftKey) {
          if (!rangeEnd) {
            return
          }

          const nextRow = rows.getNext(rangeEnd.row)

          if (!nextRow) {
            return
          }

          const point = { row: nextRow, col: rangeEnd.col }

          setRangeEnd(point)

          const element = getElementFromPoint(point, tableRef.current)

          if (!element) {
            return
          }

          element.scrollIntoView({ block: "nearest" })

          return
        }

        if (e.metaKey || e.ctrlKey) {
          const nextRow = rows.getLast()

          if (!nextRow) {
            return
          }

          const point = { row: nextRow, col: anchor.col }

          setSingleRange(point)

          const element = getElementFromPoint(point, tableRef.current)

          if (!element) {
            return
          }

          element.scrollIntoView({ block: "nearest" })

          return
        }

        const nextRow = rows.getNext(anchor.row)

        if (!nextRow) {
          return
        }

        const point = { row: nextRow, col: anchor.col }

        setSingleRange(point)

        const element = getElementFromPoint(point, tableRef.current)

        if (!element) {
          return
        }

        element.scrollIntoView({ block: "nearest" })

        return
      }

      if (e.key === "ArrowLeft") {
        if (e.shiftKey) {
          if (!rangeEnd) {
            return
          }

          const previousCol = cols.getPrev(rangeEnd.col)

          if (!previousCol) {
            return
          }

          const point = { row: rangeEnd.row, col: previousCol }

          setRangeEnd(point)

          const element = getElementFromPoint(point, tableRef.current)

          if (!element) {
            return
          }

          element.scrollIntoView({ block: "nearest" })

          return
        }

        if (e.metaKey || e.ctrlKey) {
          const previousCol = cols.getFirst()

          if (!previousCol) {
            return
          }

          const point = { row: anchor.row, col: previousCol }

          setSingleRange(point)

          const element = getElementFromPoint(point, tableRef.current)

          if (!element) {
            return
          }

          element.scrollIntoView({ block: "nearest" })

          return
        }

        const previousCol = cols.getPrev(anchor.col)

        if (!previousCol) {
          return
        }

        const point = { row: anchor.row, col: previousCol }

        setSingleRange(point)

        const element = getElementFromPoint(point, tableRef.current)

        if (!element) {
          return
        }

        element.scrollIntoView({ block: "nearest" })

        return
      }

      if (e.key === "ArrowRight") {
        if (e.shiftKey) {
          if (!rangeEnd) {
            return
          }

          const nextCol = cols.getNext(rangeEnd.col)

          if (!nextCol) {
            return
          }

          const point = { row: rangeEnd.row, col: nextCol }

          setRangeEnd(point)

          const element = getElementFromPoint(point, tableRef.current)

          if (!element) {
            return
          }

          element.scrollIntoView({ block: "nearest" })

          return
        }

        if (e.metaKey || e.ctrlKey) {
          const nextCol = cols.getLast()

          if (!nextCol) {
            return
          }

          const point = { row: anchor.row, col: nextCol }

          setSingleRange(point)

          const element = getElementFromPoint(point, tableRef.current)

          if (!element) {
            return
          }

          element.scrollIntoView({ block: "nearest" })

          return
        }

        const nextCol = cols.getNext(anchor.col)

        if (!nextCol) {
          return
        }

        const point = { row: anchor.row, col: nextCol }

        setSingleRange(point)

        const element = getElementFromPoint(point, tableRef.current)

        if (!element) {
          return
        }

        element.scrollIntoView({ block: "nearest" })

        return
      }
    },
    [anchor, rangeEnd, rows, cols, isEditing, setSingleRange]
  )

  /**
   * Callback for handling when the user presses the backspace key.
   */
  const onBackspace = React.useCallback(
    (e: KeyboardEvent) => {
      const keys = Object.keys(selection)

      if (!keys.length) {
        return
      }

      e.preventDefault()
      e.stopPropagation()

      const prev = getSelectionValues(selection)
      const next = prev.map((row) => row.map(() => ""))

      const deleteCommand = new DeleteCommand({
        selection,
        prev,
        next,
        setter: setSelectionValues,
      })

      execute(deleteCommand)

      const anchorElement = getElementFromPoint(anchor, tableRef.current)

      // Refocus the anchor element
      if (anchorElement) {
        anchorElement.focus()
      }
    },
    [anchor, selection, getSelectionValues, setSelectionValues, execute]
  )

  const onTab = React.useCallback(
    (e: KeyboardEvent) => {
      if (!anchor) {
        return
      }

      if (e.shiftKey) {
        const previousCol = cols.getPrev(anchor.col)

        if (!previousCol) {
          const previousRow = rows.getPrev(anchor.row)

          if (!previousRow) {
            return
          }

          const lastCol = cols.getLast()

          if (!lastCol) {
            return
          }

          const point = { row: previousRow, col: lastCol }

          setSingleRange(point)

          const element = getElementFromPoint(point, tableRef.current)

          if (!element) {
            return
          }

          element.scrollIntoView({ block: "nearest" })

          return
        }

        const point = { row: anchor.row, col: previousCol }

        setSingleRange(point)

        const element = getElementFromPoint(point, tableRef.current)

        if (!element) {
          return
        }

        element.scrollIntoView({ block: "nearest" })

        return
      }

      const nextCol = cols.getNext(anchor.col)

      if (!nextCol) {
        const nextRow = rows.getNext(anchor.row)

        if (!nextRow) {
          return
        }

        const firstCol = cols.getFirst()

        if (!firstCol) {
          return
        }

        const point = { row: nextRow, col: firstCol }

        setSingleRange(point)

        const element = getElementFromPoint(point, tableRef.current)

        if (!element) {
          return
        }

        element.scrollIntoView({ block: "nearest" })

        return
      }

      const point = { row: anchor.row, col: nextCol }

      setSingleRange(point)

      const element = getElementFromPoint(point, tableRef.current)

      if (!element) {
        return
      }

      element.scrollIntoView({ block: "nearest" })

      return
    },
    [anchor, rows, cols, setSingleRange]
  )

  const onUndo = React.useCallback(
    (e: KeyboardEvent) => {
      if (e.shiftKey) {
        redo()
        return
      }

      undo()
    },
    [redo, undo]
  )

  const onPaste = React.useCallback(
    (e: ClipboardEvent) => {
      const keys = Object.keys(selection)

      if (!keys.length) {
        return
      }

      const prev = getSelectionValues(selection)
      const next: string[][] = []

      const values = e.clipboardData?.getData("text/plain")

      if (!values) {
        return
      }

      const rows = values.split("\n")

      for (const row of rows) {
        next.push(row.split("\t"))
      }

      const isInvalid = next.some((row) => row.some((val) => isNaN(+val)))

      if (isInvalid) {
        notification(
          t(
            "price-list-product-prices-form-invalid-data-title",
            "Invalid data"
          ),
          t(
            "price-list-product-prices-form-invalid-data-body",
            "The data you pasted contains values that are not numbers."
          ),
          "error"
        )

        return
      }

      const pasteComand = new PasteCommand({
        selection,
        next,
        prev,
        setter: setSelectionValues,
      })

      execute(pasteComand)
    },
    [
      selection,
      setSelectionValues,
      getSelectionValues,
      execute,
      notification,
      t,
    ]
  )

  const onCopy = React.useCallback(
    (e: ClipboardEvent) => {
      const data = getSelectionValues(selection)

      /**
       * Format data for copying to clipboard.
       * The data is tab separated, and each row is separated by a new line.
       */
      const values = data.map((row) => row.join("\t")).join("\n")

      e.preventDefault()
      e.clipboardData?.setData("text/plain", values)
    },
    [getSelectionValues, selection]
  )

  /**
   * Callback for delegating keyboard events to the appropriate handler.
   */
  const onKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      if (open) {
        return // If the column visibility menu is open, do nothing
      }

      if (ARROW_KEYS.includes(e.key)) {
        e.preventDefault()
        onMoveAnchor(e)

        return
      }

      if (e.key === "Backspace") {
        if (isEditing) {
          return
        }

        e.preventDefault()
        onBackspace(e)
      }

      if (e.key === "z") {
        onUndo(e)
      }

      if (e.key === "Tab") {
        // If the current focus is not within the tableRef, do nothing
        if (!tableRef.current?.contains(e.target as Node)) {
          return
        }

        e.preventDefault()
        onTab(e)
      }
    },
    [onMoveAnchor, onBackspace, onUndo, onTab, isEditing, open]
  )

  /**
   * Callback for handling when the user presses the enter key,
   * on an already active anchor cell.
   */
  const onNextRow = React.useCallback(() => {
    if (!anchor) {
      return
    }

    let col: number | null = anchor.col

    let nextRow = rows.getNext(anchor.row)

    if (!nextRow) {
      col = cols.getNext(col)

      if (!col) {
        return
      }

      nextRow = rows.getFirst()

      if (!nextRow) {
        return
      }
    }

    const point = { row: nextRow, col }

    setSingleRange(point)
  }, [anchor, rows, cols, setSingleRange])

  /** Drag to fill callbacks */

  const onDragToFillStart = React.useCallback(
    (e: React.MouseEvent) => {
      const keys = Object.keys(selection)

      if (!keys.length) {
        return
      }

      e.preventDefault()
      e.stopPropagation()

      setIsDragtoFill(true)
    },
    [selection]
  )

  /** Column visibililty callbacks */

  /**
   * Toggle the visibility of a currency.
   */
  const toggleCurrency = React.useCallback(
    (code: string) => {
      if (visibleCurrencies.includes(code)) {
        setVisibleCurrencies((prev) => prev.filter((c) => c !== code))
      } else {
        setVisibleCurrencies((prev) => [...prev, code])
      }
    },
    [visibleCurrencies]
  )

  /**
   * Toggle the visibility of a region.
   */
  const toggleRegion = React.useCallback(
    (id: string) => {
      if (visibleRegions.includes(id)) {
        setVisibleRegions((prev) => prev.filter((c) => c !== id))
      } else {
        setVisibleRegions((prev) => [...prev, id])
      }
    },
    [visibleRegions]
  )

  /** Effects */

  /**
   * If anchor and rangeEnd are set, then select all cells between them.
   */
  React.useEffect(() => {
    if (!anchor || !rangeEnd) {
      return
    }

    const range = getRange(anchor, rangeEnd)

    setSelection(range)
  }, [anchor, rangeEnd])

  React.useEffect(() => {
    if (!anchor || !dragToFillRangeEnd) {
      return
    }

    const range = getRange(anchor, dragToFillRangeEnd)

    setDragSelection(range)
  }, [anchor, dragToFillRangeEnd])

  /**
   * Auto corrective effect for ensuring that the anchor is always
   * part of the selected cells.
   */
  React.useEffect(() => {
    if (!anchor) {
      return
    }

    setSelection((prev) => ({
      ...prev,
      [getKey(anchor)]: true,
    }))
  }, [anchor])

  /**
   * Auto corrective effect for ensuring we always
   * have a range end.
   */
  React.useEffect(() => {
    if (!anchor) {
      return
    }

    if (rangeEnd) {
      return
    }

    setRangeEnd(anchor)
  }, [anchor, rangeEnd])

  React.useEffect(() => {
    /**
     * If the user is dragging, do nothing.
     */
    if (isDragging) {
      return
    }

    const keys = Object.keys(selection)

    if (keys.length === 0) {
      return
    }

    const points = keys
      .map((key) => {
        return getPoint(key)
      })
      .filter((point) => !!point) as Point[]

    const boundingBoxes = calculateBoundingBoxes(points)

    setBoundingBoxes(boundingBoxes)
  }, [isDragging, selection])

  React.useEffect(() => {
    const keys = Object.keys(dragSelection)

    if (keys.length === 0) {
      return
    }

    const points = keys
      .map((key) => {
        return getPoint(key)
      })
      .filter((point) => !!point) as Point[]

    const boundingBoxes = calculateBoundingBoxes(points)

    setDragBoundingBoxes(boundingBoxes)
  }, [dragSelection])

  /**
   * Add event listeners for all events that the bulk editor needs to handle.
   */
  React.useEffect(() => {
    document.addEventListener("mouseup", onMouseUp)

    document.addEventListener("keydown", onKeyDown)

    document.addEventListener("copy", onCopy)
    document.addEventListener("paste", onPaste)

    return () => {
      document.removeEventListener("mouseup", onMouseUp)

      document.removeEventListener("keydown", onKeyDown)

      document.removeEventListener("copy", onCopy)
      document.removeEventListener("paste", onPaste)
    }
  }, [onMouseUp, onKeyDown, onCopy, onPaste])

  React.useEffect(() => {
    const table = tableRef.current

    if (!table) {
      return
    }

    const onFocus = (_e: FocusEvent) => {
      if (anchor) {
        return
      }

      const firstRow = rows.getFirst()
      const firstCol = cols.getFirst()

      if (!firstRow || !firstCol) {
        return
      }

      setSingleRange({ row: firstRow, col: firstCol })
      const element = getElementFromPoint(
        { row: firstRow, col: firstCol },
        table
      )

      if (!element) {
        return
      }

      element.scrollIntoView({ block: "nearest" })
      element.focus()
    }

    table.addEventListener("focusin", onFocus)

    return () => {
      table.removeEventListener("focusin", onFocus)
    }
  }, [setSingleRange, clearRange, anchor, rows, cols])

  React.useEffect(() => {
    if (!anchor) {
      return
    }

    const table = tableRef.current
    const element = getElementFromPoint(anchor, table)

    if (!element) {
      return
    }

    element.focus()
  }, [anchor])

  const [selectionRect, setSelectionRect] = React.useState<RectStyles | null>(
    null
  )

  const [dragSelectionRect, setDragSelectionRect] =
    React.useState<RectStyles | null>(null)

  const [anchorRect, setAnchorRect] = React.useState<RectStyles | null>(null)

  React.useEffect(() => {
    const styles = getRect(selection, tableRef.current)

    setSelectionRect(styles)
  }, [selection])

  React.useEffect(() => {
    const styles = getRect(dragSelection, tableRef.current)

    setDragSelectionRect(styles)
  }, [dragSelection])

  React.useEffect(() => {
    if (!anchor) {
      setAnchorRect(null)
      return
    }

    const styles = getRect({ [getKey(anchor)]: true }, tableRef.current)

    setAnchorRect(styles)
  }, [anchor])

  return (
    <div className="h-full">
      <div className="border-ui-border-base flex items-center justify-between border-b px-4 py-3">
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenu.Trigger asChild>
            <Button variant="secondary" type="button">
              <Adjustments className="text-ui-fg-subtle" />
              {t(
                "price-list-product-prices-form-column-visibility-button",
                "Currencies"
              )}
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            className="no-scrollbar max-h-[var(--radix-popper-available-height)] overflow-y-auto"
            collisionPadding={16}
          >
            <DropdownMenu.Label>
              {t(
                "price-list-product-prices-form-column-visibility-currencies-label",
                "Currencies"
              )}
            </DropdownMenu.Label>
            {currencies.map((currency) => {
              return (
                <DropdownMenu.CheckboxItem
                  checked={visibleCurrencies.includes(currency.code)}
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    toggleCurrency(currency.code)
                  }}
                  key={currency.code}
                >
                  <span>
                    {currency.name}{" "}
                    <span className="text-ui-fg-subtle">
                      ({currency.code.toUpperCase()})
                    </span>
                  </span>
                </DropdownMenu.CheckboxItem>
              )
            })}
            <DropdownMenu.Separator />
            <DropdownMenu.Label>
              {t(
                "price-list-product-prices-form-column-visibility-regions-label",
                "Regions"
              )}
            </DropdownMenu.Label>
            {regions.map((region) => {
              return (
                <DropdownMenu.CheckboxItem
                  checked={visibleRegions.includes(region.id)}
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    toggleRegion(region.id)
                  }}
                  key={region.id}
                >
                  <span>
                    {region.name}{" "}
                    <span className="text-ui-fg-subtle">
                      ({region.currency_code.toUpperCase()})
                    </span>
                  </span>
                </DropdownMenu.CheckboxItem>
              )
            })}
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>
      <div
        ref={containerRef}
        className="relative h-[calc(100%-57px)] w-full overflow-auto"
      >
        <div
          role="presentation"
          style={
            anchorRect
              ? anchorRect
              : {
                  display: "none",
                }
          }
          className="border-ui-border-interactive pointer-events-none absolute z-[52] border"
        />
        <div
          role="presentation"
          style={
            selectionRect
              ? selectionRect
              : {
                  display: "none",
                }
          }
          className="border-ui-border-interactive pointer-events-none absolute z-[51] border"
        />
        <div
          role="presentation"
          style={
            dragSelectionRect
              ? dragSelectionRect
              : {
                  display: "none",
                }
          }
          className={clx(
            "border-ui-border-interactive pointer-events-none absolute z-50 border border-dashed",
            {
              "border-b-0": dragRelativePosition === "above",
              "border-t-0": dragRelativePosition === "below",
              "border-l-0": dragRelativePosition === "right",
              "border-r-0": dragRelativePosition === "left",
            }
          )}
        />
        <table
          className={clx("txt-compact-small text-ui-fg-base w-full", {
            "select-none": isDragging,
          })}
          ref={tableRef}
        >
          <thead>
            <tr className="[&_th]:txt-compact-small-plus text-ui-fg-subtle [&_th]:border-ui-border-base h-10 [&_th:last-of-type]:border-r-0 [&_th]:min-w-[220px] [&_th]:border-b [&_th]:border-r">
              <th className="max-w-[220px] text-left">
                <div className="px-4 py-2.5">
                  {t(
                    "price-list-product-prices-form-column-product-label",
                    "Product"
                  )}
                </div>
              </th>
              {currencies.map((currency) => {
                const isTaxIncluded =
                  priceListTaxInclusive ?? currency.includes_tax

                if (!visibleCurrencies.includes(currency.code)) {
                  return null
                }

                return (
                  <th className="text-left" key={currency.code}>
                    <div className="flex items-center justify-between px-4 py-2.5">
                      <span>
                        {t(
                          "price-list-product-prices-form-column-currencies-price-label",
                          "Price {{code}}",
                          {
                            code: currency.code.toUpperCase(),
                          }
                        )}
                      </span>
                      {taxInclEnabled && (
                        <div>
                          {isTaxIncluded && (
                            <BuildingTax className="text-ui-fg-subtle" />
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                )
              })}
              {regions.map((region) => {
                const isTaxIncluded =
                  priceListTaxInclusive ?? region.includes_tax

                if (!visibleRegions.includes(region.id)) {
                  return null
                }

                return (
                  <th className="text-left" key={region.id}>
                    <div className="flex items-center justify-between px-4 py-2.5">
                      <span>
                        {t(
                          "price-list-product-prices-form-column-regions-price-label",
                          "Price {{name}} ({{code}})",
                          {
                            name: region.name,
                            code: region.currency_code.toUpperCase(),
                          }
                        )}
                      </span>
                      {taxInclEnabled && (
                        <div>
                          {isTaxIncluded && (
                            <BuildingTax className="text-ui-fg-subtle" />
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-ui-bg-subtle h-10 [&_td:last-of-type]:border-r-0 [&_td]:border-b [&_td]:border-r">
              <td className="w-[220px] max-w-[220px]">
                <div className="grid w-[220px] grid-cols-[16px_1fr] gap-x-3 overflow-hidden px-4 py-2.5">
                  <div className="bg-ui-bg-component h-[22px] w-4 rounded-[4px]">
                    {product.thumbnail && (
                      <img
                        src={product.thumbnail}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex items-center">
                    <p className="w-[160px] overflow-hidden text-ellipsis whitespace-nowrap">
                      {product.title}
                    </p>
                  </div>
                </div>
              </td>
              {currencies.map((currency) => {
                if (!visibleCurrencies.includes(currency.code)) {
                  return null
                }

                return (
                  <td key={currency.code}>
                    <div className="text-ui-fg-muted px-4 py-2.5 text-right">
                      -
                    </div>
                  </td>
                )
              })}
              {regions.map((region) => {
                if (!visibleRegions.includes(region.id)) {
                  return null
                }

                return (
                  <td key={region.id}>
                    <div className="text-ui-fg-muted px-4 py-2.5 text-right">
                      -
                    </div>
                  </td>
                )
              })}
            </tr>
            {product.variants.map((variant) => {
              return (
                <tr
                  key={variant.id}
                  className="[&_td]:border-r-ui-border-base [&_td]:border-b-ui-border-base h-10 [&_td:last-of-type]:border-r-transparent [&_td]:border [&_td]:border-l-transparent [&_td]:border-t-transparent"
                >
                  <td className="max-w-[220px]">
                    <div className="flex w-[220px] items-center gap-x-3 overflow-hidden px-4 py-2.5">
                      <div className="h-[22px] w-4" />
                      <p className="text-ui-fg-subtle w-[160px] overflow-hidden text-ellipsis whitespace-nowrap">
                        <span>{variant.title}</span>
                        {variant.sku && <span className="px-2">·</span>}
                        {variant.sku && <span>{variant.sku}</span>}
                      </p>
                    </div>
                  </td>
                  {currencies.map((currency) => {
                    if (!visibleCurrencies.includes(currency.code)) {
                      return null
                    }

                    const meta = CURRENCY_MAP[currency.code.toUpperCase()]

                    return (
                      <Controller
                        key={currency.code}
                        control={control}
                        name={`variants.${variant.id}.currency.${currency.code}.amount`}
                        render={({ field }) => {
                          return (
                            <Cell
                              symbol={meta.symbol_native}
                              decimalScale={meta.decimal_digits}
                              type="amount"
                              variantId={variant.id}
                              currencyCode={currency.code}
                              onRegisterCell={onRegisterCell}
                              onUnregisterCell={onUnregisterCell}
                              onDragToFillStart={onDragToFillStart}
                              onCellMouseDown={onCellMouseDown}
                              onCellOver={onCellOver}
                              getCellState={getCellState}
                              setIsEditing={setIsEditing}
                              onNextRow={onNextRow}
                              {...field}
                            />
                          )
                        }}
                      />
                    )
                  })}
                  {regions.map((region) => {
                    if (!visibleRegions.includes(region.id)) {
                      return null
                    }

                    const meta =
                      CURRENCY_MAP[region.currency_code.toUpperCase()]

                    return (
                      <Controller
                        key={region.id}
                        control={control}
                        name={`variants.${variant.id}.region.${region.id}.amount`}
                        render={({ field }) => {
                          return (
                            <Cell
                              symbol={meta.symbol_native}
                              decimalScale={meta.decimal_digits}
                              type="amount"
                              variantId={variant.id}
                              regionId={region.id}
                              onRegisterCell={onRegisterCell}
                              onUnregisterCell={onUnregisterCell}
                              onDragToFillStart={onDragToFillStart}
                              onCellMouseDown={onCellMouseDown}
                              onCellOver={onCellOver}
                              getCellState={getCellState}
                              setIsEditing={setIsEditing}
                              onNextRow={onNextRow}
                              {...field}
                            />
                          )
                        }}
                      />
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

const Cell = React.forwardRef<HTMLInputElement, CellProps>(
  (
    {
      value,
      name,
      type,
      onChange,
      onBlur,
      onRegisterCell,
      onUnregisterCell,
      onDragToFillStart,
      onCellMouseDown,
      onCellOver,
      getCellState,
      setIsEditing,
      onNextRow,
      symbol,
      decimalScale,
      variantId,
      regionId,
      currencyCode,
    },
    ref
  ) => {
    const [localValue, setLocalValue] = React.useState<
      { value?: string; float?: number } | undefined
    >(value ? { value, float: parseFloat(value) } : undefined)

    const [isActive, setIsActive] = React.useState(false)

    const [point, setPoint] = React.useState<Point | null>(null)

    const cellRef = React.useRef<HTMLTableCellElement>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
      ref,
      () => inputRef.current
    )

    const cellIndex = cellRef.current?.cellIndex
    const rowIndex = isParentRow(cellRef.current)
      ? cellRef.current.parentElement.rowIndex
      : undefined

    /**
     * If the managed value changes,
     * while the cell is not active, then
     * we want to update the local value.
     */
    React.useEffect(() => {
      if (isActive) {
        return
      }

      setLocalValue(value ? { value, float: parseFloat(value) } : { value: "" })
    }, [value, isActive])

    React.useEffect(() => {
      if (!cellIndex || !rowIndex) {
        return
      }

      const point = { col: cellIndex, row: rowIndex }

      onRegisterCell(point)
      setPoint(point)

      return () => {
        onUnregisterCell(point)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cellIndex, rowIndex])

    const { isAnchor, isSelected, borders } = getCellState(point)

    React.useEffect(() => {
      if (!inputRef.current) {
        return
      }

      if (!isActive) {
        /**
         * If the user leaves a decimal separator as the last character,
         * then we need to manually remove it.
         */
        const strippedValue =
          localValue?.value && localValue.value.endsWith("." || ",")
            ? localValue.value.slice(0, -1)
            : localValue?.value

        /**
         * react-currency-input-field passes undefined when the input is empty.
         * This conflicts with react-hook-form, which internally uses undefined
         * to indicate that the field should use its default value.
         *
         * To work around this, we convert undefined to an empty string.
         */
        const formattedValue = strippedValue
          ? formatValue({
              value: strippedValue.replace(/,/g, "."), // If the current locale uses commas as decimal separators, then we need to replace them with dots.
              decimalScale: decimalScale ?? 0,
              decimalSeparator: ".",
              disableGroupSeparators: true,
            })
          : ""

        onChange(formattedValue)

        inputRef.current.blur()
        return
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive, onChange])

    React.useEffect(() => {
      if (!isAnchor) {
        setIsActive(false)
        setIsEditing(false)

        inputRef.current?.blur()
        onBlur()
      }
    }, [isAnchor, onBlur, setIsEditing])

    const onFocusInput = React.useCallback(() => {
      inputRef.current?.focus()

      inputRef.current?.setSelectionRange(
        inputRef.current.value.length,
        inputRef.current.value.length
      )
    }, [])

    const onMouseDown = React.useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()

        if (isActive) {
          /**
           * If the cell is active, then we don't want to
           * do anything.
           */
          return
        }

        if (isAnchor) {
          /**
           * If the cell is the anchor, then we want to
           * toggle the active state on double click.
           * If not a double click, then we want to
           * do nothing.
           */
          if (e.detail === 2) {
            setIsActive(true)
            setIsEditing(true)

            onFocusInput()

            return
          }
        }

        onCellMouseDown(e)
      },
      [onCellMouseDown, setIsEditing, onFocusInput, isAnchor, isActive]
    )

    const onEnter = React.useCallback(
      (_e: KeyboardEvent) => {
        if (!isAnchor) {
          return
        }

        if (isActive) {
          onNextRow()
          return
        }

        setIsActive(true)
        setIsEditing(true)

        onFocusInput()
      },
      [isAnchor, isActive, onNextRow, setIsEditing, onFocusInput]
    )

    const onSpace = React.useCallback(
      (e: KeyboardEvent) => {
        if (!isAnchor) {
          return
        }

        if (isActive) {
          return
        }

        e.stopPropagation()
        e.preventDefault()

        setIsActive(true)
        setIsEditing(true)
        setLocalValue({
          value: "",
        })

        inputRef.current?.focus()
      },
      [isAnchor, isActive, setLocalValue, setIsEditing]
    )

    const onNumberKey = React.useCallback(
      (e: KeyboardEvent) => {
        if (!isAnchor) {
          return // This is not the anchor cell, so we don't want to do anything.
        }

        if (isActive) {
          // If the cell is active, then we don't want to hijack the event.
          return
        }

        e.stopPropagation()
        e.preventDefault()

        setIsActive(true)
        setIsEditing(true)

        const key = e.key
        setLocalValue({
          float: parseFloat(key),
          value: String(key),
        })

        inputRef.current?.focus()
      },
      [isAnchor, isActive, setIsEditing]
    )

    const onArrowKey = React.useCallback(
      (e: KeyboardEvent) => {
        if (!isActive || !inputRef.current) {
          return
        }

        const input = inputRef.current
        const currentPosition = input.selectionStart
        const textLength = input.value.length

        if (currentPosition === null) {
          input.setSelectionRange(0, 0)
          return
        }

        switch (e.key) {
          case "ArrowUp":
            input.setSelectionRange(0, 0)
            break
          case "ArrowDown":
            input.setSelectionRange(textLength, textLength)
            break
          case "ArrowLeft":
            if (currentPosition === 0) {
              return
            }

            input.setSelectionRange(currentPosition - 1, currentPosition - 1)
            break
          case "ArrowRight":
            if (currentPosition === textLength) {
              return
            }

            input.setSelectionRange(currentPosition + 1, currentPosition + 1)
            break
        }
      },
      [isActive]
    )

    const onEscape = React.useCallback(
      (e: KeyboardEvent) => {
        if (!isActive) {
          return
        }

        e.stopPropagation()
        e.preventDefault()

        inputRef.current?.focus()
        setIsActive(false)

        onBlur()

        return
      },
      [isActive, onBlur]
    )

    const onKeydown = React.useCallback(
      (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          onEnter(e)
        }

        if (e.key === " ") {
          onSpace(e)
        }

        if (ARROW_KEYS.includes(e.key)) {
          onArrowKey(e)
        }

        if (!isNaN(parseInt(e.key))) {
          onNumberKey(e)
        }

        if (e.key === "Escape") {
          onEscape(e)
        }
      },
      [onEnter, onSpace, onArrowKey, onNumberKey, onEscape]
    )

    React.useEffect(() => {
      document.addEventListener("keydown", onKeydown)

      return () => {
        document.removeEventListener("keydown", onKeydown)
      }
    }, [onKeydown])

    const onActiveAwareBlur = React.useCallback(() => {
      if (isActive) {
        setIsActive(false)
      }

      onBlur()
    }, [onBlur, isActive])

    const onValueChange = (
      _value: string | undefined,
      _name: string | undefined,
      values: CurrencyInputOnChangeValues | undefined
    ) => {
      setLocalValue(
        values ? { value: values.value, float: values.float! } : undefined
      )
    }

    const onFocus = React.useCallback((e: React.FocusEvent) => {
      e.stopPropagation()

      /**
       * When an input is focused, we want to ensure
       * that its parent cell is in view.
       */
      cellRef.current?.scrollIntoView({ block: "nearest" })
    }, [])

    return (
      <td
        ref={cellRef}
        className={clx(
          "relative h-[10] min-w-[220px] outline-none",
          {
            "!bg-ui-bg-highlight": isSelected && !isActive,
          },
          {
            "before:shadow-borders-active before:pointer-events-none before:absolute before:inset-0 before:z-50 before:content-['']":
              isAnchor && isActive,
          }
        )}
        onMouseDown={onMouseDown}
        onMouseOver={onCellOver}
        data-variant-id={variantId}
        data-region-id={regionId}
        data-currency-code={currencyCode}
        data-type={type}
        data-editable={true}
        data-row-index={rowIndex}
        data-col-index={cellIndex}
        aria-colindex={cellIndex}
        aria-rowindex={rowIndex}
        tabIndex={0}
      >
        <div className="flex items-center px-4 py-2.5">
          {symbol && (
            <span className="text-ui-fg-muted h-full w-fit">{symbol}</span>
          )}
          <AmountField
            ref={inputRef}
            allowNegativeValue={false}
            name={name}
            value={localValue?.value}
            onBlur={onActiveAwareBlur}
            onFocus={onFocus}
            onValueChange={onValueChange}
            decimalScale={isActive ? undefined : decimalScale}
            autoFocus={false}
            tabIndex={-1}
            placeholder="-"
            className={clx(
              "h-full flex-1 cursor-default bg-transparent text-right outline-none"
            )}
          />
        </div>
        {borders.bottom && borders.right && (
          <div
            onMouseDown={onDragToFillStart}
            className="bg-ui-bg-interactive absolute -bottom-1 -right-1 z-50 h-2 w-2 cursor-crosshair rounded-full"
          />
        )}
      </td>
    )
  }
)
Cell.displayName = "PriceListProductPricesForm.Cell"

export { PriceListProductPricesForm }
