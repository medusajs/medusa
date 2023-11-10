import * as React from "react"
import type { IconProps } from "../types"
const TriangleRightMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          fill={color}
          fillRule="evenodd"
          d="M6.25 6.913c0-.693.75-1.133 1.363-.799l5.66 3.087a.908.908 0 0 1 0 1.598l-5.66 3.087c-.613.334-1.363-.106-1.363-.8V6.914Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
TriangleRightMini.displayName = "TriangleRightMini"
export default TriangleRightMini
