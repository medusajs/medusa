import { CellContext } from "@tanstack/react-table"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { useDataGridContext } from "../context"
import {
  DataGridCellContext,
  DataGridCellRenderProps,
  DataGridCoordinates,
} from "../types"
import { isCellMatch, isSpecialFocusKey } from "../utils"

type UseDataGridCellOptions<TData, TValue> = {
  context: CellContext<TData, TValue>
}

const textCharacterRegex = /^.$/u
const numberCharacterRegex = /^[0-9]$/u

export const useDataGridCell = <TData, TValue>({
  context,
}: UseDataGridCellOptions<TData, TValue>) => {
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

  const coords: DataGridCoordinates = useMemo(
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
    (e: React.MouseEvent) => {
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
      switch (type) {
        case "togglable-number":
        case "number":
          return numberCharacterRegex.test(key)
        case "text":
          return textCharacterRegex.test(key)
        default:
          // KeyboardEvents should not be forwareded to other types of cells
          return false
      }
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

      if (e.key === "Enter") {
        return
      }

      if (isSpecialFocusKey(e.nativeEvent)) {
        return
      }

      inputRef.current.focus()
      setShowOverlay(false)

      if (inputRef.current instanceof HTMLInputElement) {
        // Clear the current value
        inputRef.current.value = ""

        // Simulate typing the new key
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        )?.set
        nativeInputValueSetter?.call(inputRef.current, e.key)

        // Trigger input event to notify react-hook-form
        const event = new Event("input", { bubbles: true })
        inputRef.current.dispatchEvent(event)
      }

      // Prevent the original event from propagating
      e.stopPropagation()
      e.preventDefault()
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
