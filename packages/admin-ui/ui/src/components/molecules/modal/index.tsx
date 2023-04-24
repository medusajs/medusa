import * as Dialog from "@radix-ui/react-dialog"
import * as Portal from "@radix-ui/react-portal"
import clsx from "clsx"
import React, {
  forwardRef,
  ForwardRefExoticComponent,
  RefAttributes,
} from "react"
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

export type PointerDownOutsideEvent = CustomEvent<{
  originalEvent: PointerEvent
}>

export type ModalProps = {
  isLargeModal?: boolean
  handleClose: () => void
  open?: boolean
  className?: string
  children?: React.ReactNode
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void
}

type ModalChildProps = {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

type ModalHeaderProps = {
  handleClose: () => void
  className?: string
  children?: React.ReactNode
}

type ModalType = React.FC<ModalProps> & {
  Body: React.FC<ModalChildProps>
  Header: React.FC<ModalHeaderProps>
  Footer: React.FC<ModalChildProps>
  Content: ForwardRefExoticComponent<
    ModalChildProps & RefAttributes<HTMLDivElement>
  >
}

const Overlay: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <Dialog.Overlay className="fixed bg-grey-90/40 z-50 grid top-0 left-0 right-0 bottom-0 place-items-center overflow-y-auto">
      {children}
    </Dialog.Overlay>
  )
}

const Content: React.FC<
  React.PropsWithChildren<{
    className?: string
    onPointerDownOutside?: (event: PointerDownOutsideEvent) => void
  }>
> = ({ children, className, onPointerDownOutside }) => {
  const { isLargeModal } = React.useContext(ModalContext)
  const { height } = useWindowDimensions()
  const style = {
    maxHeight: height - 64,
  }
  return (
    <Dialog.Content
      style={style}
      className={clsx(
        "bg-grey-0 w-full rounded-rounded overflow-x-hidden",
        { ["max-w-3xl"]: isLargeModal, ["max-w-lg"]: !isLargeModal },
        className
      )}
      onPointerDownOutside={onPointerDownOutside}
    >
      {children}
    </Dialog.Content>
  )
}

const Modal: ModalType = ({
  open = true,
  handleClose,
  isLargeModal = true,
  className,
  children,
  onPointerDownOutside,
}) => {
  const portalRef = React.useRef(null)
  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Portal.Portal ref={portalRef}>
        <ModalContext.Provider value={{ portalRef, isLargeModal }}>
          <Overlay>
            <Content
              className={className}
              onPointerDownOutside={onPointerDownOutside}
            >
              {children}
            </Content>
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

Modal.Content = forwardRef<HTMLDivElement, ModalChildProps>(
  ({ children, className }, ref) => {
    const { isLargeModal } = React.useContext(ModalContext)

    const { height } = useWindowDimensions()
    const style = {
      maxHeight: height - 90 - 141,
    }
    return (
      <div
        ref={ref}
        style={style}
        className={clsx(
          "px-7 pt-5 overflow-y-auto w-full",
          {
            ["pb-7"]: isLargeModal,
            ["pb-5"]: !isLargeModal,
          },
          className
        )}
      >
        {children}
      </div>
    )
  }
)

Modal.Header = ({ handleClose = undefined, className, children }) => {
  return (
    <div
      className={clsx("px-7 pt-3.5", className)}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative w-full">
        <div className="pt-3.5">{children}</div>

        {handleClose && (
          <button
            onClick={handleClose}
            className="absolute -right-3.5 top-0 text-grey-50 cursor-pointer"
          >
            <CrossIcon className="w-5 h-5" />
          </button>
        )}
      </div>
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
