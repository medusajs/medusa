import * as React from "react"
import type { IconProps } from "../types"
const FolderOpen = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={15}
        height={15}
        viewBox="0 0 15 15"
        fill="none"
        ref={ref}
        {...props}
      >
        <g
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          clipPath="url(#a)"
        >
          <path d="M4.167 12.292h-.625c-.921 0-1.667-.746-1.667-1.667V3.958c0-.92.746-1.666 1.667-1.666h1.52c.49 0 .954.215 1.27.587l1.27 1.496h3.855c.921 0 1.667.746 1.667 1.667v.833" />
          <path d="m13.457 11.058.702-2.608a1.25 1.25 0 0 0-1.207-1.575H5.126c-.565 0-1.06.38-1.207.925l-.785 2.917a1.25 1.25 0 0 0 1.207 1.575h7.508c.753 0 1.413-.506 1.609-1.234" />
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h15v15H0z" />
          </clipPath>
        </defs>
      </svg>
    )
  }
)
FolderOpen.displayName = "FolderOpen"
export default FolderOpen
