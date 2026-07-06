import * as React from "react"
import type { IconProps } from "../types"
const HouseStar = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M13.056 7.008v-1.29c0-.277-.13-.539-.351-.707L8.038 1.465a.89.89 0 0 0-1.076 0L2.296 5.01a.89.89 0 0 0-.352.708v6.448c0 .981.796 1.777 1.778 1.777H6.42"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="m10.903 8.708.892 1.808 1.997.29-1.445 1.408.341 1.989-1.785-.939-1.786.939.341-1.989-1.444-1.408 1.996-.29z"
        />
      </svg>
    )
  }
)
HouseStar.displayName = "HouseStar"
export default HouseStar
