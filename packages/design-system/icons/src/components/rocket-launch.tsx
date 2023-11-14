import * as React from "react"
import type { IconProps } from "../types"
const RocketLaunch = React.forwardRef<SVGSVGElement, IconProps>(
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
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12.784 11.838a4.653 4.653 0 0 1-4.53 5.725v-3.724m4.53-2a11.62 11.62 0 0 0 4.778-9.402 11.62 11.62 0 0 0-9.4 4.778m4.623 4.623a11.577 11.577 0 0 1-4.53 2.001m-.093-6.624a4.654 4.654 0 0 0-5.725 4.53h3.724m2.002-4.53a11.578 11.578 0 0 0-2.002 4.53m2.094 2.094c-.08.017-.16.032-.241.047a11.704 11.704 0 0 1-1.9-1.899l.047-.242M4.424 13.6a3.485 3.485 0 0 0-1.363 3.34 3.486 3.486 0 0 0 3.34-1.364m7.09-7.902a1.163 1.163 0 1 1-2.327 0 1.163 1.163 0 0 1 2.326 0Z"
        />
      </svg>
    )
  }
)
RocketLaunch.displayName = "RocketLaunch"
export default RocketLaunch
