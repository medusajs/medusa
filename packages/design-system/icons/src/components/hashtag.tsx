import * as React from "react"
import type { IconProps } from "../types"
const Hashtag = React.forwardRef<SVGSVGElement, IconProps>(
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
          strokeWidth={1.333}
          d="M2.833 5.056h10.223M1.944 9.944h10.223M6.285 1.944 4.2 13.056M10.799 1.944 8.715 13.056"
        />
      </svg>
    )
  }
)
Hashtag.displayName = "Hashtag"
export default Hashtag
