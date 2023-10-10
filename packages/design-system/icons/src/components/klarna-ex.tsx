import * as React from "react"
import type { IconProps } from "../types"
const KlarnaEx = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM7.874 6.137H6.211v7.234h1.663V6.137Zm4.167 0h-1.64A4.159 4.159 0 0 1 8.723 9.49l-.641.476 2.492 3.397h2.045l-2.293-3.108a5.734 5.734 0 0 0 1.715-4.118Zm1.064 5.34A1.096 1.096 0 1 1 14.32 13.3a1.096 1.096 0 0 1-1.215-1.823Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
KlarnaEx.displayName = "KlarnaEx"
export default KlarnaEx
