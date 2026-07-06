import * as React from "react"
import type { IconProps } from "../types"
const CardSparkle = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m7.5 4.61.819 2.071 2.07.819-2.07.818-.819 2.07-.819-2.07-2.07-.818 2.07-.819z"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11.278 1.056H3.722c-.982 0-1.778.796-1.778 1.777v9.334c0 .982.796 1.778 1.778 1.778h7.556c.982 0 1.778-.796 1.778-1.778V2.833c0-.981-.796-1.777-1.778-1.777"
        />
      </svg>
    )
  }
)
CardSparkle.displayName = "CardSparkle"
export default CardSparkle
