import React from "react"
import { BadgeProps } from "@/components"
import { CardDefaultLayout } from "./Layout/Default"
import { IconProps } from "@medusajs/icons/dist/types"
import { CardLargeLayout } from "./Layout/Large"
import { CardFillerLayout } from "./Layout/Filler"
import { CardLayoutMini } from "./Layout/Mini"

export type CardProps = {
  type?: "default" | "large" | "filler" | "mini"
  icon?: React.FC<IconProps>
  image?: string
  themeImage?: {
    light: string
    dark: string
  }
  title?: string
  text?: string
  href?: string
  className?: string
  contentClassName?: string
  iconClassName?: string
  children?: React.ReactNode
  badge?: BadgeProps
}

export const Card = ({ type = "default", ...props }: CardProps) => {
  switch (type) {
    case "large":
      return <CardLargeLayout {...props} />
    case "filler":
      return <CardFillerLayout {...props} />
    case "mini":
      return <CardLayoutMini {...props} />
    default:
      return <CardDefaultLayout {...props} />
  }
}
