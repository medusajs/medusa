import * as React from "react"

import { clx } from "@/utils/clx"
import { inputBaseStyles } from "../input"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentPropsWithoutRef<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={clx(
        inputBaseStyles,
        "txt-medium min-h-[70px] w-full px-3 py-[7px]",
        className
      )}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
