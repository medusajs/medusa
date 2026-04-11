import * as React from "react"
import type { IconProps } from "../types"
const DropCap = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M1.944 12.611h11.112M1.944 9.5h11.112M9.056 6.389h4M9.056 3.278h4M6.568 6.833 4.548 1.5h-.555L1.976 6.833M2.48 5.5h3.583"
        />
      </svg>
    )
  }
)
DropCap.displayName = "DropCap"
export default DropCap
