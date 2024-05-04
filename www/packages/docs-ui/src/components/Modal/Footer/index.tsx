import React from "react"
import clsx from "clsx"
import { Button, ButtonProps } from "@/components"

export type ModalFooterProps = {
  actions?: ButtonProps[]
  children?: React.ReactNode
  className?: string
}

export const ModalFooter = ({
  actions,
  children,
  className,
}: ModalFooterProps) => {
  return (
    <div
      className={clsx(
        "py-docs_1.5 pl-0 pr-docs_2",
        "border-medusa-border-base border-0 border-t border-solid",
        "flex justify-end gap-docs_0.5",
        className
      )}
    >
      {actions?.map((action, index) => (
        <Button {...action} key={index} />
      ))}
      {children}
    </div>
  )
}
