import * as React from "react"
import type { IconProps } from "../types"
const ChannelsSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g fill={color} clipPath="url(#a)">
          <path d="M11.056 11.278a.667.667 0 0 0-.667-.667H9.5a1.113 1.113 0 0 1-1.111-1.11v-4c0-.613.499-1.112 1.111-1.112h.889a.667.667 0 0 0 0-1.333H9.5A2.446 2.446 0 0 0 7.056 5.5v1.333H4.61a.667.667 0 0 0 0 1.334h2.445V9.5A2.446 2.446 0 0 0 9.5 11.945h.889a.667.667 0 0 0 .667-.667" />
          <path d="M9.944 3.722a2.222 2.222 0 1 0 4.445 0 2.222 2.222 0 0 0-4.445 0M9.944 11.278a2.222 2.222 0 1 0 4.445 0 2.222 2.222 0 0 0-4.445 0M.611 7.5a2.222 2.222 0 1 0 4.445 0 2.222 2.222 0 0 0-4.445 0" />
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h15v15H0z" />
          </clipPath>
        </defs>
      </svg>
    )
  }
)
ChannelsSolid.displayName = "ChannelsSolid"
export default ChannelsSolid
