import * as React from "react"
import type { IconProps } from "../types"
const GaugeSparkle = React.forwardRef<SVGSVGElement, IconProps>(
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
          fill={color}
          d="m14.391 1.74-.84-.28-.282-.842c-.09-.272-.541-.272-.632 0l-.28.842-.841.28a.334.334 0 0 0 0 .633l.84.28.281.842a.333.333 0 0 0 .631 0l.281-.842.841-.28a.334.334 0 0 0 .001-.633M4.141 10.898l-1.122-.374-.375-1.123c-.121-.362-.721-.362-.843 0l-.374 1.123-1.123.374a.444.444 0 0 0 0 .843l1.123.374.374 1.123a.446.446 0 0 0 .844 0l.375-1.123 1.122-.374a.445.445 0 0 0 0-.843M1.557 3.722a.667.667 0 1 0 0-1.334.667.667 0 0 0 0 1.334"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7.5 12.167a1.556 1.556 0 1 0-.001-3.112 1.556 1.556 0 0 0 0 3.112"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11.722 10.389h2.21c.004-.074.012-.148.012-.222A6.444 6.444 0 0 0 1.716 7.323M6.715 9.27 5.328 6.902"
        />
      </svg>
    )
  }
)
GaugeSparkle.displayName = "GaugeSparkle"
export default GaugeSparkle
