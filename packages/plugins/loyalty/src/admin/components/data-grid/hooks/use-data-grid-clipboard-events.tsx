import { useCallback } from "react"
import { FieldValues, Path, PathValue } from "react-hook-form"

import { DataGridBulkUpdateCommand, DataGridMatrix } from "../models"
import { DataGridCoordinates } from "../types"

type UseDataGridClipboardEventsOptions<
  TData,
  TFieldValues extends FieldValues
> = {
  matrix: DataGridMatrix<TData, TFieldValues>
  isEditing: boolean
  anchor: DataGridCoordinates | null
  rangeEnd: DataGridCoordinates | null
  getSelectionValues: (
    fields: string[]
  ) => PathValue<TFieldValues, Path<TFieldValues>>[]
  setSelectionValues: (
    fields: string[],
    values: PathValue<TFieldValues, Path<TFieldValues>>[]
  ) => void
  execute: (command: DataGridBulkUpdateCommand) => void
}

export const useDataGridClipboardEvents = <
  TData,
  TFieldValues extends FieldValues
>({
  matrix,
  anchor,
  rangeEnd,
  isEditing,
  getSelectionValues,
  setSelectionValues,
  execute,
}: UseDataGridClipboardEventsOptions<TData, TFieldValues>) => {
  const handleCopyEvent = useCallback(
    (e: ClipboardEvent) => {
      if (isEditing || !anchor || !rangeEnd) {
        return
      }

      e.preventDefault()

      const fields = matrix.getFieldsInSelection(anchor, rangeEnd)
      const values = getSelectionValues(fields)

      const text = values
        .map((value) => {
          if (typeof value === "object" && value !== null) {
            return JSON.stringify(value)
          }
          return `${value}` ?? ""
        })
        .join("\t")

      e.clipboardData?.setData("text/plain", text)
    },
    [isEditing, anchor, rangeEnd, matrix, getSelectionValues]
  )

  const handlePasteEvent = useCallback(
    (e: ClipboardEvent) => {
      if (isEditing || !anchor || !rangeEnd) {
        return
      }

      e.preventDefault()

      const text = e.clipboardData?.getData("text/plain")

      if (!text) {
        return
      }

      const next = text.split("\t")

      const fields = matrix.getFieldsInSelection(anchor, rangeEnd)
      const prev = getSelectionValues(fields)

      const command = new DataGridBulkUpdateCommand({
        fields,
        next,
        prev,
        setter: setSelectionValues,
      })

      execute(command)
    },
    [
      isEditing,
      anchor,
      rangeEnd,
      matrix,
      getSelectionValues,
      setSelectionValues,
      execute,
    ]
  )

  return {
    handleCopyEvent,
    handlePasteEvent,
  }
}
