import React, { useCallback } from "react"
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormGetValues,
  UseFormSetValue,
} from "react-hook-form"
import {
  DataGridBulkUpdateCommand,
  DataGridMatrix,
  DataGridQueryTool,
  DataGridUpdateCommand,
} from "../models"
import { DataGridCoordinates } from "../types"

type UseDataGridKeydownEventOptions<TData, TFieldValues extends FieldValues> = {
  containerRef: React.RefObject<HTMLDivElement>
  matrix: DataGridMatrix<TData, TFieldValues>
  anchor: DataGridCoordinates | null
  rangeEnd: DataGridCoordinates | null
  isEditing: boolean
  scrollToCoordinates: (
    coords: DataGridCoordinates,
    direction: "horizontal" | "vertical" | "both"
  ) => void
  setTrapActive: (active: boolean) => void
  setSingleRange: (coordinates: DataGridCoordinates | null) => void
  setRangeEnd: (coordinates: DataGridCoordinates | null) => void
  onEditingChangeHandler: (value: boolean) => void
  getValues: UseFormGetValues<TFieldValues>
  setValue: UseFormSetValue<TFieldValues>
  execute: (command: DataGridUpdateCommand | DataGridBulkUpdateCommand) => void
  undo: () => void
  redo: () => void
  queryTool: DataGridQueryTool | null
  getSelectionValues: (
    fields: string[]
  ) => PathValue<TFieldValues, Path<TFieldValues>>[]
  setSelectionValues: (fields: string[], values: string[]) => void
  restoreSnapshot: () => void
  createSnapshot: (coords: DataGridCoordinates) => void
}

const ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]
const VERTICAL_KEYS = ["ArrowUp", "ArrowDown"]

export const useDataGridKeydownEvent = <
  TData,
  TFieldValues extends FieldValues
>({
  containerRef,
  matrix,
  anchor,
  rangeEnd,
  isEditing,
  setTrapActive,
  scrollToCoordinates,
  setSingleRange,
  setRangeEnd,
  onEditingChangeHandler,
  getValues,
  setValue,
  execute,
  undo,
  redo,
  queryTool,
  getSelectionValues,
  setSelectionValues,
  restoreSnapshot,
  createSnapshot,
}: UseDataGridKeydownEventOptions<TData, TFieldValues>) => {
  const handleKeyboardNavigation = useCallback(
    (e: KeyboardEvent) => {
      if (!anchor) {
        return
      }

      const type = matrix.getCellType(anchor)

      /**
       * If the user is currently editing a cell, we don't want to
       * handle the keyboard navigation.
       *
       * If the cell is of type boolean, we don't want to ignore the
       * keyboard navigation, as we want to allow the user to navigate
       * away from the cell directly, as you cannot "enter" a boolean cell.
       */
      if (isEditing && type !== "boolean") {
        return
      }

      const direction = VERTICAL_KEYS.includes(e.key)
        ? "vertical"
        : "horizontal"

      /**
       * If the user performs a horizontal navigation, we want to
       * use the anchor as the basis for the navigation.
       *
       * If the user performs a vertical navigation, the bases depends
       * on the type of interaction. If the user is holding shift, we want
       * to use the rangeEnd as the basis. If the user is not holding shift,
       * we want to use the anchor as the basis.
       */
      const basis =
        direction === "horizontal" ? anchor : e.shiftKey ? rangeEnd : anchor

      const updater =
        direction === "horizontal"
          ? setSingleRange
          : e.shiftKey
          ? setRangeEnd
          : setSingleRange

      if (!basis) {
        return
      }

      const { row, col } = basis

      const handleNavigation = (coords: DataGridCoordinates) => {
        e.preventDefault()
        e.stopPropagation()

        scrollToCoordinates(coords, direction)
        updater(coords)
      }

      const next = matrix.getValidMovement(
        row,
        col,
        e.key,
        e.metaKey || e.ctrlKey
      )

      handleNavigation(next)
    },
    [
      isEditing,
      anchor,
      rangeEnd,
      scrollToCoordinates,
      setSingleRange,
      setRangeEnd,
      matrix,
    ]
  )

  const handleTabKey = useCallback(
    (e: KeyboardEvent) => {
      if (!anchor) {
        return
      }

      e.preventDefault()
      e.stopPropagation()

      const { row, col } = anchor

      const key = e.shiftKey ? "ArrowLeft" : "ArrowRight"
      const direction = "horizontal"

      const next = matrix.getValidMovement(
        row,
        col,
        key,
        e.metaKey || e.ctrlKey
      )

      scrollToCoordinates(next, direction)
      setSingleRange(next)
    },
    [anchor, scrollToCoordinates, setSingleRange, matrix]
  )

  const handleUndo = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault()

      if (e.shiftKey) {
        redo()
        return
      }

      undo()
    },
    [redo, undo]
  )

  const handleSpaceKeyBoolean = useCallback(
    (anchor: DataGridCoordinates) => {
      const end = rangeEnd ?? anchor

      const fields = matrix.getFieldsInSelection(anchor, end)

      const prev = getSelectionValues(fields) as boolean[]

      const allChecked = prev.every((value) => value === true)
      const next = Array.from({ length: prev.length }, () => !allChecked)

      const command = new DataGridBulkUpdateCommand({
        fields,
        next,
        prev,
        setter: setSelectionValues,
      })

      execute(command)
    },
    [rangeEnd, matrix, getSelectionValues, setSelectionValues, execute]
  )

  const handleSpaceKeyTextOrNumber = useCallback(
    (anchor: DataGridCoordinates) => {
      const field = matrix.getCellField(anchor)
      const input = queryTool?.getInput(anchor)

      if (!field || !input) {
        return
      }

      createSnapshot(anchor)

      const current = getValues(field as Path<TFieldValues>)
      const next = ""

      const command = new DataGridUpdateCommand({
        next,
        prev: current,
        setter: (value) => {
          setValue(field as Path<TFieldValues>, value, {
            shouldDirty: true,
            shouldTouch: true,
          })
        },
      })

      execute(command)

      input.focus()
    },
    [matrix, queryTool, getValues, execute, setValue, createSnapshot]
  )

  const handleSpaceKeyTogglableNumber = useCallback(
    (anchor: DataGridCoordinates) => {
      const field = matrix.getCellField(anchor)
      const input = queryTool?.getInput(anchor)

      if (!field || !input) {
        return
      }

      createSnapshot(anchor)

      const current = getValues(field as Path<TFieldValues>)
      let checked = current.checked

      // If the toggle is not disabled, then we want to uncheck the toggle.
      if (!current.disabledToggle) {
        checked = false
      }

      const next = { ...current, quantity: "", checked }

      const command = new DataGridUpdateCommand({
        next,
        prev: current,
        setter: (value) => {
          setValue(field as Path<TFieldValues>, value, {
            shouldDirty: true,
            shouldTouch: true,
          })
        },
      })

      execute(command)

      input.focus()
    },
    [matrix, queryTool, getValues, execute, setValue, createSnapshot]
  )

  const handleSpaceKey = useCallback(
    (e: KeyboardEvent) => {
      if (!anchor || isEditing) {
        return
      }

      e.preventDefault()

      const type = matrix.getCellType(anchor)

      if (!type) {
        return
      }

      switch (type) {
        case "boolean":
          handleSpaceKeyBoolean(anchor)
          break
        case "togglable-number":
          handleSpaceKeyTogglableNumber(anchor)
          break
        case "number":
        case "text":
          handleSpaceKeyTextOrNumber(anchor)
          break
      }
    },
    [
      anchor,
      isEditing,
      matrix,
      handleSpaceKeyBoolean,
      handleSpaceKeyTextOrNumber,
      handleSpaceKeyTogglableNumber,
    ]
  )

  const handleMoveOnEnter = useCallback(
    (e: KeyboardEvent, anchor: DataGridCoordinates) => {
      const direction = e.shiftKey ? "ArrowUp" : "ArrowDown"

      const pos = matrix.getValidMovement(
        anchor.row,
        anchor.col,
        direction,
        false
      )

      if (anchor.row !== pos.row || anchor.col !== pos.col) {
        setSingleRange(pos)
        scrollToCoordinates(pos, "vertical")
      } else {
        // If the the user is at the last cell, we want to focus the container of the cell.
        const container = queryTool?.getContainer(anchor)

        container?.focus()
      }

      onEditingChangeHandler(false)
    },
    [
      queryTool,
      matrix,
      scrollToCoordinates,
      setSingleRange,
      onEditingChangeHandler,
    ]
  )

  const handleEditOnEnter = useCallback(
    (anchor: DataGridCoordinates) => {
      const input = queryTool?.getInput(anchor)

      if (!input) {
        return
      }

      input.focus()
      onEditingChangeHandler(true)
    },
    [queryTool, onEditingChangeHandler]
  )

  /**
   * Handles the enter key for text and number cells.
   *
   * The behavior is as follows:
   * - If the cell is currently not being edited, start editing the cell.
   * - If the cell is currently being edited, move to the next cell.
   */
  const handleEnterKeyTextOrNumber = useCallback(
    (e: KeyboardEvent, anchor: DataGridCoordinates) => {
      if (isEditing) {
        handleMoveOnEnter(e, anchor)
        return
      }

      handleEditOnEnter(anchor)
    },
    [handleMoveOnEnter, handleEditOnEnter, isEditing]
  )

  /**
   * Handles the enter key for boolean cells.
   *
   * The behavior is as follows:
   * - If the cell is currently undefined, set it to true.
   * - If the cell is currently a boolean, invert the value.
   * - After the value has been set, move to the next cell.
   */
  const handleEnterKeyBoolean = useCallback(
    (e: KeyboardEvent, anchor: DataGridCoordinates) => {
      const field = matrix.getCellField(anchor)

      if (!field) {
        return
      }

      const current = getValues(field as Path<TFieldValues>)
      let next: boolean

      if (typeof current === "boolean") {
        next = !current
      } else {
        next = true
      }

      const command = new DataGridUpdateCommand({
        next,
        prev: current,
        setter: (value) => {
          setValue(field as Path<TFieldValues>, value, {
            shouldDirty: true,
            shouldTouch: true,
          })
        },
      })

      execute(command)
      handleMoveOnEnter(e, anchor)
    },
    [execute, getValues, handleMoveOnEnter, matrix, setValue]
  )

  const handleEnterKey = useCallback(
    (e: KeyboardEvent) => {
      if (!anchor) {
        return
      }

      e.preventDefault()

      const type = matrix.getCellType(anchor)

      switch (type) {
        case "togglable-number":
        case "text":
        case "number":
          handleEnterKeyTextOrNumber(e, anchor)
          break
        case "boolean": {
          handleEnterKeyBoolean(e, anchor)
          break
        }
      }
    },
    [anchor, matrix, handleEnterKeyTextOrNumber, handleEnterKeyBoolean]
  )

  const handleDeleteKeyTogglableNumber = useCallback(
    (anchor: DataGridCoordinates, rangeEnd: DataGridCoordinates) => {
      const fields = matrix.getFieldsInSelection(anchor, rangeEnd)
      const prev = getSelectionValues(fields)

      const next = prev.map((value) => ({
        ...value,
        quantity: "",
        checked: value.disableToggle ? value.checked : false,
      }))

      const command = new DataGridBulkUpdateCommand({
        fields,
        next,
        prev,
        setter: setSelectionValues,
      })

      execute(command)
    },
    [matrix, getSelectionValues, setSelectionValues, execute]
  )

  const handleDeleteKeyTextOrNumber = useCallback(
    (anchor: DataGridCoordinates, rangeEnd: DataGridCoordinates) => {
      const fields = matrix.getFieldsInSelection(anchor, rangeEnd)
      const prev = getSelectionValues(fields)
      const next = Array.from({ length: prev.length }, () => "")

      const command = new DataGridBulkUpdateCommand({
        fields,
        next,
        prev,
        setter: setSelectionValues,
      })

      execute(command)
    },
    [matrix, getSelectionValues, setSelectionValues, execute]
  )

  const handleDeleteKeyBoolean = useCallback(
    (anchor: DataGridCoordinates, rangeEnd: DataGridCoordinates) => {
      const fields = matrix.getFieldsInSelection(anchor, rangeEnd)
      const prev = getSelectionValues(fields)
      const next = Array.from({ length: prev.length }, () => false)

      const command = new DataGridBulkUpdateCommand({
        fields,
        next,
        prev,
        setter: setSelectionValues,
      })

      execute(command)
    },
    [execute, getSelectionValues, matrix, setSelectionValues]
  )

  const handleDeleteKey = useCallback(
    (e: KeyboardEvent) => {
      if (!anchor || !rangeEnd || isEditing) {
        return
      }

      e.preventDefault()

      const type = matrix.getCellType(anchor)

      if (!type) {
        return
      }

      switch (type) {
        case "text":
        case "number":
          handleDeleteKeyTextOrNumber(anchor, rangeEnd)
          break
        case "boolean":
          handleDeleteKeyBoolean(anchor, rangeEnd)
          break
        case "togglable-number":
          handleDeleteKeyTogglableNumber(anchor, rangeEnd)
          break
      }
    },
    [
      anchor,
      rangeEnd,
      isEditing,
      matrix,
      handleDeleteKeyTextOrNumber,
      handleDeleteKeyBoolean,
      handleDeleteKeyTogglableNumber,
    ]
  )

  const handleEscapeKey = useCallback(
    (e: KeyboardEvent) => {
      if (!anchor || !isEditing) {
        return
      }

      e.preventDefault()
      e.stopPropagation()

      // try to restore the previous value
      restoreSnapshot()

      // Restore focus to the container element
      const container = queryTool?.getContainer(anchor)
      container?.focus()
    },
    [queryTool, isEditing, anchor, restoreSnapshot]
  )

  const handleSpecialFocusKeys = useCallback(
    (e: KeyboardEvent) => {
      if (!containerRef || isEditing) {
        return
      }

      const focusableElements = getFocusableElements(containerRef)

      const focusElement = (element: HTMLElement | null) => {
        if (element) {
          setTrapActive(false)
          element.focus()
        }
      }

      switch (e.key) {
        case ".":
          focusElement(focusableElements.cancel)
          break
        case ",":
          focusElement(focusableElements.shortcuts)
          break
        default:
          break
      }
    },
    [isEditing, setTrapActive, containerRef]
  )

  const handleKeyDownEvent = useCallback(
    (e: KeyboardEvent) => {
      if (ARROW_KEYS.includes(e.key)) {
        handleKeyboardNavigation(e)
        return
      }

      if (e.key === "z" && (e.metaKey || e.ctrlKey)) {
        handleUndo(e)
        return
      }

      if (e.key === " ") {
        handleSpaceKey(e)
        return
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        handleDeleteKey(e)
        return
      }

      if (e.key === "Enter") {
        handleEnterKey(e)
        return
      }

      if (e.key === "Escape") {
        handleEscapeKey(e)
        return
      }

      if (e.key === "Tab") {
        handleTabKey(e)
        return
      }
    },
    [
      handleEscapeKey,
      handleKeyboardNavigation,
      handleUndo,
      handleSpaceKey,
      handleEnterKey,
      handleDeleteKey,
      handleTabKey,
    ]
  )

  return {
    handleKeyDownEvent,
    handleSpecialFocusKeys,
  }
}

function getFocusableElements(ref: React.RefObject<HTMLDivElement>) {
  const focusableElements = Array.from(
    document.querySelectorAll<HTMLElement>(
      "[tabindex], a, button, input, select, textarea"
    )
  )

  const currentElementIndex = focusableElements.indexOf(ref.current!)

  const shortcuts =
    currentElementIndex > 0 ? focusableElements[currentElementIndex - 1] : null

  let cancel = null
  for (let i = currentElementIndex + 1; i < focusableElements.length; i++) {
    if (!ref.current!.contains(focusableElements[i])) {
      cancel = focusableElements[i]
      break
    }
  }

  return { shortcuts, cancel }
}
