import * as React from "react"
import type { IconProps } from "../types"
const CaretMinimizeDiagonal = React.forwardRef<SVGSVGElement, IconProps>(
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
          fill={color}
          d="M9.462 1.407a.885.885 0 0 0-.97-.192.89.89 0 0 0-.548.82v4.132c0 .49.4.888.89.888h4.129a.887.887 0 0 0 .628-1.517zM6.167 7.944h-4.13a.887.887 0 0 0-.628 1.517l4.13 4.13a.885.885 0 0 0 .968.193.89.89 0 0 0 .549-.822v-4.13a.89.89 0 0 0-.89-.888"
        />
      </svg>
    )
  }
)
CaretMinimizeDiagonal.displayName = "CaretMinimizeDiagonal"
export default CaretMinimizeDiagonal
