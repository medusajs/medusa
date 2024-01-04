import * as React from "react"
import type { IconProps } from "../types"
const DocumentText = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M16.25 11.846V9.692c0-.734-.296-1.438-.824-1.958a2.835 2.835 0 0 0-1.989-.81h-1.25a.945.945 0 0 1-.662-.271A.916.916 0 0 1 11.25 6V4.77c0-.735-.296-1.44-.824-1.959A2.835 2.835 0 0 0 8.437 2H6.875m0 10.461h6.25m-6.25 2.462H10M8.75 2H4.687a.93.93 0 0 0-.937.923v14.154c0 .51.42.923.938.923h10.625a.93.93 0 0 0 .937-.923V9.385c0-1.959-.79-3.837-2.197-5.222A7.56 7.56 0 0 0 8.75 2v0Z"
        />
      </svg>
    )
  }
)
DocumentText.displayName = "DocumentText"
export default DocumentText
