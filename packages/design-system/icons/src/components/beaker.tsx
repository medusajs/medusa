import * as React from "react"
import type { IconProps } from "../types"
const Beaker = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={20}
        fill="none"
        ref={ref}
        {...props}
      >
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.25}
          d="M8.125 2.587v4.761a1.875 1.875 0 0 1-.55 1.326l-3.408 3.41m3.958-9.498c-.21.02-.418.042-.625.069m.625-.068a20.252 20.252 0 0 1 3.75 0m-7.708 9.496.641-.16A7.554 7.554 0 0 1 10 12.5a7.554 7.554 0 0 0 5.192.577l1.308-.327m-12.333-.667L2.332 13.92c-1.028 1.026-.543 2.764.889 3.008 2.203.377 4.468.573 6.779.573 2.272 0 4.54-.19 6.78-.573 1.43-.244 1.915-1.982.888-3.009L16.5 12.75M11.875 2.587v4.761c0 .498.197.975.55 1.326L16.5 12.75M11.875 2.587c.21.019.418.041.625.068"
        />
      </svg>
    )
  }
)
Beaker.displayName = "Beaker"
export default Beaker
