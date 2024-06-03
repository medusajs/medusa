import * as React from "react"
import type { IconProps } from "../types"
const UserGroup = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M7.5 7.5a1.556 1.556 0 1 0 0-3.111 1.556 1.556 0 0 0 0 3.111M5.012 12.77c-.38-.115-.636-.494-.552-.883a3.112 3.112 0 0 1 6.08 0c.084.388-.17.768-.552.883a8.6 8.6 0 0 1-4.976 0M11.194 4.194a1.167 1.167 0 1 0 0-2.333 1.167 1.167 0 0 0 0 2.333M11.065 6.137q.064-.002.13-.003c1.3 0 2.394.892 2.7 2.098.102.397-.163.793-.558.908a7.7 7.7 0 0 1-1.869.299M3.806 4.194a1.167 1.167 0 1 0 0-2.333 1.167 1.167 0 0 0 0 2.333M3.935 6.137l-.13-.003a2.79 2.79 0 0 0-2.7 2.098c-.102.397.163.793.558.908a7.7 7.7 0 0 0 1.869.299" />
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
UserGroup.displayName = "UserGroup"
export default UserGroup
