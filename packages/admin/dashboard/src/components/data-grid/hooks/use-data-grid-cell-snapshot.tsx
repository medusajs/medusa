import { useCallback, useState } from "react"
import { FieldValues, Path, UseFormReturn } from "react-hook-form"
import { DataGridMatrix } from "../models"
import { DataGridCellSnapshot, DataGridCoordinates } from "../types"

type UseDataGridCellSnapshotOptions<TData, TFieldValues extends FieldValues> = {
  matrix: DataGridMatrix<TData, TFieldValues>
  form: UseFormReturn<TFieldValues>
}

export const useDataGridCellSnapshot = <
  TData,
  TFieldValues extends FieldValues
>({
  matrix,
  form,
}: UseDataGridCellSnapshotOptions<TData, TFieldValues>) => {
  const [snapshot, setSnapshot] = useState<DataGridCellSnapshot<TFieldValues> | null>(
    null
  )

  const { getValues, setValue } = form

  /**
   * Creates a snapshot of the current cell value.
   */
  const createSnapshot = useCallback(
    (cell: DataGridCoordinates | null) => {
      if (!cell) {
        return null
      }

      const field = matrix.getCellField(cell)

      if (!field) {
        return null
      }

      const value = getValues(field as Path<TFieldValues>)

      setSnapshot({ field, value })
    },
    [getValues, matrix]
  )

  /**
   * Restores the cell value from the snapshot if it exists.
   */
  const restoreSnapshot = useCallback(() => {
    if (!snapshot) {
      return
    }

    const { field, value } = snapshot

    requestAnimationFrame(() => {
      setValue(field as Path<TFieldValues>, value)
    })
  }, [setValue, snapshot])

  return {
    createSnapshot,
    restoreSnapshot,
  }
}
