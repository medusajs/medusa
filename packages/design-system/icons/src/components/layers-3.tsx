import * as React from "react"
import type { IconProps } from "../types"
const Layers3 = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m1.869 4.021 5.217-2.747a.89.89 0 0 1 .828 0l5.218 2.747c.475.25.475.93 0 1.18L7.914 7.948a.89.89 0 0 1-.828 0L1.869 5.202a.667.667 0 0 1 0-1.18"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13.488 7.5c0 .232-.12.465-.357.59l-5.218 2.748a.89.89 0 0 1-.828 0L1.867 8.09a.66.66 0 0 1-.356-.59"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13.488 10.39c0 .231-.12.464-.357.59l-5.218 2.747a.89.89 0 0 1-.828 0l-5.218-2.748a.66.66 0 0 1-.356-.59"
        />
      </svg>
    )
  }
)
Layers3.displayName = "Layers3"
export default Layers3
