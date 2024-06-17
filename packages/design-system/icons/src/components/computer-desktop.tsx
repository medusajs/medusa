import * as React from "react"
import type { IconProps } from "../types"
const ComputerDesktop = React.forwardRef<SVGSVGElement, IconProps>(
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
          strokeWidth={1.333}
          clipPath="url(#a)"
        >
          <path d="M4.611 13.944a9.6 9.6 0 0 1 5.778 0M7.5 11.278V13.5M12.167 1.944H2.833c-.982 0-1.777.796-1.777 1.778V9.5c0 .982.795 1.778 1.777 1.778h9.334c.982 0 1.777-.796 1.777-1.778V3.722c0-.982-.796-1.778-1.777-1.778" />
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
ComputerDesktop.displayName = "ComputerDesktop"
export default ComputerDesktop
