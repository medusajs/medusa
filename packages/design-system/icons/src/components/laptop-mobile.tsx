import * as React from "react"
import type { IconProps } from "../types"
const LaptopMobile = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M13.944 12.611V7.722c0-.736-.597-1.333-1.333-1.333H10.39c-.736 0-1.333.597-1.333 1.333v4.89c0 .735.597 1.333 1.333 1.333h2.222c.736 0 1.333-.598 1.333-1.334M1.056 11.278h5.333M13.056 3.722c0-.982-.796-1.778-1.778-1.778H3.722c-.982 0-1.778.796-1.778 1.778v5.889c0 .92.746 1.667 1.667 1.667"
        />
      </svg>
    )
  }
)
LaptopMobile.displayName = "LaptopMobile"
export default LaptopMobile
