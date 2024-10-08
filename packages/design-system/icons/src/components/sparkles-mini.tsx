import * as React from "react"
import type { IconProps } from "../types"
const SparklesMini = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={15}
        height={15}
        fill="none"
        ref={ref}
        {...props}
      >
        <path
          stroke={color}
          strokeWidth={1.5}
          d="m3.584 2.926.119.355.355.119.253.084-.252.084-.356.119-.118.355-.085.255-.085-.255-.119-.355-.355-.119-.252-.084.252-.084.355-.119.119-.355.085-.254zM12.058 11.4l.253.084-.252.084-.355.119-.12.355-.084.255-.085-.255-.119-.355-.355-.119-.252-.084.252-.084.355-.119.119-.356.085-.253.084.253.119.356z"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="m4.833 7.262.819 2.07 2.07.819-2.07.818-.819 2.07-.818-2.07-2.07-.818 2.07-.82zM10.167 1.928l.818 2.07 2.07.82-2.07.818-.818 2.07-.819-2.07-2.07-.819L9.348 4z"
        />
      </svg>
    )
  }
)
SparklesMini.displayName = "SparklesMini"
export default SparklesMini
