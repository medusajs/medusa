import React from "react"
import clsx from "clsx"
import { ThemeImage, ThemeImageProps } from "@/components/ThemeImage"

export const InlineThemeImage = (props: ThemeImageProps) => {
  return (
    <ThemeImage
      {...props}
      width={20}
      height={20}
      className={clsx(props.className, "inline")}
    />
  )
}
