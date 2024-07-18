import * as React from "react"
import type { IconProps } from "../types"
const GridList = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M8.611 2.834h4.445M8.611 5.5h4.445M8.611 9.5h4.445M8.611 12.167h4.445M5.056 1.944H2.833a.89.89 0 0 0-.889.89v2.221c0 .491.398.89.89.89h2.222c.49 0 .888-.399.888-.89V2.833a.89.89 0 0 0-.888-.889M5.056 9.056H2.833a.89.89 0 0 0-.889.889v2.222c0 .49.398.889.89.889h2.222c.49 0 .888-.398.888-.89V9.946a.89.89 0 0 0-.888-.89"
        />
      </svg>
    )
  }
)
GridList.displayName = "GridList"
export default GridList
