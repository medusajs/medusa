import * as React from "react"
import type { IconProps } from "../types"
const SquareTwoStack = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M12.167 4.167H5.944c-.981 0-1.777.796-1.777 1.777v6.223c0 .982.796 1.777 1.777 1.777h6.223c.982 0 1.777-.796 1.777-1.777V5.944c0-.981-.796-1.777-1.777-1.777" />
          <path d="M1.99 10.165 1.075 4.01a1.78 1.78 0 0 1 1.497-2.02l6.155-.914a1.78 1.78 0 0 1 1.909 1.092" />
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
SquareTwoStack.displayName = "SquareTwoStack"
export default SquareTwoStack
