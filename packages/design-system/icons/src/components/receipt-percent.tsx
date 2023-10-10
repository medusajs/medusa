import * as React from "react"
import type { IconProps } from "../types"
const ReceiptPercent = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m7.5 11.875 5-5m3.75-2.91v14.16l-3.125-1.25L10 18.125l-3.125-1.25-3.125 1.25V3.965c0-.924.672-1.715 1.59-1.822 3.096-.36 6.224-.36 9.32 0 .918.107 1.59.898 1.59 1.821ZM8.125 7.5h.007v.007h-.007V7.5Zm.313 0a.312.312 0 1 1-.625 0 .312.312 0 0 1 .625 0v0Zm3.437 3.75h.007v.007h-.007v-.007Zm.313 0a.313.313 0 1 1-.626 0 .313.313 0 0 1 .626 0v0Z"
        />
      </svg>
    )
  }
)
ReceiptPercent.displayName = "ReceiptPercent"
export default ReceiptPercent
