import * as React from "react"
import type { IconProps } from "../types"
const ComputerDesktopSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g fill={color} clipPath="url(#a)">
          <path d="M10.59 13.309a10.3 10.3 0 0 0-2.423-.448v-1.583a.667.667 0 0 0-1.334 0v1.583c-.82.053-1.634.2-2.423.448a.666.666 0 1 0 .401 1.272 9 9 0 0 1 5.377 0q.1.03.2.031a.667.667 0 0 0 .2-1.302z" />
          <path d="M12.167 11.945H2.833A2.446 2.446 0 0 1 .39 9.5V3.722a2.446 2.446 0 0 1 2.444-2.444h9.334a2.446 2.446 0 0 1 2.444 2.444V9.5a2.446 2.446 0 0 1-2.444 2.444M2.833 2.61c-.612 0-1.11.499-1.11 1.111V9.5c0 .613.498 1.111 1.11 1.111h9.334c.612 0 1.11-.498 1.11-1.111V3.722c0-.612-.498-1.11-1.11-1.11z" />
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
ComputerDesktopSolid.displayName = "ComputerDesktopSolid"
export default ComputerDesktopSolid
