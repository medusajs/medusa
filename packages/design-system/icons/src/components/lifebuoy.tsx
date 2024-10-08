import * as React from "react"
import type { IconProps } from "../types"
const Lifebuoy = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M4.572 6.407c.315-.847.989-1.52 1.835-1.836M8.593 4.572c.847.316 1.52.989 1.836 1.836M10.428 8.593a3.14 3.14 0 0 1-1.836 1.836M6.407 10.428A3.14 3.14 0 0 1 4.57 8.593M5.387 13.162a6.06 6.06 0 0 1-3.55-3.55M13.162 9.613a6.06 6.06 0 0 1-3.55 3.55M9.613 1.838a6.06 6.06 0 0 1 3.55 3.55M1.838 5.387a6.06 6.06 0 0 1 3.55-3.55" />
          <path d="m8.592 4.572 1.166-3.124A6.5 6.5 0 0 0 7.5 1.042c-.795 0-1.556.144-2.259.406l1.166 3.124c.34-.127.707-.196 1.092-.196s.753.07 1.093.197zM10.428 8.592l3.124 1.166a6.5 6.5 0 0 0 .406-2.258c0-.795-.144-1.556-.406-2.26l-3.124 1.167c.127.34.196.707.196 1.092s-.07.753-.197 1.093zM6.408 10.428l-1.166 3.124a6.5 6.5 0 0 0 2.259.406c.795 0 1.556-.144 2.259-.406l-1.166-3.124c-.34.127-.707.196-1.092.196s-.753-.07-1.093-.197zM4.573 6.408 1.448 5.242A6.5 6.5 0 0 0 1.043 7.5c0 .795.143 1.556.405 2.26l3.125-1.167a3.1 3.1 0 0 1-.197-1.092c0-.385.07-.753.197-1.093z" />
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
Lifebuoy.displayName = "Lifebuoy"
export default Lifebuoy
