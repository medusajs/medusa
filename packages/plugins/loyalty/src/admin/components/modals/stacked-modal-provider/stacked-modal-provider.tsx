import { PropsWithChildren, useState } from "react"
import { StackedModalContext } from "./stacked-modal-context"

type StackedModalProviderProps = PropsWithChildren<{
  onOpenChange: (open: boolean) => void
}>

export const StackedModalProvider = ({
  children,
  onOpenChange,
}: StackedModalProviderProps) => {
  const [state, setState] = useState<Record<string, boolean>>({})

  const getIsOpen = (id: string) => {
    return state[id] || false
  }

  const setIsOpen = (id: string, open: boolean) => {
    setState((prevState) => ({
      ...prevState,
      [id]: open,
    }))

    onOpenChange(open)
  }

  const register = (id: string) => {
    setState((prevState) => ({
      ...prevState,
      [id]: false,
    }))
  }

  const unregister = (id: string) => {
    setState((prevState) => {
      const newState = { ...prevState }
      delete newState[id]
      return newState
    })
  }

  return (
    <StackedModalContext.Provider
      value={{
        getIsOpen,
        setIsOpen,
        register,
        unregister,
      }}
    >
      {children}
    </StackedModalContext.Provider>
  )
}
