import React from "react"
import { IconProps } from "@medusajs/icons/dist/types"
import clsx from "clsx"

type InlineIconProps = IconProps & {
  Icon: React.ComponentType<IconProps>
  alt?: string
}

export const InlineIcon = ({ Icon, alt, ...props }: InlineIconProps) => {
  return (
    <Icon
      {...props}
      className={clsx("text-medusa-fg-subtle inline", props.className)}
      aria-label={alt}
    />
  )
}
