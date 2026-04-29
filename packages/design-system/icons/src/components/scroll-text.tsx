import * as React from "react"
import type { IconProps } from "../types"
const ScrollText = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M12.611 13.5c.736 0 1.333-.597 1.333-1.333v-.89c0-.245-.199-.444-.444-.444H6.833c-.245 0-.444.2-.444.445v.889a1.334 1.334 0 0 1-2.667 0V2.833a1.334 1.334 0 0 0-2.666 0v1.778c0 .49.398.889.888.889h1.778M12.611 13.5H5.056"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M2.389 1.5h8.444c.736 0 1.334.597 1.334 1.333v5.778M6.167 4.611h3.555M6.167 7.278h3.555"
        />
      </svg>
    )
  }
)
ScrollText.displayName = "ScrollText"
export default ScrollText
