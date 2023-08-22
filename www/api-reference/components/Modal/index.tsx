import clsx from "clsx"
import React, { useRef } from "react"
import { ButtonProps } from "../Button"
import { useModal } from "../../providers/modal"
import ModalHeader from "./Header"
import ModalFooter from "./Footer"

export type ModalProps = {
  className?: string
  title?: string
  actions?: ButtonProps[]
  contentClassName?: string
  onClose?: React.ReactEventHandler<HTMLDialogElement>
} & React.ComponentProps<"dialog">

const Modal = ({
  className,
  title,
  actions,
  children,
  contentClassName,
  onClose,
  ...props
}: ModalProps) => {
  const { closeModal } = useModal()
  const dialogRef = useRef<HTMLDialogElement>(null)

  const handleClick = (e: React.MouseEvent<HTMLDialogElement, MouseEvent>) => {
    // close modal when the user clicks outside the content
    if (e.target === dialogRef.current) {
      closeModal()
      onClose?.(e)
    }
  }

  const handleClose = (e: React.SyntheticEvent<HTMLDialogElement, Event>) => {
    onClose?.(e)
    closeModal()
  }

  return (
    <dialog
      {...props}
      className={clsx(
        "fixed top-0 left-0 flex h-screen w-screen items-center justify-center",
        "bg-medusa-bg-overlay dark:bg-medusa-bg-overlay-dark z-[500]",
        "hidden open:flex",
        className
      )}
      onClick={handleClick}
      ref={dialogRef}
      onClose={handleClose}
    >
      <div
        className={clsx(
          "bg-medusa-bg-base dark:bg-medusa-bg-base-dark rounded-sm",
          "border-medusa-border-base dark:border-medusa-border-base-dark border border-solid",
          "shadow-modal dark:shadow-modal-dark",
          "w-[90%] md:w-[75%] lg:w-[560px]"
        )}
      >
        {title && <ModalHeader title={title} />}
        <div
          className={clsx(
            "overflow-auto py-1.5 px-2 lg:max-h-[400px] lg:min-h-[400px]",
            contentClassName
          )}
        >
          {children}
        </div>
        {actions && actions?.length > 0 && <ModalFooter actions={actions} />}
      </div>
    </dialog>
  )
}

export default Modal
