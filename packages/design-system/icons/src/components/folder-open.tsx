import * as React from "react"
import type { IconProps } from "../types"
const FolderOpen = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          clipPath="url(#a)"
        >
          <path d="M1.875 6.458v-2.5c0-.92.746-1.666 1.667-1.666h1.626c.505 0 .983.229 1.3.623l.502.627h4.488c.921 0 1.667.746 1.667 1.666v1.25" />
          <path d="M2.252 6.458h10.496c.822 0 1.42.779 1.208 1.572l-.918 3.44a1.666 1.666 0 0 1-1.61 1.238H3.572a1.666 1.666 0 0 1-1.61-1.237L1.045 8.03a1.25 1.25 0 0 1 1.207-1.572z" />
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
