import * as React from "react"
import type { IconProps } from "../types"
const Newspaper = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M10 6.25h1.25M10 8.75h1.25M5 11.25h6.25M5 13.75h6.25m2.5-7.5h2.813c.517 0 .937.42.937.938V15a1.875 1.875 0 0 1-1.875 1.875M13.75 6.25V15a1.875 1.875 0 0 0 1.875 1.875M13.75 6.25V4.062a.938.938 0 0 0-.938-.937H3.438a.938.938 0 0 0-.938.938V15a1.875 1.875 0 0 0 1.875 1.875h11.25M5 6.25h2.5v2.5H5v-2.5Z"
        />
      </svg>
    )
  }
)
Newspaper.displayName = "Newspaper"
export default Newspaper
