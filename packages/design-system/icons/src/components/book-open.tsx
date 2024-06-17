import * as React from "react"
import type { IconProps } from "../types"
const BookOpen = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M7.5 12.96a.9.9 0 0 0 .44-.118 5.6 5.6 0 0 1 2.791-.751 5.5 5.5 0 0 1 2.018.386c.576.227 1.194-.213 1.194-.833V3.571a.88.88 0 0 0-.431-.765 5.5 5.5 0 0 0-2.792-.767c-1.68 0-2.842.775-3.22 1.05" />
          <path d="M7.5 12.96a.9.9 0 0 1-.44-.118 5.6 5.6 0 0 0-2.791-.751 5.5 5.5 0 0 0-2.018.386c-.576.227-1.195-.21-1.195-.829v-8.08c0-.315.161-.6.432-.76A5.5 5.5 0 0 1 4.28 2.04c1.68 0 2.842.775 3.22 1.05z" />
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
BookOpen.displayName = "BookOpen"
export default BookOpen
