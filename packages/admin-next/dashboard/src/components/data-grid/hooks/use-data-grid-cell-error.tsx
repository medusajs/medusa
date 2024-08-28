import { CellContext } from "@tanstack/react-table"
import { useMemo } from "react"
import { FieldError, FieldErrors, get } from "react-hook-form"

import { useDataGridContext } from "../context"
import { DataGridCellContext, DataGridRowError } from "../types"

type UseDataGridCellErrorOptions<TData, TValue> = {
  context: CellContext<TData, TValue>
}

export const useDataGridCellError = <TextData, TValue>({
  context,
}: UseDataGridCellErrorOptions<TextData, TValue>) => {
  const { errors, getCellErrorMetadata, navigateToField } = useDataGridContext()

  const { rowIndex, columnIndex } = context as DataGridCellContext<
    TextData,
    TValue
  >

  const { accessor, field } = useMemo(() => {
    return getCellErrorMetadata({ row: rowIndex, col: columnIndex })
  }, [rowIndex, columnIndex, getCellErrorMetadata])

  const rowErrorsObject: FieldErrors | undefined =
    accessor && columnIndex === 0 ? get(errors, accessor) : undefined

  const rowErrors: DataGridRowError[] = []

  function collectErrors(
    errorObject: FieldErrors | FieldError | undefined,
    baseAccessor: string
  ) {
    if (!errorObject) {
      return
    }

    if (isFieldError(errorObject)) {
      // Handle a single FieldError directly
      const message = errorObject.message

      const to = () => navigateToField(baseAccessor)

      if (message) {
        rowErrors.push({ message, to })
      }
    } else {
      // Traverse nested objects
      Object.keys(errorObject).forEach((key) => {
        const nestedError = errorObject[key]
        const fieldAccessor = `${baseAccessor}.${key}`

        if (nestedError && typeof nestedError === "object") {
          collectErrors(nestedError, fieldAccessor)
        }
      })
    }
  }

  if (rowErrorsObject && accessor) {
    collectErrors(rowErrorsObject, accessor)
  }

  const cellError: FieldError | undefined = field
    ? get(errors, field)
    : undefined

  return {
    errors,
    rowErrors,
    cellError,
  }
}

function isFieldError(errors: FieldErrors | FieldError): errors is FieldError {
  return typeof errors === "object" && "message" in errors && "type" in errors
}
