import React from "react"
import clsx from "clsx"
import { Button, ButtonProps } from "@/components"

export type NavbarIconButtonProps = ButtonProps

export const NavbarIconButton = ({
  children,
  className,
  ...props
}: NavbarIconButtonProps) => {
  return (
    <Button
      className={clsx(
        "[&>svg]:h-[22px] [&>svg]:w-[22px] btn-secondary-icon",
        className
      )}
      variant="secondary"
      {...props}
    >
      {children}
    </Button>
  )
}
