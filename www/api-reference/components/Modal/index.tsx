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
} & React.DetailedHTMLProps<
  React.DialogHTMLAttributes<HTMLDialogElement>,
  HTMLDialogElement
>

const Modal: React.FC<ModalProps> = ({
  className,
  title,
  actions,
  children,
  contentClassName,
  ...props
}) => {
  const { closeModal } = useModal()
  const dialogRef = useRef<HTMLDialogElement>(null)

  const handleClick = (e: React.MouseEvent<HTMLDialogElement, MouseEvent>) => {
    // close modal when the user clicks outside the content
    if (e.target === dialogRef.current) {
      closeModal()
    }
  }

  return (
    <dialog
      {...props}
      className={clsx(
        "fixed top-0 left-0 flex h-screen w-screen items-center justify-center",
        "z-[500] bg-transparent",
        className
      )}
      onClick={handleClick}
      ref={dialogRef}
    >
      <div
        className={clsx(
          "bg-medusa-bg-base dark:bg-medusa-bg-base-dark rounded-sm",
          "border-medusa-border-base dark:border-medusa-border-base-dark border border-solid",
          "shadow-modal dark:shadow-modal-dark",
          "w-[90%] md:w-[75%] lg:w-[560px]"
        )}
      >
        <ModalHeader title={title} />
        <div
          className={clsx(
            "overflow-auto py-1.5 px-2 lg:min-h-[400px]",
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
