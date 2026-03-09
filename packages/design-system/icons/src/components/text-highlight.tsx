import * as React from "react"
import type { IconProps } from "../types"
const TextHighlight = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M5.318 13.055h6.849M8.201 10.276 3.86 8.084a.888.888 0 0 1-.333-1.295L6.874 1.88a1.78 1.78 0 0 1 2.27-.586l1.384.699a1.78 1.78 0 0 1 .877 2.174L9.442 9.775a.89.89 0 0 1-1.24.5zM8.41 10.384a4.57 4.57 0 0 0-2.891 2.275l-.992-.5-.992-.501a4.57 4.57 0 0 0 .113-3.677"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="m5.518 12.659-.2.396H2.833l.702-1.398"
        />
      </svg>
    )
  }
)
TextHighlight.displayName = "TextHighlight"
export default TextHighlight
