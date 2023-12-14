import * as React from "react"
import type { IconProps } from "../types"
const ComputerDesktop = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={20}
        fill="none"
        ref={ref}
        {...props}
      >
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7.5 14.375v.84a2.5 2.5 0 0 1-.732 1.768l-.518.517h7.5l-.518-.517a2.5 2.5 0 0 1-.732-1.769v-.839m5-10V12.5a1.875 1.875 0 0 1-1.875 1.875H4.375A1.875 1.875 0 0 1 2.5 12.5V4.375m15 0A1.875 1.875 0 0 0 15.625 2.5H4.375A1.875 1.875 0 0 0 2.5 4.375m15 0V10a1.875 1.875 0 0 1-1.875 1.875H4.375A1.875 1.875 0 0 1 2.5 10V4.375"
        />
      </svg>
    )
  }
)
ComputerDesktop.displayName = "ComputerDesktop"
export default ComputerDesktop
