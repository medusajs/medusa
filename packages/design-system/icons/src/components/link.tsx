import * as React from "react"
import type { IconProps } from "../types"
const Link = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M7.056 5.568c-.313.15-.607.354-.865.614l-.01.009a3.14 3.14 0 0 0 0 4.444l1.934 1.933a3.14 3.14 0 0 0 4.445 0l.008-.008a3.14 3.14 0 0 0 0-4.445l-.827-.828"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7.944 9.432c.313-.15.607-.354.865-.614l.01-.009a3.14 3.14 0 0 0 0-4.444L6.884 2.432a3.14 3.14 0 0 0-4.445 0l-.008.009a3.14 3.14 0 0 0 0 4.444l.827.828"
        />
      </svg>
    )
  }
)
Link.displayName = "Link"
export default Link
