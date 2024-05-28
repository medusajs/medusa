import * as React from "react"
import type { IconProps } from "../types"
const BuildingsSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g fill={color} clipPath="url(#a)">
          <path d="M1.945 14.611a.667.667 0 0 1-.667-.667V3.422c0-.626.372-1.189.95-1.432l4-1.693a1.55 1.55 0 0 1 1.464.136c.437.29.696.775.696 1.297v1.548a.667.667 0 0 1-1.333 0V1.73a.22.22 0 0 0-.1-.186.21.21 0 0 0-.21-.018l-4 1.691a.22.22 0 0 0-.135.205v10.523a.666.666 0 0 1-.665.666" />
          <path d="M13.945 13.278h-.223v-6.89c0-.857-.697-1.555-1.555-1.555h-4.89c-.857 0-1.555.698-1.555 1.556v6.889H1.056a.667.667 0 0 0 0 1.333h12.888a.667.667 0 0 0 0-1.333m-4.667-2a.667.667 0 0 1-1.334 0v-.445a.667.667 0 0 1 1.334 0zm0-2.667a.667.667 0 0 1-1.334 0v-.444a.667.667 0 0 1 1.334 0zm2.222 2.667a.667.667 0 0 1-1.333 0v-.445a.667.667 0 0 1 1.333 0zm0-2.667a.667.667 0 0 1-1.333 0v-.444a.667.667 0 0 1 1.333 0z" />
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h15v15H0z" />
          </clipPath>
        </defs>
      </svg>
    )
  }
)
BuildingsSolid.displayName = "BuildingsSolid"
export default BuildingsSolid
