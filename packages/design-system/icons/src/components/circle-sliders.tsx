import * as React from "react"
import type { IconProps } from "../types"
const CircleSliders = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M7.5 13.945a6.444 6.444 0 1 0 0-12.89 6.444 6.444 0 0 0 0 12.89M8.167 5.5h2.666M4.167 5.5h1.777M5.944 3.944v3.111M9.056 9.5h1.777M4.167 9.5h2.666M9.056 7.944v3.111"
        />
      </svg>
    )
  }
)
CircleSliders.displayName = "CircleSliders"
export default CircleSliders
