import * as React from "react"
import type { IconProps } from "../types"
const Snooze = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M11.833 7.894h4.565l-4.153 5.007h4.422M5.833 12.8h3.825l-3.421 4.124h3.641-3.641M3.333 2.867h5.523l-5.11 6.16h5.396"
        />
      </svg>
    )
  }
)
Snooze.displayName = "Snooze"
export default Snooze
