"use client"

import { Tooltip } from "@/components/tooltip"
import { clx } from "@/utils/clx"
import { CheckCircleSolid, SquareTwoStack } from "@medusajs/icons"
import { Slot } from "@radix-ui/react-slot"
import copy from "copy-to-clipboard"
import React, { useState } from "react"

type CopyProps = React.HTMLAttributes<HTMLButtonElement> & {
  content: string
  asChild?: boolean
}

/**
 * This component is based on the `button` element and supports all of its props
 */
const Copy = React.forwardRef<
  HTMLButtonElement,
  CopyProps
>(({ 
    children, 
    className, 
    /**
     * The content to copy.
     */
    content, 
    /**
     * Whether to remove the wrapper `button` element and use the
     * passed child element instead.
     */
    asChild = false, 
    ...props
  }: CopyProps, ref) => {
  const [done, setDone] = useState(false)
  const [open, setOpen] = useState(false)
  const [text, setText] = useState("Copy")

  const copyToClipboard = () => {
    setDone(true)
    copy(content)

    setTimeout(() => {
      setDone(false)
    }, 2000)
  }

  React.useEffect(() => {
    if (done) {
      setText("Copied")
      return
    }

    setTimeout(() => {
      setText("Copy")
    }, 500)
  }, [done])

  const Component = asChild ? Slot : "button"

  return (
    <Tooltip content={text} open={done || open} onOpenChange={setOpen}>
      <Component
        ref={ref}
        aria-label="Copy code snippet"
        type="button"
        className={clx("text-ui-code-icon h-fit w-fit", className)}
        onClick={copyToClipboard}
        {...props}
      >
        {children ? children : done ? <CheckCircleSolid /> : <SquareTwoStack />}
      </Component>
    </Tooltip>
  )
})
Copy.displayName = "Copy"

export { Copy }
