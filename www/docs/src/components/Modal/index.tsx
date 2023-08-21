import clsx from "clsx"
import React from "react"
import Button, { ButtonProps } from "../Button"
import IconXMark from "../../theme/Icon/XMark"

export type ModalProps = {
  className?: string
  title?: string
  actions?: ButtonProps[]
} & React.DetailedHTMLProps<
  React.DialogHTMLAttributes<HTMLDialogElement>,
  HTMLDialogElement
>

const Modal: React.FC<ModalProps> = ({
  className,
  title,
  actions,
  children,
  ...props
}) => {
  return (
    <dialog
      {...props}
      className={clsx(
        "absolute top-0 left-0 flex w-screen h-screen justify-center items-center",
        "",
        className
      )}
    >
      <div
        className={clsx(
          "bg-medusa-bg-base dark:bg-medusa-bg-base-dark rounded",
          "border-medusa-border-base dark:border-medusa-border-base-dark border border-solid",
          "shadow-modal dark:shadow-modal-dark",
          "w-[90%] md:w-[75%] lg:w-1/2"
        )}
      >
        <div
          className={clsx(
            "py-1.5 px-2 border-0 border-solid border-b border-medusa-border-base dark:border-medusa-border-base-dark",
            "flex justify-between items-center"
          )}
        >
          <span
            className={clsx(
              "text-h1 text-medusa-fg-base dark:text-medusa-fg-base-dark"
            )}
          >
            {title}
          </span>
          <IconXMark />
        </div>
        <div>{children}</div>
        {actions && actions?.length > 0 && (
          <div
            className={clsx(
              "pl-0 pr-2 px-1.5",
              "border-0 border-solid border-t border-medusa-border-base dark:border-medusa-border-base-dark",
              "flex justify-end gap-0.5"
            )}
          >
            {actions.map((action, index) => (
              <Button {...action} key={index} />
            ))}
          </div>
        )}
      </div>
    </dialog>
  )
}

export default Modal
