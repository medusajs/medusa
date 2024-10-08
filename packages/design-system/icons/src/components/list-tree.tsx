import * as React from "react"
import type { IconProps } from "../types"
const ListTree = React.forwardRef<SVGSVGElement, IconProps>(
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
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11.278 2.253H9.056a.89.89 0 0 0-.89.889v2.222c0 .49.399.889.89.889h2.222c.49 0 .889-.398.889-.89V3.143a.89.89 0 0 0-.89-.89M11.278 9.364H9.056a.89.89 0 0 0-.89.889v2.222c0 .49.399.889.89.889h2.222c.49 0 .889-.398.889-.89v-2.221a.89.89 0 0 0-.89-.89M5.944 4.475H4.167a1.334 1.334 0 0 1-1.334-1.333V.919"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M5.944 11.586H4.167a1.334 1.334 0 0 1-1.334-1.333V2.919"
        />
      </svg>
    )
  }
)
ListTree.displayName = "ListTree"
export default ListTree
