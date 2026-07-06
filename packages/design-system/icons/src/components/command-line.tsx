import * as React from "react"
import type { IconProps } from "../types"
const CommandLine = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M11.278 1.944H3.722c-.982 0-1.778.796-1.778 1.778v7.556c0 .981.796 1.777 1.778 1.777h7.556c.982 0 1.778-.796 1.778-1.777V3.722c0-.982-.796-1.778-1.778-1.778M8.167 10.389h2.222"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="m4.611 10.389 2.222-2.222-2.222-2.223"
        />
      </svg>
    )
  }
)
CommandLine.displayName = "CommandLine"
export default CommandLine
