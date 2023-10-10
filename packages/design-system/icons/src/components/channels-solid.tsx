import * as React from "react"
import type { IconProps } from "../types"
const ChannelsSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          fillRule="evenodd"
          d="M12.399 3.438a2.439 2.439 0 1 1 0 1.5h-1.243a.75.75 0 0 0-.75.75V9.25h1.993a2.439 2.439 0 1 1 0 1.5h-1.993v3.563c0 .414.335.75.75.75h1.243a2.439 2.439 0 1 1 0 1.5h-1.243a2.25 2.25 0 0 1-2.25-2.25V10.75H6.913a2.439 2.439 0 1 1 0-1.5h1.993V5.688a2.25 2.25 0 0 1 2.25-2.25h1.243Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
ChannelsSolid.displayName = "ChannelsSolid"
export default ChannelsSolid
