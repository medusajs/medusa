import * as React from "react"
import type { IconProps } from "../types"
const QueueList = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M3.125 10h13.75m-13.75 3.125h13.75M3.125 16.25h13.75M4.687 3.75h10.625a1.563 1.563 0 0 1 0 3.125H4.688a1.562 1.562 0 1 1 0-3.125Z"
        />
      </svg>
    )
  }
)
QueueList.displayName = "QueueList"
export default QueueList
