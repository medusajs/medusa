import get from "lodash/get"
import set from "lodash/set"
import { useCallback } from "react"
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form"

import { DataGridMatrix } from "../models"
import {
  DataGridColumnType,
  DataGridCoordinates,
  DataGridToggleableNumber,
} from "../types"

type UseDataGridFormHandlersOptions<TData, TFieldValues extends FieldValues> = {
  matrix: DataGridMatrix<TData, TFieldValues>
  form: UseFormReturn<TFieldValues>
  anchor: DataGridCoordinates | null
}

export const useDataGridFormHandlers = <
  TData,
  TFieldValues extends FieldValues
>({
  matrix,
  form,
  anchor,
}: UseDataGridFormHandlersOptions<TData, TFieldValues>) => {
  const { getValues, reset } = form

  const getSelectionValues = useCallback(
    (fields: string[]): PathValue<TFieldValues, Path<TFieldValues>>[] => {
      if (!fields.length) {
        return []
      }

      const allValues = getValues()

      return fields.map((field) => {
        return field.split(".").reduce((obj, key) => obj?.[key], allValues)
      }) as PathValue<TFieldValues, Path<TFieldValues>>[]
    },
    [getValues]
  )

  const setSelectionValues = useCallback(
    async (fields: string[], values: string[], isHistory?: boolean) => {
      if (!fields.length || !anchor) {
        return
      }

      const type = matrix.getCellType(anchor)
      if (!type) {
        return
      }

      const convertedValues = convertArrayToPrimitive(values, type)
      const currentValues = getValues()

      fields.forEach((field, index) => {
        if (!field) {
          return
        }

        const valueIndex = index % values.length
        const newValue = convertedValues[valueIndex]

        setValue(currentValues, field, newValue, type, isHistory)
      })

      reset(currentValues, {
        keepDirty: true,
        keepTouched: true,
        keepDefaultValues: true,
      })
    },
    [matrix, anchor, getValues, reset]
  )

  return {
    getSelectionValues,
    setSelectionValues,
  }
}

function convertToNumber(value: string | number): number {
  if (typeof value === "number") {
    return value
  }

  const converted = Number(value)

  if (isNaN(converted)) {
    throw new Error(`String "${value}" cannot be converted to number.`)
  }

  return converted
}

function convertToBoolean(value: string | boolean): boolean {
  if (typeof value === "boolean") {
    return value
  }

  if (typeof value === "undefined" || value === null) {
    return false
  }

  const lowerValue = value.toLowerCase()

  if (lowerValue === "true" || lowerValue === "false") {
    return lowerValue === "true"
  }

  throw new Error(`String "${value}" cannot be converted to boolean.`)
}

function covertToString(value: any): string {
  if (typeof value === "undefined" || value === null) {
    return ""
  }

  return String(value)
}

function convertToggleableNumber(value: any): {
  quantity: number
  checked: boolean
  disabledToggle: boolean
} {
  let obj = value

  if (typeof obj === "string") {
    try {
      obj = JSON.parse(obj)
    } catch (error) {
      throw new Error(`String "${value}" cannot be converted to object.`)
    }
  }

  return obj
}

function setValue<
  T extends DataGridToggleableNumber = DataGridToggleableNumber
>(
  currentValues: any,
  field: string,
  newValue: T,
  type: string,
  isHistory?: boolean
) {
  if (type !== "togglable-number") {
    set(currentValues, field, newValue)
    return
  }

  setValueToggleableNumber(currentValues, field, newValue, isHistory)
}

function setValueToggleableNumber(
  currentValues: any,
  field: string,
  newValue: DataGridToggleableNumber,
  isHistory?: boolean
) {
  const currentValue = get(currentValues, field)
  const { disabledToggle } = currentValue

  const normalizeQuantity = (value: number | string | null | undefined) => {
    if (disabledToggle && value === "") {
      return 0
    }
    return value
  }

  const determineChecked = (quantity: number | string | null | undefined) => {
    if (disabledToggle) {
      return true
    }
    return quantity !== "" && quantity != null
  }

  const quantity = normalizeQuantity(newValue.quantity)
  const checked = isHistory
    ? disabledToggle
      ? true
      : newValue.checked
    : determineChecked(quantity)

  set(currentValues, field, {
    ...currentValue,
    quantity,
    checked,
  })
}

export function convertArrayToPrimitive(
  values: any[],
  type: DataGridColumnType
): any[] {
  switch (type) {
    case "number":
      return values.map((v) => {
        if (v === "") {
          return v
        }

        if (v == null) {
          return ""
        }

        return convertToNumber(v)
      })
    case "togglable-number":
      return values.map(convertToggleableNumber)
    case "boolean":
      return values.map(convertToBoolean)
    case "text":
      return values.map(covertToString)
    default:
      throw new Error(`Unsupported target type "${type}".`)
  }
}
