import * as React from "react"
import type { IconProps } from "../types"
const BookOpen = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M7.5 12.879a.9.9 0 0 0 .44-.12 5.6 5.6 0 0 1 2.791-.75c.8 0 1.482.175 2.018.386.576.227 1.194-.213 1.194-.833V3.488a.88.88 0 0 0-.431-.764 5.5 5.5 0 0 0-2.792-.767c-1.68 0-2.842.775-3.22 1.05" />
          <path d="M11.941 5.651a5.4 5.4 0 0 0-2.441 0M11.941 8.763a5.4 5.4 0 0 0-2.441 0M7.5 12.879a.9.9 0 0 1-.44-.12 5.6 5.6 0 0 0-2.791-.75 5.5 5.5 0 0 0-2.018.386c-.576.227-1.195-.21-1.195-.83v-8.08c0-.314.161-.6.432-.76a5.5 5.5 0 0 1 2.792-.767c1.68 0 2.842.775 3.22 1.05z" />
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
