import * as React from "react"
import type { IconProps } from "../types"
const Button = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M13.542 7.43V4.793c0-.92-.746-1.667-1.667-1.667h-8.75c-.92 0-1.667.747-1.667 1.667v2.916c0 .92.746 1.667 1.667 1.667h3.067"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="m8.278 7.726 5.712 2.087a.27.27 0 0 1-.01.509l-2.614.836-.837 2.615a.27.27 0 0 1-.509.01L7.933 8.07a.27.27 0 0 1 .345-.345"
        />
      </svg>
    )
  }
)
Button.displayName = "Button"
export default Button
