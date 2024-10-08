"use client"

import * as React from "react"
import { createRoot } from "react-dom/client"
import { RenderPrompt, RenderPromptProps } from "./render-prompt"

type UsePromptProps = Omit<RenderPromptProps, "onConfirm" | "onCancel" | "open">

const usePrompt = () => {
  const prompt = async (props: UsePromptProps): Promise<boolean> => {
    return new Promise((resolve) => {
      let open = true

      const mountRoot = createRoot(document.createElement("div"))

      const onCancel = () => {
        open = false
        mountRoot.unmount()
        resolve(false)

        // TEMP FIX for Radix issue with dropdowns persisting pointer-events: none on body after closing
        document.body.style.pointerEvents = "auto"
      }

      const onConfirm = () => {
        open = false
        resolve(true)
        mountRoot.unmount()

        // TEMP FIX for Radix issue with dropdowns persisting pointer-events: none on body after closing
        document.body.style.pointerEvents = "auto"
      }

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
