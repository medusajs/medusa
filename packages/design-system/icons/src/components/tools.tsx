import * as React from "react"
import type { IconProps } from "../types"
const Tools = React.forwardRef<SVGSVGElement, IconProps>(
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
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="m9.525 12.598 4.782 4.783a2.175 2.175 0 0 0 3.076-3.076l-4.82-4.821m-3.038 3.114 2.047-2.485c.26-.315.607-.514.991-.629.451-.134.954-.154 1.43-.114a3.692 3.692 0 0 0 3.68-5.198L14.985 6.86a2.464 2.464 0 0 1-1.845-1.845l2.687-2.688a3.691 3.691 0 0 0-5.197 3.68c.074.883-.059 1.857-.742 2.42l-.084.07m-.28 4.101-3.818 4.637a2.09 2.09 0 1 1-2.942-2.941l5.609-4.618-3.37-3.37H3.849L2.002 3.23 3.232 2 6.31 3.846V5l3.495 3.495-1.432 1.179m6.858 5.552-2.154-2.153M4.15 15.843h.007v.006h-.007v-.006Z"
        />
      </svg>
    )
  }
)
Tools.displayName = "Tools"
export default Tools
