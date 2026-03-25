import { Medusa } from "@medusajs/icons"
import { IconProps } from "@medusajs/icons/dist/types"
import clsx from "clsx"
import React from "react"

type MedusaIconProps = IconProps & {
  variant?: "base" | "subtle" | "muted"
}

export const ColoredMedusaIcon = ({
  className,
  variant = "base",
  ...props
}: MedusaIconProps) => {
  return (
    <Medusa
      {...props}
      className={clsx(
        className,
        variant === "base" && "[&_path]:fill-medusa-fg-base",
        variant === "subtle" && "[&_path]:fill-medusa-fg-subtle",
        variant === "muted" && "[&_path]:fill-medusa-fg-muted"
      )}
    />
  )
}
