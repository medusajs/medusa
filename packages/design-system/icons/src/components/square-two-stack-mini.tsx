import * as React from "react"
import type { IconProps } from "../types"
const SquareTwoStackMini = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={20}
        fill="none"
        ref={ref}
        {...props}
      >
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13.276 7.27V5.632a1.638 1.638 0 0 0-1.638-1.638H5.632a1.638 1.638 0 0 0-1.638 1.638v6.006a1.638 1.638 0 0 0 1.638 1.638H7.27m6.006-6.006h1.092a1.638 1.638 0 0 1 1.638 1.638v5.46a1.638 1.638 0 0 1-1.638 1.638h-5.46a1.638 1.638 0 0 1-1.638-1.638v-1.092m6.006-6.006H8.908A1.638 1.638 0 0 0 7.27 8.908v4.368"
        />
      </svg>
    )
  }
)
SquareTwoStackMini.displayName = "SquareTwoStackMini"
export default SquareTwoStackMini
