import { CellContext } from "@tanstack/react-table"
import { MouseEvent, useContext, useEffect, useMemo, useRef } from "react"
import { DataGridContext } from "./context"
import {
  CellCoords,
  DataGridCellContext,
  DataGridCellRenderProps,
} from "./types"
import { generateCellId, isCellMatch } from "./utils"

const useDataGridContext = () => {
  const context = useContext(DataGridContext)

  if (!context) {
    throw new Error(
      "useDataGridContext must be used within a DataGridContextProvider"
    )
  }

  return context
}

type UseDataGridCellProps<TData, TValue> = {
  field: string
  context: CellContext<TData, TValue>
}

export const useDataGridCell = <TData, TValue>({
  field,
  context,
}: UseDataGridCellProps<TData, TValue>) => {
  const { rowIndex, columnIndex } = context as DataGridCellContext<
    TData,
    TValue
  >

  const coords: CellCoords = useMemo(
    () => ({ row: rowIndex, col: columnIndex }),
    [rowIndex, columnIndex]
  )
  const id = generateCellId(coords)

  const {
    register,
    control,
    anchor,
    selection,
    dragSelection,
    startEdit,
    getInputMouseDownHandler,
    getInputChangeHandler,
    onInputBlur,
    onInputFocus,
    getWrapperFocusHandler,
    getOverlayMouseDownHandler,
    getWrapperMouseOverHandler,
  } = useDataGridContext()

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLElement>(null)

  function handleOverlayMouseDown(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (e.detail === 2) {
      inputRef.current?.focus()
      startEdit()

      return
    }

    if (containerRef.current) {
      containerRef.current.focus()
    }
  }

  const showOverlay = useMemo(() => {
    // return true if isAnchor and inputRef.current does not have focus
    return anchor ? !inputRef.current?.contains(document.activeElement) : false
  }, [anchor])

  const isAnchor = useMemo(() => {
    return anchor ? isCellMatch(coords, anchor) : false
  }, [anchor, coords])

  useEffect(() => {
    if (isAnchor && !containerRef.current?.contains(document.activeElement)) {
      containerRef.current?.focus()
    }
  }, [isAnchor])

  const renderProps: DataGridCellRenderProps = {
    container: {
      isAnchor: anchor ? isCellMatch(coords, anchor) : false,
      isSelected: selection[id] || false,
      isDragSelected: dragSelection[id] || false,
      showOverlay,
      innerProps: {
        ref: containerRef,
        onMouseOver: getWrapperMouseOverHandler(coords),
        onFocus: getWrapperFocusHandler(coords),
      },
      overlayProps: {
        onMouseDown: handleOverlayMouseDown,
      },
    },
    input: {
      ref: inputRef,
      onMouseDown: getInputMouseDownHandler(coords),
      // onChange: getInputChangeHandler(field),
      // onBlur: onInputBlur,
      // onFocus: onInputFocus,
      "data-row": coords.row,
      "data-col": coords.col,
      "data-cell-id": id,
      "data-field": field,
    },
  }

  return {
    id,
    register,
    control,
    renderProps,
  }
}
