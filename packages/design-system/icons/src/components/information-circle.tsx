import * as React from "react"
import type { IconProps } from "../types"
const InformationCircle = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g stroke={color} strokeWidth={1.5} clipPath="url(#a)">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m6.829 6.784.037-.018a.671.671 0 0 1 .95.763l-.633 2.537a.67.67 0 0 0 .951.763l.037-.018M7.5 4.1h.007v.007H7.5z"
          />
          <circle cx={7.5} cy={7.5} r={6.36} />
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
InformationCircle.displayName = "InformationCircle"
export default InformationCircle
