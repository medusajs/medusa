import * as React from "react"
import type { IconProps } from "../types"
const PlayMiniSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          fill={color}
          fillRule="evenodd"
          d="M5 5.768a1.25 1.25 0 0 1 1.853-1.095l7.693 4.232a1.25 1.25 0 0 1 0 2.19l-7.693 4.232a1.25 1.25 0 0 1-1.852-1.095L5 5.768Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
PlayMiniSolid.displayName = "PlayMiniSolid"
export default PlayMiniSolid
