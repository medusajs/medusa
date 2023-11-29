import * as React from "react"
import type { IconProps } from "../types"
const DocumentTextSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M4.915 1.625c-.826 0-1.495.67-1.495 1.496v13.758c0 .826.67 1.496 1.495 1.496h10.17c.825 0 1.495-.67 1.495-1.495v-6.282a2.99 2.99 0 0 0-2.99-2.99h-1.496a1.495 1.495 0 0 1-1.496-1.496V4.616a2.991 2.991 0 0 0-2.99-2.991H4.914Zm1.496 10.768a.598.598 0 0 1 .598-.598h5.982a.598.598 0 0 1 0 1.196H7.01a.599.599 0 0 1-.598-.598Zm.598 1.794a.598.598 0 1 0 0 1.197H10a.598.598 0 1 0 0-1.197H7.009Z"
          clipRule="evenodd"
        />
        <path
          fill={color}
          d="M10.774 1.877a4.171 4.171 0 0 1 1.02 2.74v1.495a.3.3 0 0 0 .3.299h1.495a4.172 4.172 0 0 1 2.74 1.02 7.792 7.792 0 0 0-5.555-5.554Z"
        />
      </svg>
    )
  }
)
DocumentTextSolid.displayName = "DocumentTextSolid"
export default DocumentTextSolid
