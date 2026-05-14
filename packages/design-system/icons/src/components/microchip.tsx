import * as React from "react"
import type { IconProps } from "../types"
const Microchip = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M10.389 2.833H4.61c-.982 0-1.778.796-1.778 1.778v5.778c0 .981.796 1.777 1.778 1.777h5.778c.982 0 1.778-.796 1.778-1.777V4.61c0-.982-.796-1.778-1.778-1.778"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M5.5 5.5v4h4v-4zM7.5 1.056v1.777M4.611 1.056v1.777M10.389 1.056v1.777M13.944 7.5h-1.777M13.944 4.61h-1.777M13.944 10.389h-1.777M7.5 13.944v-1.778M10.389 13.944v-1.778M4.611 13.944v-1.778M1.056 7.5h1.777M1.056 10.389h1.777M1.056 4.61h1.777"
        />
      </svg>
    )
  }
)
Microchip.displayName = "Microchip"
export default Microchip
