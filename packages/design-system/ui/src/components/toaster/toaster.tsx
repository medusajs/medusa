"use client"

import * as React from "react"
import { Toaster as Primitive } from "sonner"

interface ToasterProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof Primitive>,
    "richColors" | "closeButton" | "icons" | "theme"
  > {}

const Toaster = ({
  position = "bottom-right",
  gap = 12,
  ...props
}: ToasterProps) => {
  return <Primitive position={position} gap={gap} {...props} />
}

export { Toaster }
