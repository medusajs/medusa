import * as React from "react"
import type { IconProps } from "../types"
const Mailbox = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M11.829 4.398a2.82 2.82 0 0 1 1.511 2.498v4.028c0 .444-.36.805-.805.805H6.493M4.48 4.077h4.832"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4.48 4.077a2.82 2.82 0 0 1 2.819 2.82v4.027c0 .444-.361.805-.806.805H2.465a.806.806 0 0 1-.805-.805V6.896a2.82 2.82 0 0 1 2.82-2.82M7.299 11.528v1.812M4.48 6.896v1.208"
        />
        <path
          fill={color}
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11.73.854H9.311v1.209h2.417z"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.313 5.285V1.86"
        />
      </svg>
    )
  }
)
Mailbox.displayName = "Mailbox"
export default Mailbox
