"use client"

import React from "react"
import { useColorMode } from "@/providers"

export type ThemeImageProps = {
  light: string
  dark?: string
  alt?: string
} & React.AllHTMLAttributes<HTMLImageElement>

export const ThemeImage = ({
  light,
  dark,
  alt = "",
  ...props
}: ThemeImageProps) => {
  const { colorMode } = useColorMode()

  return (
    <img
      alt={alt}
      src={colorMode === "light" ? light : dark || light}
      {...props}
    />
  )
}
