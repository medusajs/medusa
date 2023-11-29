import * as React from "react"
import type { IconProps } from "../types"
const SquaresPlusSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M2 4.25A2.25 2.25 0 0 1 4.25 2h2.5A2.25 2.25 0 0 1 9 4.25v2.5A2.25 2.25 0 0 1 6.75 9h-2.5A2.25 2.25 0 0 1 2 6.75v-2.5Zm0 9A2.25 2.25 0 0 1 4.25 11h2.5A2.25 2.25 0 0 1 9 13.25v2.5A2.25 2.25 0 0 1 6.75 18h-2.5A2.25 2.25 0 0 1 2 15.75v-2.5Zm9-9A2.25 2.25 0 0 1 13.25 2h2.5A2.25 2.25 0 0 1 18 4.25v2.5A2.25 2.25 0 0 1 15.75 9h-2.5A2.25 2.25 0 0 1 11 6.75v-2.5Zm4.25 7.5a.75.75 0 1 0-1.5 0v2h-2a.75.75 0 1 0 0 1.5h2v2a.75.75 0 1 0 1.5 0v-2h2a.75.75 0 1 0 0-1.5h-2v-2Z"
        />
      </svg>
    )
  }
)
SquaresPlusSolid.displayName = "SquaresPlusSolid"
export default SquaresPlusSolid
