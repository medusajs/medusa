"use client"

import * as React from "react"
import { createRoot } from "react-dom/client"
import { DialogProps } from "./dialog"

import Dialog from "./dialog"

type PromptProps = Omit<DialogProps, "onConfirm" | "onCancel" | "open">

const usePrompt = () => {
  const dialog = async (props: PromptProps): Promise<boolean> => {
    return new Promise((resolve) => {
      let open = true

      const onCancel = () => {
        open = false
        render()
        resolve(false)
      }

      const onConfirm = () => {
        open = false
        resolve(true)
        render()
      }

      const mountRoot = createRoot(document.createElement("div"))

      const render = () => {
        mountRoot.render(
          <Dialog
            open={open}
            onConfirm={onConfirm}
            onCancel={onCancel}
            {...props}
          />
        )
      }

      render()
    })
  }

  return dialog
}

export { usePrompt }
