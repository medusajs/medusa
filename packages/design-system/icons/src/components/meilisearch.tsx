import * as React from "react"
import type { IconProps } from "../types"
const Meilisearch = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={20}
        viewBox="0 0 20 20"
        fill="none"
        ref={ref}
        {...props}
      >
        <path fill="#FF4E62" d="M0 0h20v20H0z" />
        <path fill="url(#a)" fillOpacity={0.2} d="M0 0h20v20H0z" />
        <path
          fill="#fff"
          d="m3 14.082 2.587-6.619a2.43 2.43 0 0 1 2.264-1.546H9.41l-2.588 6.62a2.43 2.43 0 0 1-2.264 1.545zM6.795 14.082l2.587-6.619a2.435 2.435 0 0 1 2.267-1.546h1.558l-2.587 6.62a2.43 2.43 0 0 1-2.264 1.545H6.795M10.59 14.082l2.588-6.619a2.43 2.43 0 0 1 2.264-1.546H17l-2.587 6.62a2.43 2.43 0 0 1-2.264 1.545z"
        />
        <defs>
          <linearGradient
            id="a"
            x1={10}
            x2={10}
            y1={0}
            y2={20}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" />
            <stop offset={1} stopColor="#fff" stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>
    )
  }
)
Meilisearch.displayName = "Meilisearch"
export default Meilisearch
