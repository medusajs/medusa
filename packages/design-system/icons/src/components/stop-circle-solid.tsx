import * as React from "react"
import type { IconProps } from "../types"
const StopCircleSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          fill={color}
          fillRule="evenodd"
          d="M7.5.389c3.92 0 7.111 3.19 7.111 7.111s-3.19 7.111-7.111 7.111S.388 11.421.388 7.5 3.578.389 7.5.389M5.678 4.5c-.65 0-1.178.528-1.178 1.179V9.32c0 .651.528 1.179 1.178 1.179h3.643c.65 0 1.179-.528 1.179-1.179V5.68c0-.651-.528-1.179-1.179-1.179z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
StopCircleSolid.displayName = "StopCircleSolid"
export default StopCircleSolid
