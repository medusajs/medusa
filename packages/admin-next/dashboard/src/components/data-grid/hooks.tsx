import { CellContext } from "@tanstack/react-table"
import React, {
  MouseEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { FieldError, FieldErrors, get } from "react-hook-form"
import { DataGridContext } from "./context"
import { GridQueryTool } from "./models"
import {
  CellCoords,
  DataGridCellContext,
  DataGridCellRenderProps,
} from "./types"
import { isCellMatch, isFieldError } from "./utils"

const useDataGridContext = () => {
  const context = useContext(DataGridContext)

  if (!context) {
    throw new Error(
      "useDataGridContext must be used within a DataGridContextProvider"
    )
  }

  return context
}

type UseDataGridHookProps<TData, TValue> = {
  context: CellContext<TData, TValue>
}

export const useDataGridErrors = <TextData, TValue>({
  context,
}: UseDataGridHookProps<TextData, TValue>) => {
  const { errors, getCellErrorMetadata, handleGoToField } = useDataGridContext()

  const { rowIndex, columnIndex } = context as DataGridCellContext<
    TextData,
    TValue
  >

  const { accessor, field } = useMemo(() => {
    return getCellErrorMetadata({ row: rowIndex, col: columnIndex })
  }, [rowIndex, columnIndex, getCellErrorMetadata])

  const rowErrorsObject: FieldErrors | undefined =
    accessor && columnIndex === 0 ? get(errors, accessor) : undefined

  const rowErrors: { message: string; to: () => void }[] = []

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

      const to = () => handleGoToField(baseAccessor)

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
    handleGoToField,
  }
}

const textCharacterRegex = /^.$/u
const numberCharacterRegex = /^[0-9]$/u

export const useDataGridCell = <TData, TValue>({
  context,
}: UseDataGridHookProps<TData, TValue>) => {
  const {
    register,
    control,
    anchor,
    setIsEditing,
    setSingleRange,
    setIsSelecting,
    setRangeEnd,
    getWrapperFocusHandler,
    getWrapperMouseOverHandler,
    getInputChangeHandler,
    getIsCellSelected,
    getIsCellDragSelected,
    getCellMetadata,
  } = useDataGridContext()

  const { rowIndex, columnIndex } = context as DataGridCellContext<
    TData,
    TValue
  >

  const coords: CellCoords = useMemo(
    () => ({ row: rowIndex, col: columnIndex }),
    [rowIndex, columnIndex]
  )

  const { id, field, type, innerAttributes, inputAttributes } = useMemo(() => {
    return getCellMetadata(coords)
  }, [coords, getCellMetadata])

  const [showOverlay, setShowOverlay] = useState(true)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLElement>(null)

  const handleOverlayMouseDown = useCallback(
    (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (e.detail === 2) {
        if (inputRef.current) {
          setShowOverlay(false)

          inputRef.current.focus()

          return
        }
      }

      if (e.shiftKey) {
        // Only allow setting the rangeEnd if the column matches the anchor column.
        // If not we let the function continue and treat the click as if the shift key was not pressed.
        if (coords.col === anchor?.col) {
          setRangeEnd(coords)
          return
        }
      }

      if (containerRef.current) {
        setSingleRange(coords)
        setIsSelecting(true)
        containerRef.current.focus()
      }
    },
    [coords, anchor, setRangeEnd, setSingleRange, setIsSelecting]
  )

  const handleBooleanInnerMouseDown = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault()
      e.stopPropagation()

      if (e.detail === 2) {
        inputRef.current?.focus()
        return
      }

      if (e.shiftKey) {
        setRangeEnd(coords)
        return
      }

      if (containerRef.current) {
        setSingleRange(coords)
        setIsSelecting(true)
        containerRef.current.focus()
      }
    },
    [setIsSelecting, setSingleRange, setRangeEnd, coords]
  )

  const handleInputBlur = useCallback(() => {
    setShowOverlay(true)
    setIsEditing(false)
  }, [setIsEditing])

  const handleInputFocus = useCallback(() => {
    setShowOverlay(false)
    setIsEditing(true)
  }, [setIsEditing])

  const validateKeyStroke = useCallback(
    (key: string) => {
      if (type === "number") {
        return numberCharacterRegex.test(key)
      }

      if (type === "text") {
        return textCharacterRegex.test(key)
      }

      // KeyboardEvents should not be forwareded to other types of cells
      return false
    },
    [type]
  )

  const handleContainerKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!inputRef.current || !validateKeyStroke(e.key) || !showOverlay) {
        return
      }

      // Allow the user to undo/redo
      if (e.key.toLowerCase() === "z" && (e.ctrlKey || e.metaKey)) {
        return
      }

      // Allow the user to copy
      if (e.key.toLowerCase() === "c" && (e.ctrlKey || e.metaKey)) {
        return
      }

      // Allow the user to paste
      if (e.key.toLowerCase() === "v" && (e.ctrlKey || e.metaKey)) {
        return
      }

      const event = new KeyboardEvent(e.type, e.nativeEvent)

      inputRef.current.focus()
      setShowOverlay(false)

      // if the inputRef can use .select() then we can use it here
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select()
      }

      inputRef.current.dispatchEvent(event)
    },
    [showOverlay, validateKeyStroke]
  )

  const isAnchor = useMemo(() => {
    return anchor ? isCellMatch(coords, anchor) : false
  }, [anchor, coords])

  const fieldWithoutOverlay = useMemo(() => {
    return type === "boolean"
  }, [type])

  useEffect(() => {
    if (isAnchor && !containerRef.current?.contains(document.activeElement)) {
      containerRef.current?.focus()
    }
  }, [isAnchor])

  const renderProps: DataGridCellRenderProps = {
    container: {
      field,
      isAnchor,
      isSelected: getIsCellSelected(coords),
      isDragSelected: getIsCellDragSelected(coords),
      showOverlay: fieldWithoutOverlay ? false : showOverlay,
      innerProps: {
        ref: containerRef,
        onMouseOver: getWrapperMouseOverHandler(coords),
        onMouseDown:
          type === "boolean" ? handleBooleanInnerMouseDown : undefined,
        onKeyDown: handleContainerKeyDown,
        onFocus: getWrapperFocusHandler(coords),
        ...innerAttributes,
      },
      overlayProps: {
        onMouseDown: handleOverlayMouseDown,
      },
    },
    input: {
      ref: inputRef,
      onBlur: handleInputBlur,
      onFocus: handleInputFocus,
      onChange: getInputChangeHandler(field),
      ...inputAttributes,
    },
  }

  return {
    id,
    field,
    register,
    control,
    renderProps,
  }
}

export const useGridQueryTool = (
  containerRef: React.RefObject<HTMLElement>
) => {
  const queryToolRef = useRef<GridQueryTool | null>(null)

  useEffect(() => {
    if (containerRef.current) {
      queryToolRef.current = new GridQueryTool(containerRef.current)
    }
  }, [containerRef])

  return queryToolRef.current
}
