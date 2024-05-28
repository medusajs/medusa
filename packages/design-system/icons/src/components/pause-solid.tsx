import * as React from "react"
import type { IconProps } from "../types"
const PauseSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          fill={color}
          d="M4.167 1.278H2.833c-.859 0-1.555.696-1.555 1.555v9.334c0 .859.696 1.555 1.555 1.555h1.334c.859 0 1.555-.696 1.555-1.555V2.833c0-.859-.696-1.555-1.555-1.555M12.167 1.278h-1.334c-.859 0-1.555.696-1.555 1.555v9.334c0 .859.696 1.555 1.555 1.555h1.334c.859 0 1.555-.696 1.555-1.555V2.833c0-.859-.696-1.555-1.555-1.555"
        />
      </svg>
    )
  }
)
PauseSolid.displayName = "PauseSolid"
export default PauseSolid
