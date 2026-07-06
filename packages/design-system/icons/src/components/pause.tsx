import * as React from "react"
import type { IconProps } from "../types"
const Pause = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M4.167 1.944H2.833a.89.89 0 0 0-.889.89v9.333c0 .49.398.888.89.888h1.333c.49 0 .889-.397.889-.888V2.833a.89.89 0 0 0-.89-.889M12.167 1.944h-1.334a.89.89 0 0 0-.889.89v9.333c0 .49.398.888.89.888h1.333c.49 0 .889-.397.889-.888V2.833a.89.89 0 0 0-.89-.889"
        />
      </svg>
    )
  }
)
Pause.displayName = "Pause"
export default Pause
