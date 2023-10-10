import * as React from "react"
import type { IconProps } from "../types"
const ArrowUpRightOnBox = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M9.054 5.327H4.743A1.752 1.752 0 0 0 2.99 7.079v8.178a1.752 1.752 0 0 0 1.753 1.753h8.178a1.752 1.752 0 0 0 1.752-1.753v-4.236m-7.67 1.993L17.01 2.99m0 0h-4.09m4.09 0v4.09"
        />
      </svg>
    )
  }
)
ArrowUpRightOnBox.displayName = "ArrowUpRightOnBox"
export default ArrowUpRightOnBox
