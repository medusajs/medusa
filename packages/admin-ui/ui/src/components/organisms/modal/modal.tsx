import * as Dialog from "@radix-ui/react-dialog"
import * as Portal from "@radix-ui/react-portal"
import clsx from "clsx"
import * as React from "react"
import { useWindowDimensions } from "../../../hooks"
import { CrossIcon } from "../../icons"

type ModalState = {
  portalRef?: React.RefObject<HTMLDivElement>
  isLargeModal?: boolean
}

const ModalContext = React.createContext<ModalState>({
  portalRef: undefined,
  isLargeModal: true,
})

export type ModalProps = React.PropsWithChildren<{
  isLargeModal?: boolean
  handleClose: () => void
  open?: boolean
}>

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
    <Dialog.Overlay className="bg-grey-90/40 fixed top-0 left-0 right-0 bottom-0 z-50 grid place-items-center overflow-y-auto">
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

export const Modal: ModalType = ({
  open = true,
  handleClose,
  isLargeModal = true,
  children,
}) => {
  const portalRef = React.useRef<HTMLDivElement>(null)
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
        "overflow-y-auto px-7 pt-5",
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
      className="flex w-full flex-col pl-7 pt-3.5 pr-3.5"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex w-full justify-end pb-1">
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
        "bottom-0 flex w-full px-7 pb-5",
        {
          "border-grey-20 border-t pt-4": isLargeModal,
        },
        className
      )}
    >
      {children}
    </div>
  )
}

export const useModal = () => {
  const context = React.useContext(ModalContext)

  if (!context) {
    throw new Error("useModal must be used within a Modal")
  }

  return context
}
