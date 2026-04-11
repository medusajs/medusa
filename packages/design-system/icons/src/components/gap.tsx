import * as React from "react"
import type { IconProps } from "../types"
const Gap = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M7.5 5.5v4M9.5 7.5h-4M1.5 4.611h1.778c.982 0 1.778-.795 1.778-1.778V1.5M13.5 4.611h-1.778a1.777 1.777 0 0 1-1.778-1.778V1.5M1.5 10.389h1.778c.982 0 1.778.795 1.778 1.777V13.5M13.5 10.389h-1.778c-.982 0-1.778.795-1.778 1.777V13.5"
        />
      </svg>
    )
  }
)
Gap.displayName = "Gap"
export default Gap
