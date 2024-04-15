"use client"

import * as React from "react"

import { Toast, ToastProvider, ToastViewport } from "@/components/toast"
import { useToast } from "@/hooks/use-toast"
import { ToasterPosition } from "@/types"

type ToasterProps = {
  position?: ToasterPosition
}

const Toaster = ({ position = "bottom-right" }: ToasterProps) => {
  const { toasts } = useToast()

  return (
    <ToastProvider swipeDirection="right">
      {toasts.map(({ id, ...props }) => {
        return <Toast key={id} position={position} {...props} />
      })}
      <ToastViewport position={position} />
    </ToastProvider>
  )
}

export { Toaster }
