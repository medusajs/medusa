"use client"

import * as React from "react"

import { Toast, ToastProvider, ToastViewport } from "@/components/toast"
import { useToast } from "@/hooks/use-toast"

const Toaster = () => {
  const { toasts } = useToast()

  return (
    <ToastProvider swipeDirection="right">
      {toasts.map(({ id, ...props }) => {
        return <Toast key={id} {...props} />
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

export { Toaster }
