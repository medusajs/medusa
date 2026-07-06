import * as React from "react"
import type { IconProps } from "../types"
const CaretMaximizeDiagonal = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M11.944 2.167h-4.13a.887.887 0 0 0-.628 1.517l4.13 4.13a.885.885 0 0 0 .969.192.89.89 0 0 0 .548-.821v-4.13a.89.89 0 0 0-.889-.888M3.684 7.185a.885.885 0 0 0-.969-.193.89.89 0 0 0-.548.822v4.13c0 .49.399.888.889.888h4.13a.887.887 0 0 0 .628-1.517z"
        />
      </svg>
    )
  }
)
CaretMaximizeDiagonal.displayName = "CaretMaximizeDiagonal"
export default CaretMaximizeDiagonal
