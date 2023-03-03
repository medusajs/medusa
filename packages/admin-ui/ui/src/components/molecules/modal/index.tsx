import * as Dialog from "@radix-ui/react-dialog"
import * as Portal from "@radix-ui/react-portal"
import clsx from "clsx"
import React from "react"
import { useWindowDimensions } from "../../../hooks/use-window-dimensions"
import CrossIcon from "../../fundamentals/icons/cross-icon"

type ModalState = {
  portalRef: any
  isLargeModal?: boolean
}

export const ModalContext = React.createContext<ModalState>({
  portalRef: undefined,
  isLargeModal: true,
})

export type ModalProps = {
  isLargeModal?: boolean
  handleClose: () => void
  open?: boolean
  children?: React.ReactNode
}

type ModalChildProps = {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

type ModalHeaderProps = {
  handleClose: () => void
  children?: React.ReactNode
}

type ModalType = React.FC<ModalProps> & {
  Body: React.FC<ModalChildProps>
  Header: React.FC<ModalHeaderProps>
  Footer: React.FC<ModalChildProps>
  Content: React.FC<ModalChildProps>
}

const Overlay: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Dialog.Overlay className="fixed bg-grey-90/40 z-50 grid top-0 left-0 right-0 bottom-0 place-items-center overflow-y-auto">
      {children}
    </Dialog.Overlay>
  )
}

const Content: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { height } = useWindowDimensions()
  const style = {
    maxHeight: height - 64,
  }
  return (
    <Dialog.Content
      style={style}
      className="bg-grey-0 min-w-modal rounded-rounded overflow-x-hidden"
    >
      {children}
    </Dialog.Content>
  )
}

const Modal: ModalType = ({
  open = true,
  handleClose,
  isLargeModal = true,
  children,
}) => {
  const portalRef = React.useRef(null)
  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Portal.Portal ref={portalRef}>
        <ModalContext.Provider value={{ portalRef, isLargeModal }}>
          <Overlay>
            <Content>{children}</Content>
          </Overlay>
        </ModalContext.Provider>
      </Portal.Portal>
    </Dialog.Root>
  )
}

Modal.Body = ({ children, className, style }) => {
  const { isLargeModal } = React.useContext(ModalContext)

  return (
    <div
      style={style}
      className={clsx("inter-base-regular h-full", className)}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  )
}

Modal.Content = ({ children, className }) => {
  const { isLargeModal } = React.useContext(ModalContext)

  const { height } = useWindowDimensions()
  const style = {
    maxHeight: height - 90 - 141,
  }
  return (
    <div
      style={style}
      className={clsx(
        "px-7 pt-5 overflow-y-auto",
        {
          ["w-largeModal pb-7"]: isLargeModal,
          ["pb-5"]: !isLargeModal,
        },
        className
      )}
    >
      {children}
    </div>
  )
}

Modal.Header = ({ handleClose = undefined, children }) => {
  return (
    <div
      className="pl-7 pt-3.5 pr-3.5 flex flex-col w-full"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="pb-1 flex w-full justify-end">
        {handleClose && (
          <button onClick={handleClose} className="text-grey-50 cursor-pointer">
            <CrossIcon size={20} />
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

Modal.Footer = ({ children, className }) => {
  const { isLargeModal } = React.useContext(ModalContext)

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={clsx(
        "px-7 bottom-0 pb-5 flex w-full",
        {
          "border-t border-grey-20 pt-4": isLargeModal,
        },
        className
      )}
    >
      {children}
    </div>
  )
}

export default Modal
