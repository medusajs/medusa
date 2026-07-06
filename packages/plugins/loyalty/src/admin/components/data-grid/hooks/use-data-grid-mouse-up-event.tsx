import { useCallback } from "react"
import { FieldValues, Path, PathValue } from "react-hook-form"
import { DataGridBulkUpdateCommand, DataGridMatrix } from "../models"
import { DataGridCoordinates } from "../types"

type UseDataGridMouseUpEventOptions<TData, TFieldValues extends FieldValues> = {
  matrix: DataGridMatrix<TData, TFieldValues>
  anchor: DataGridCoordinates | null
  dragEnd: DataGridCoordinates | null
  setDragEnd: (coords: DataGridCoordinates | null) => void
  setRangeEnd: (coords: DataGridCoordinates | null) => void
  setIsSelecting: (isSelecting: boolean) => void
  setIsDragging: (isDragging: boolean) => void
  getSelectionValues: (
    fields: string[]
  ) => PathValue<TFieldValues, Path<TFieldValues>>[]
  setSelectionValues: (
    fields: string[],
    values: PathValue<TFieldValues, Path<TFieldValues>>[]
  ) => void
  execute: (command: DataGridBulkUpdateCommand) => void
  isDragging: boolean
}

export const useDataGridMouseUpEvent = <
  TData,
  TFieldValues extends FieldValues
>({
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
}: UseDataGridMouseUpEventOptions<TData, TFieldValues>) => {
  const handleDragEnd = useCallback(() => {
    if (!isDragging) {
      return
    }

    if (!anchor || !dragEnd) {
      return
    }
    const dragSelection = matrix.getFieldsInSelection(anchor, dragEnd)
    const anchorField = matrix.getCellField(anchor)

    if (!anchorField || !dragSelection.length) {
      return
    }

    const anchorValue = getSelectionValues([anchorField])
    const fields = dragSelection.filter((field) => field !== anchorField)

    const prev = getSelectionValues(fields)
    const next = Array.from({ length: prev.length }, () => anchorValue[0])

    const command = new DataGridBulkUpdateCommand({
      fields,
      prev,
      next,
      setter: setSelectionValues,
    })

    execute(command)

    setIsDragging(false)
    setDragEnd(null)

    setRangeEnd(dragEnd)
  }, [
    isDragging,
    anchor,
    dragEnd,
    matrix,
    getSelectionValues,
    setSelectionValues,
    execute,
    setIsDragging,
    setDragEnd,
    setRangeEnd,
  ])

  const handleMouseUpEvent = useCallback(() => {
    handleDragEnd()
    setIsSelecting(false)
  }, [handleDragEnd, setIsSelecting])

  return {
    handleMouseUpEvent,
  }
}
