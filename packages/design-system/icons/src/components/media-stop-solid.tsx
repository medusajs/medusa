import * as React from "react"
import type { IconProps } from "../types"
const MediaStopSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          fill={color}
          d="M11.278 1.278H3.722a2.444 2.444 0 0 0-2.444 2.444v7.556a2.444 2.444 0 0 0 2.444 2.444h7.556a2.444 2.444 0 0 0 2.444-2.444V3.722a2.444 2.444 0 0 0-2.444-2.444"
        />
      </svg>
    )
  }
)
MediaStopSolid.displayName = "MediaStopSolid"
export default MediaStopSolid
