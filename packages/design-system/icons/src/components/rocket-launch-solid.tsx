import * as React from "react"
import type { IconProps } from "../types"
const RocketLaunchSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M4.878 12.82a.712.712 0 0 1-.127.998 2.368 2.368 0 0 0-.884 2.314 2.37 2.37 0 0 0 2.315-.883.713.713 0 1 1 1.126.872 3.793 3.793 0 0 1-4.256 1.265.712.712 0 0 1-.438-.438 3.793 3.793 0 0 1 1.265-4.256.712.712 0 0 1 .999.127v.001Z"
          clipRule="evenodd"
        />
        <path
          fill={color}
          fillRule="evenodd"
          d="M5.966 11.9a12.409 12.409 0 0 0 2.135 2.134v3.8c0 .394.319.713.712.713a4.747 4.747 0 0 0 4.555-6.091 12.33 12.33 0 0 0 5.176-10.302.712.712 0 0 0-.698-.698A12.33 12.33 0 0 0 7.543 6.632a4.748 4.748 0 0 0-6.09 4.555c.001.393.32.712.714.712h3.8Zm6.883-2.85a1.9 1.9 0 1 0 0-3.798 1.9 1.9 0 0 0 0 3.798Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
RocketLaunchSolid.displayName = "RocketLaunchSolid"
export default RocketLaunchSolid
