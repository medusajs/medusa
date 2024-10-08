import * as React from "react"
import type { IconProps } from "../types"
const TimelineVertical = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          clipPath="url(#a)"
        >
          <path d="M2.389 1.056v4.888M2.389 13.944V9.056M13.056 1.5H7.278a.89.89 0 0 0-.89.889v2.667c0 .49.399.888.89.888h5.778c.49 0 .888-.398.888-.888V2.389a.89.89 0 0 0-.889-.889M2.389 9.055a1.556 1.556 0 1 0 0-3.11 1.556 1.556 0 0 0 0 3.11M13.056 9.056H7.278a.89.89 0 0 0-.89.888v2.667c0 .491.399.889.89.889h5.778c.49 0 .888-.398.888-.889V9.944a.89.89 0 0 0-.889-.888" />
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
TimelineVertical.displayName = "TimelineVertical"
export default TimelineVertical
