import * as React from "react"
import type { IconProps } from "../types"
const DocumentSeries = React.forwardRef<SVGSVGElement, IconProps>(
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
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4.389 11.5H3.5a1.777 1.777 0 0 1-1.778-1.778V2.611c0-.982.796-1.778 1.778-1.778h4.444c.983 0 1.778.796 1.778 1.778v.935"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4.389 12.389V5.278c0-.983.795-1.778 1.778-1.778h3.632c.235 0 .462.093.628.26l2.59 2.59c.168.168.26.393.26.629v5.41c0 .982-.795 1.777-1.777 1.777H6.167a1.777 1.777 0 0 1-1.778-1.777"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13.278 7.055H10.61a.89.89 0 0 1-.889-.888V3.5"
        />
      </svg>
    )
  }
)
DocumentSeries.displayName = "DocumentSeries"
export default DocumentSeries
