"use client"

import * as React from "react"
import { createRoot } from "react-dom/client"
import { RenderPrompt, RenderPromptProps } from "./render-prompt"

type UsePromptProps = Omit<RenderPromptProps, "onConfirm" | "onCancel" | "open">

const usePrompt = () => {
  const prompt = async (props: UsePromptProps): Promise<boolean> => {
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
          <RenderPrompt
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

  return prompt
}

export { usePrompt }
