import { createContext } from "react"

type ChildModalState = {
  getIsOpen: (id: string) => boolean
  setIsOpen: (id: string, open: boolean) => void
  registerChildModal: (id: string) => void
  unregisterChildModal: (id: string) => void
}

export const ChildModalContext = createContext<ChildModalState | null>(null)
