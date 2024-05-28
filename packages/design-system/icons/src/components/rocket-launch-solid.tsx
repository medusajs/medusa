import * as React from "react"
import type { IconProps } from "../types"
const RocketLaunchSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M2.615 14.611h-1.56a.667.667 0 0 1-.666-.666v-1.56c0-.871.514-1.668 1.31-2.028a.666.666 0 1 1 .549 1.214.9.9 0 0 0-.526.815v.892h.893c.35 0 .669-.206.814-.525a.667.667 0 0 1 1.214.549 2.23 2.23 0 0 1-2.028 1.31" />
          <path d="M11.744 9.022c3.232-3.55 2.877-7.553 2.823-8.006a.67.67 0 0 0-.584-.584c-.455-.056-4.455-.41-8.006 2.823l-.9-.161a3.61 3.61 0 0 0-3.563 1.458L-.156 6.91a.667.667 0 0 0 .783 1.009c.012-.005.95-.348 2.343-.293-.15.39-.258.734-.335 1.013a.67.67 0 0 0 .172.648l2.908 2.908a.67.67 0 0 0 .647.172c.278-.077.622-.184 1.01-.336.052 1.383-.287 2.334-.29 2.344a.666.666 0 0 0 1.007.781l2.36-1.671a3.6 3.6 0 0 0 1.456-3.558l-.162-.903zM9.5 3.944a1.555 1.555 0 1 1 0 3.111 1.555 1.555 0 0 1 0-3.11M1.9 6.316l.703-.992a2.26 2.26 0 0 1 2.241-.917l.03.005a11.7 11.7 0 0 0-1.313 1.932 9.3 9.3 0 0 0-1.66-.029zm7.779 6.08-.995.704a9 9 0 0 0-.028-1.66c.614-.33 1.273-.767 1.931-1.313l.006.033a2.26 2.26 0 0 1-.915 2.236" />
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
RocketLaunchSolid.displayName = "RocketLaunchSolid"
export default RocketLaunchSolid
