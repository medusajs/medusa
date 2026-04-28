import { RefObject, useCallback } from "react"
import { FieldValues, Path, PathValue } from "react-hook-form"

import { DataGridBulkUpdateCommand, DataGridMatrix } from "../models"
import { DataGridCoordinates } from "../types"

type UseDataGridClipboardEventsOptions<
  TData,
  TFieldValues extends FieldValues
> = {
  containerRef: RefObject<HTMLDivElement>
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
  containerRef,
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

      const container = containerRef.current
      if (e.defaultPrevented || !container) {
        return
      }

      const activeElement = document.activeElement
      if (activeElement && !container.contains(activeElement)) {
        return
      }

      const selection = window.getSelection()
      if (selection && !selection.isCollapsed) {
        const selectionInsideGrid =
          !!selection.anchorNode &&
          !!selection.focusNode &&
          container.contains(selection.anchorNode) &&
          container.contains(selection.focusNode)

        if (!selectionInsideGrid) {
          return
        }
      }

      e.preventDefault()

      const fields = matrix.getFieldsInSelection(anchor, rangeEnd)
      const values = getSelectionValues(fields)

      const text = values
        .map((value) => {
          if (typeof value === "object" && value !== null) {
            return JSON.stringify(value)
          }
          return value == null ? "" : `${value}`
        })
        .join("\t")

      e.clipboardData?.setData("text/plain", text)
    },
    [isEditing, anchor, rangeEnd, containerRef, matrix, getSelectionValues]
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
