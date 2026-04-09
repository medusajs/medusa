import * as React from "react"
import type { IconProps } from "../types"
const Reduce = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M5.5 1.944v1.778c0 .982-.796 1.778-1.778 1.778H1.944M13.056 5.5h-1.778A1.777 1.777 0 0 1 9.5 3.722V1.944M9.5 13.056v-1.778c0-.982.796-1.778 1.778-1.778h1.778M1.944 9.5h1.778c.982 0 1.778.796 1.778 1.778v1.778"
        />
      </svg>
    )
  }
)
Reduce.displayName = "Reduce"
export default Reduce
