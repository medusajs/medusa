import * as React from "react"
import type { IconProps } from "../types"
const Levels = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M2.389 7.722V2.833M13.056 7.722V1.056M10.389 7.722V1.944M7.722 7.722v-3.11M5.056 7.722V1.056M1.056 11.722 2.61 9.944l1.556 1.778v1.333a.89.89 0 0 1-.89.89H1.945a.89.89 0 0 1-.888-.89zM10.833 11.722l1.556-1.778 1.555 1.778v1.333a.89.89 0 0 1-.888.89h-1.334a.89.89 0 0 1-.889-.89z"
        />
      </svg>
    )
  }
)
Levels.displayName = "Levels"
export default Levels
