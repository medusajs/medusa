import * as React from "react"
import type { IconProps } from "../types"
const ArrowsPointingOutMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M9.056 1.944h4v4M13.056 1.944l-4 4M1.944 9.056v4h4M1.944 13.056l4-4"
        />
      </svg>
    )
  }
)
ArrowsPointingOutMini.displayName = "ArrowsPointingOutMini"
export default ArrowsPointingOutMini
