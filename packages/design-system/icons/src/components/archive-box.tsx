import * as React from "react"
import type { IconProps } from "../types"
const ArchiveBox = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m16.875 6.25-.52 8.86a1.875 1.875 0 0 1-1.873 1.765H5.518a1.875 1.875 0 0 1-1.872-1.765l-.521-8.86m5.208 3.125h3.334M2.813 6.25h14.374c.518 0 .938-.42.938-.938v-1.25a.938.938 0 0 0-.938-.937H2.813a.938.938 0 0 0-.937.938v1.25c0 .517.42.937.938.937Z"
        />
      </svg>
    )
  }
)
ArchiveBox.displayName = "ArchiveBox"
export default ArchiveBox
