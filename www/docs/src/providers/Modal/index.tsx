import React, { useContext, useState } from "react"
import { createContext } from "react"
import Modal, { ModalProps } from "../../components/Modal"

type ModalContextType = {
  modalProps: ModalProps | null
  setModalProps: (value: ModalProps | null) => void
}

const ModalContext = createContext<ModalContextType | null>(null)

type ModalProviderProps = {
  children?: React.ReactNode
}

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalProps, setModalProps] = useState<ModalProps | null>(null)

  const handleClose = () => {
    setModalProps(null)
  }

  return (
    <ModalContext.Provider
      value={{
        modalProps,
        setModalProps,
      }}
    >
      {children}
      {modalProps && <Modal {...modalProps} onClose={handleClose} />}
    </ModalContext.Provider>
  )
}

export default ModalProvider

export const useModal = () => {
  const context = useContext(ModalContext)

  if (!context) {
    throw new Error("useModal must be used within a ModalProvider")
  }

  return context
}
