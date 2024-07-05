import * as React from "react"
import type { IconProps } from "../types"
const Loader = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M10 6a.75.75 0 0 1-.75-.75v-2.5a.75.75 0 0 1 1.5 0v2.5A.75.75 0 0 1 10 6Z"
        />
        <path
          fill={color}
          d="M13.359 7.391a.75.75 0 0 1-.53-1.281l1.768-1.768a.75.75 0 1 1 1.061 1.061L13.89 7.171a.75.75 0 0 1-.531.22Z"
          opacity={0.88}
        />
        <path
          fill={color}
          d="M17.25 10.75h-2.5a.75.75 0 0 1 0-1.5h2.5a.75.75 0 0 1 0 1.5Z"
          opacity={0.75}
        />
        <path
          fill={color}
          d="M15.126 15.876a.744.744 0 0 1-.53-.22l-1.768-1.768a.75.75 0 1 1 1.061-1.061l1.768 1.768a.75.75 0 0 1-.531 1.28Z"
          opacity={0.63}
        />
        <path
          fill={color}
          d="M10 18a.75.75 0 0 1-.75-.75v-2.5a.75.75 0 0 1 1.5 0v2.5A.75.75 0 0 1 10 18Z"
          opacity={0.5}
        />
        <path
          fill={color}
          d="M4.874 15.876a.75.75 0 0 1-.53-1.281l1.768-1.768a.75.75 0 1 1 1.061 1.06l-1.768 1.769a.75.75 0 0 1-.531.22Z"
          opacity={0.38}
        />
        <path
          fill={color}
          d="M5.25 10.75h-2.5a.75.75 0 0 1 0-1.5h2.5a.75.75 0 0 1 0 1.5Z"
          opacity={0.25}
        />
        <path
          fill={color}
          d="M6.641 7.391a.744.744 0 0 1-.53-.22L4.343 5.403a.75.75 0 1 1 1.061-1.06L7.172 6.11a.75.75 0 0 1-.53 1.281h-.001Z"
          opacity={0.13}
        />
      </svg>
    )
  }
)
Loader.displayName = "Loader"
export default Loader
