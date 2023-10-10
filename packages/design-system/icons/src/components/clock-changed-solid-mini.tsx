import * as React from "react"
import type { IconProps } from "../types"
const ClockChangedSolidMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          fill={color}
          fillRule="evenodd"
          d="M4 10a6 6 0 1 1 12 0 6 6 0 0 1-12 0Zm5.542-.386a.75.75 0 0 1 .65-.13l3 .79a.75.75 0 0 1-.383 1.451l-2.059-.543V13.5a.75.75 0 0 1-1.5 0v-3.292a.75.75 0 0 1 .292-.594Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
ClockChangedSolidMini.displayName = "ClockChangedSolidMini"
export default ClockChangedSolidMini
