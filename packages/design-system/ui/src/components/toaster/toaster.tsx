"use client"

import * as React from "react"
import { Toaster as Primitive } from "sonner"

import { clx } from "@/utils/clx"

interface ToasterProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof Primitive>,
    | "richColors"
    | "closeButton"
    | "icons"
    | "theme"
    | "invert"
    | "loadingIcon"
    | "cn"
    | "toastOptions"
  > {}

const Toaster = ({
  position = "bottom-right",
  gap = 12,
  offset = 24,
  duration,
  ...props
}: ToasterProps) => {
  return (
    <Primitive
      position={position}
      gap={gap}
      offset={offset}
      cn={clx}
      toastOptions={{
        duration,
      }}
      {...props}
    />
  )
}

export { Toaster }
