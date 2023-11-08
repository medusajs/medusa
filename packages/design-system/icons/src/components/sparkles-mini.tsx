import * as React from "react"
import type { IconProps } from "../types"
const SparklesMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M8.542 12.603 8 14.5l-.542-1.897a3 3 0 0 0-2.06-2.06L3.5 10l1.897-.542a3 3 0 0 0 2.06-2.06L8 5.5l.542 1.897a3 3 0 0 0 2.06 2.06L12.5 10l-1.897.542a3 3 0 0 0-2.06 2.06h-.001Zm5.63-4.793L14 8.5l-.173-.69a2.25 2.25 0 0 0-1.636-1.637L11.5 6l.69-.173a2.25 2.25 0 0 0 1.637-1.637L14 3.5l.173.69a2.25 2.25 0 0 0 1.637 1.637L16.5 6l-.69.173a2.25 2.25 0 0 0-1.637 1.637Zm-.91 7.901L13 16.5l-.263-.789a1.5 1.5 0 0 0-.948-.948L11 14.5l.789-.263a1.5 1.5 0 0 0 .948-.948L13 12.5l.263.789a1.5 1.5 0 0 0 .948.948L15 14.5l-.789.263a1.5 1.5 0 0 0-.948.948Z"
        />
      </svg>
    )
  }
)
SparklesMini.displayName = "SparklesMini"
export default SparklesMini
