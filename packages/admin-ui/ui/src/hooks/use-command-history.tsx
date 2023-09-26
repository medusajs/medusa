import * as React from "react"

/**
 * Base interface for a command that can be managed
 * by the `useCommandHistory` hook.
 */
interface Command {
  execute: () => void
  undo: () => void
  redo: () => void
}

const useCommandHistory = (maxHistory = 20) => {
  const [past, setPast] = React.useState<Command[]>([])
  const [future, setFuture] = React.useState<Command[]>([])

  const canUndo = past.length > 0
  const canRedo = future.length > 0

  const undo = React.useCallback(() => {
    if (!canUndo) {
      return
    }

    const previous = past[past.length - 1]
    const newPast = past.slice(0, past.length - 1)

    previous.undo()

    setPast(newPast)
    setFuture([previous, ...future.slice(0, maxHistory - 1)])
  }, [canUndo, future, past, maxHistory])

  const redo = React.useCallback(() => {
    if (!canRedo) {
      return
    }

    const next = future[0]
    const newFuture = future.slice(1)

    next.redo()

    setPast([...past, next].slice(0, maxHistory - 1))
    setFuture(newFuture)
  }, [canRedo, future, past, maxHistory])

  const execute = React.useCallback(
    (command: Command) => {
      command.execute()
      setPast((past) => [...past, command].slice(0, maxHistory - 1))
      setFuture([])
    },
    [maxHistory]
  )

  return {
    undo,
    redo,
    execute,
    canUndo,
    canRedo,
  }
}

export { useCommandHistory, type Command }
