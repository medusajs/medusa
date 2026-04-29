import * as React from "react"
import type { IconProps } from "../types"
const Collapse = React.forwardRef<SVGSVGElement, IconProps>(
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
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="m10 12 2-2 2 2M14 3l-2 2-2-2M1 12h6M1 3h6M1 7.5h6"
        />
      </svg>
    )
  }
)
Collapse.displayName = "Collapse"
export default Collapse
