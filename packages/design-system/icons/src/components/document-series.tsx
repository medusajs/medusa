import * as React from "react"
import type { IconProps } from "../types"
const DocumentSeries = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M13.125 14.375v2.813c0 .517-.42.937-.938.937H4.063a.938.938 0 0 1-.938-.938V6.563c0-.517.42-.937.938-.937h1.562c.419 0 .837.034 1.25.103m6.25 8.647h2.813c.517 0 .937-.42.937-.938V9.375a7.502 7.502 0 0 0-7.5-7.5H7.812a.938.938 0 0 0-.937.938v2.915m6.25 8.647H7.812a.938.938 0 0 1-.937-.938V5.729m10 5.522V9.687a2.812 2.812 0 0 0-2.813-2.812h-1.25a.937.937 0 0 1-.937-.938v-1.25a2.811 2.811 0 0 0-2.813-2.812h-.937"
        />
      </svg>
    )
  }
)
DocumentSeries.displayName = "DocumentSeries"
export default DocumentSeries
