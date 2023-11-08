import * as React from "react"
import type { IconProps } from "../types"
const ReplaySolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M16.136 6.141c0-.866-.9-1.416-1.636-.998L7.708 9.002c-.763.432-.763 1.564 0 1.996l6.792 3.86c.735.417 1.635-.133 1.635-1V6.142h.001Z"
          clipRule="evenodd"
        />
        <rect width={2} height={10} x={3.864} y={5} fill={color} rx={1} />
      </svg>
    )
  }
)
ReplaySolid.displayName = "ReplaySolid"
export default ReplaySolid
