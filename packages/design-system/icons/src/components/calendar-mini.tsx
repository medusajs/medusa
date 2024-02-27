import * as React from "react"
import type { IconProps } from "../types"
const CalendarMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M6.5 4v1.5m7-1.5v1.5m-9.5 9V7a1.5 1.5 0 0 1 1.5-1.5h9A1.5 1.5 0 0 1 16 7v7.5m-12 0A1.5 1.5 0 0 0 5.5 16h9a1.5 1.5 0 0 0 1.5-1.5m-12 0v-5A1.5 1.5 0 0 1 5.5 8h9A1.5 1.5 0 0 1 16 9.5v5"
        />
        <path
          stroke={color}
          strokeWidth={0.75}
          d="M7.875 10.868a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM7.875 13.194a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM12.875 10.868a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM10.375 10.868a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM10.375 13.194a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
        />
      </svg>
    )
  }
)
CalendarMini.displayName = "CalendarMini"
export default CalendarMini
