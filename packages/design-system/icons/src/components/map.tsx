import * as React from "react"
import type { IconProps } from "../types"
const Map = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M5.056 1.982v9.333M9.944 3.685v9.333M1.752 2.679 4.802 2a.9.9 0 0 1 .497.032l4.402 1.601c.159.058.331.07.497.032l2.665-.592a.888.888 0 0 1 1.081.868v7.513c0 .417-.29.778-.696.867l-3.05.679a.9.9 0 0 1-.497-.032l-4.402-1.601a.9.9 0 0 0-.497-.032l-2.665.592a.89.89 0 0 1-1.081-.868V3.546c0-.417.29-.778.696-.867" />
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
Map.displayName = "Map"
export default Map
