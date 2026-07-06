import * as React from "react"
import type { IconProps } from "../types"
const Globe = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M7.5 13.945c1.473 0 2.667-2.886 2.667-6.445S8.973 1.056 7.5 1.056 4.833 3.94 4.833 7.5s1.194 6.445 2.667 6.445M1.056 7.5h12.888"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7.5 13.945a6.444 6.444 0 1 0 0-12.89 6.444 6.444 0 0 0 0 12.89"
        />
      </svg>
    )
  }
)
Globe.displayName = "Globe"
export default Globe
