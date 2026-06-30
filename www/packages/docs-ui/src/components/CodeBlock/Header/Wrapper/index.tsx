import clsx from "clsx"
import React, { useMemo } from "react"
import { useColorMode } from "../../../../providers/ColorMode"
import { CodeBlockStyle } from "../../../CodeBlock"

export type CodeBlockHeaderWrapperProps = {
  blockStyle?: CodeBlockStyle
  children: React.ReactNode
}

export const CodeBlockHeaderWrapper = React.forwardRef<
  HTMLDivElement,
  CodeBlockHeaderWrapperProps
>(function CodeBlockHeaderWrapper({ children, blockStyle = "loud" }, ref) {
  const { colorMode } = useColorMode()

  const bgColor = useMemo(
    () =>
      clsx(
        blockStyle === "loud" && "bg-medusa-contrast-bg-base",
        blockStyle === "subtle" && [
          colorMode === "light" && "bg-medusa-bg-component",
          colorMode === "dark" && "bg-medusa-code-bg-header",
        ]
      ),
    [blockStyle, colorMode]
  )

  return (
    <div
      className={clsx(
        "py-docs_0.5 px-docs_1 mb-0",
        "rounded-t-docs_lg relative flex justify-between items-center",
        bgColor
      )}
      ref={ref}
    >
      {children}
    </div>
  )
})
