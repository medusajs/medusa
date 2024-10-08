import * as React from "react"
import type { IconProps } from "../types"
const ChevronUpMini = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={15}
        height={15}
        fill="none"
        ref={ref}
        {...props}
      >
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M1.944 9.722 7.5 4.167l5.556 5.555"
        />
      </svg>
    )
  }
)
ChevronUpMini.displayName = "ChevronUpMini"
export default ChevronUpMini
