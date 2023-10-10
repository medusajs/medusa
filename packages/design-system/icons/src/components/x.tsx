import * as React from "react"
import type { IconProps } from "../types"
const X = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>(
  (props, ref) => {
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
          fill="#000"
          fillRule="evenodd"
          d="M1 1.563h5.906l4.201 5.861 5.08-5.862h2.25l-6.311 7.283L19 18.437h-5.906l-4.201-5.861-5.08 5.861h-2.25l6.311-7.282L1 1.563ZM13.96 16.75 4.285 3.25H6.04l9.675 13.5H13.96Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
X.displayName = "X"
export default X
