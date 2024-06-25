import { PropsWithChildren, useState } from "react"
import { ChildModalContext } from "./child-modal-context"

type ChildModalProviderProps = PropsWithChildren<{
  setChildModalIsOpen: (open: boolean) => void
}>

export const ChildModalProvider = ({
  children,
  setChildModalIsOpen,
}: ChildModalProviderProps) => {
  const [state, setState] = useState<Record<string, boolean>>({})

  const getIsOpen = (id: string) => {
    return state[id] || false
  }

  const setIsOpen = (id: string, open: boolean) => {
    setState((prevState) => ({
      ...prevState,
      [id]: open,
    }))

    setChildModalIsOpen(open)
  }

  const registerChildModal = (id: string) => {
    setState((prevState) => ({
      ...prevState,
      [id]: false,
    }))
  }

  const unregisterChildModal = (id: string) => {
    setState((prevState) => {
      const newState = { ...prevState }
      delete newState[id]
      return newState
    })
  }

  return (
    <ChildModalContext.Provider
      value={{
        getIsOpen,
        setIsOpen,
        registerChildModal,
        unregisterChildModal,
      }}
    >
      {children}
    </ChildModalContext.Provider>
  )
}
