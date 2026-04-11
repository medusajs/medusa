import * as React from "react"
import type { IconProps } from "../types"
const CodeEditor = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={15}
        height={15}
        viewBox="0 0 15 15"
        fill="none"
        ref={ref}
        {...props}
      >
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M2.833 13.056h9.334c.982 0 1.777-.796 1.777-1.778V3.722c0-.982-.796-1.777-1.777-1.777H2.833c-.981 0-1.777.795-1.777 1.777v7.556c0 .982.796 1.778 1.777 1.778M4.167 1.944v11.111M9.056 8.611h2.666M7.722 6.39h2.445M7.722 10.834H9.5M6.389 4.167h1.333"
        />
      </svg>
    )
  }
)
CodeEditor.displayName = "CodeEditor"
export default CodeEditor
