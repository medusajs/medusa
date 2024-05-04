import * as React from "react"
import type { IconProps } from "../types"
const BuildingsMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M15.575 15.265V9.071a.62.62 0 0 0-.62-.62h-2.478"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4.425 15.265v-9.91a.62.62 0 0 1 .62-.62h6.813a.62.62 0 0 1 .62.62v9.91M6.748 7.353h3.406M6.748 10h3.406"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M6.748 15.265h3.407v-2.667H6.748v2.667ZM16.194 15.265H3.806"
        />
      </svg>
    )
  }
)
BuildingsMini.displayName = "BuildingsMini"
export default BuildingsMini
