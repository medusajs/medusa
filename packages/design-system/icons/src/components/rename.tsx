import * as React from "react"
import type { IconProps } from "../types"
const Rename = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M8.611 11.278 5.336 2.832h-.543l-3.275 8.445M2.38 9.056h5.369M11.722 2.833v9.333M9.944 1.056c.983 0 1.778.795 1.778 1.777"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13.5 1.056c-.982 0-1.778.795-1.778 1.777M9.944 13.944c.983 0 1.778-.795 1.778-1.778"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13.5 13.944a1.777 1.777 0 0 1-1.778-1.778M10.389 8.166h2.667"
        />
      </svg>
    )
  }
)
Rename.displayName = "Rename"
export default Rename
