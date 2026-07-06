import * as React from "react"
import type { IconProps } from "../types"
const GridLayout = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M12.167 1.944H2.833a.89.89 0 0 0-.889.89v1.333c0 .49.398.888.89.888h9.333c.49 0 .889-.398.889-.888V2.833a.89.89 0 0 0-.89-.889M5.5 7.722H2.833a.89.89 0 0 0-.889.89v3.555c0 .49.398.889.89.889H5.5c.49 0 .889-.398.889-.89V8.612a.89.89 0 0 0-.889-.889M9.056 7.722h4M9.056 10.39h4M9.056 13.056h4"
        />
      </svg>
    )
  }
)
GridLayout.displayName = "GridLayout"
export default GridLayout
