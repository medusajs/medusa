import { FocusEvent, MouseEvent, useCallback } from "react"
import { FieldValues, UseFormSetValue } from "react-hook-form"
import { DataGridMatrix, DataGridUpdateCommand } from "../models"
import { DataGridCoordinates } from "../types"

type UseDataGridCellHandlersOptions<TData, TFieldValues extends FieldValues> = {
  matrix: DataGridMatrix<TData, TFieldValues>
  anchor: DataGridCoordinates | null
  rangeEnd: DataGridCoordinates | null
  setRangeEnd: (coords: DataGridCoordinates | null) => void
  isSelecting: boolean
  setIsSelecting: (isSelecting: boolean) => void
  isDragging: boolean
  setIsDragging: (isDragging: boolean) => void
  setSingleRange: (coords: DataGridCoordinates) => void
  dragEnd: DataGridCoordinates | null
  setDragEnd: (coords: DataGridCoordinates | null) => void
  setValue: UseFormSetValue<TFieldValues>
  execute: (command: DataGridUpdateCommand) => void
  multiColumnSelection?: boolean
}

export const useDataGridCellHandlers = <
  TData,
  TFieldValues extends FieldValues
>({
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
  multiColumnSelection,
}: UseDataGridCellHandlersOptions<TData, TFieldValues>) => {
  const getWrapperFocusHandler = useCallback(
    (coords: DataGridCoordinates) => {
      return (_e: FocusEvent<HTMLElement>) => {
        setSingleRange(coords)
      }
    },
    [setSingleRange]
  )

  const getOverlayMouseDownHandler = useCallback(
    (coords: DataGridCoordinates) => {
      return (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation()
        e.preventDefault()

        if (e.shiftKey) {
          setRangeEnd(coords)
          return
        }

        setIsSelecting(true)

        setSingleRange(coords)
      }
    },
    [setIsSelecting, setRangeEnd, setSingleRange]
  )

  const getWrapperMouseOverHandler = useCallback(
    (coords: DataGridCoordinates) => {
      if (!isDragging && !isSelecting) {
        return
      }

      return (_e: MouseEvent<HTMLElement>) => {
        /**
         * If the column is not the same as the anchor col,
         * we don't want to select the cell. Unless multiColumnSelection is true.
         */
        if (anchor?.col !== coords.col && !multiColumnSelection) {
          return
        }

        if (isSelecting) {
          setRangeEnd(coords)
        } else {
          setDragEnd(coords)
        }
      }
    },
    [
      anchor?.col,
      isDragging,
      isSelecting,
      setDragEnd,
      setRangeEnd,
      multiColumnSelection,
    ]
  )

  const getInputChangeHandler = useCallback(
    // Using `any` here as the generic type of Path<TFieldValues> will
    // not be inferred correctly.
    (field: any) => {
      return (next: any, prev: any) => {
        const command = new DataGridUpdateCommand({
          next,
          prev,
          setter: (value) => {
            setValue(field, value, {
              shouldDirty: true,
              shouldTouch: true,
            })
          },
        })

        execute(command)
      }
    },
    [setValue, execute]
  )

  const onDragToFillStart = useCallback(
    (_e: MouseEvent<HTMLElement>) => {
      setIsDragging(true)
    },
    [setIsDragging]
  )

  const getIsCellSelected = useCallback(
    (cell: DataGridCoordinates | null) => {
      if (!cell || !anchor || !rangeEnd) {
        return false
      }

      return matrix.getIsCellSelected(cell, anchor, rangeEnd)
    },
    [anchor, rangeEnd, matrix]
  )

  const getIsCellDragSelected = useCallback(
    (cell: DataGridCoordinates | null) => {
      if (!cell || !anchor || !dragEnd) {
        return false
      }

      return matrix.getIsCellSelected(cell, anchor, dragEnd)
    },
    [anchor, dragEnd, matrix]
  )

  return {
    getWrapperFocusHandler,
    getOverlayMouseDownHandler,
    getWrapperMouseOverHandler,
    getInputChangeHandler,
    getIsCellSelected,
    getIsCellDragSelected,
    onDragToFillStart,
  }
}
