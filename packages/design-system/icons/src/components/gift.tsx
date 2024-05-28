import * as React from "react"
import type { IconProps } from "../types"
const Gift = React.forwardRef<SVGSVGElement, IconProps>(
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
          strokeWidth={1.5}
          clipPath="url(#a)"
        >
          <path d="M7.5 4.167v9.777M2.833 2.611c0-.859.697-1.555 1.556-1.555 2.301 0 3.111 3.11 3.111 3.11H4.389a1.556 1.556 0 0 1-1.556-1.555M10.611 4.167H7.5s.81-3.111 3.111-3.111a1.556 1.556 0 0 1 0 3.11M12.167 6.833v5.334c0 .982-.796 1.777-1.778 1.777H4.61a1.777 1.777 0 0 1-1.778-1.777V6.833" />
          <path d="M13.056 4.167H1.944a.89.89 0 0 0-.888.889v.888c0 .491.398.89.888.89h11.112a.89.89 0 0 0 .888-.89v-.888a.89.89 0 0 0-.889-.89" />
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
Gift.displayName = "Gift"
export default Gift
