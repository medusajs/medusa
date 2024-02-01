import * as React from "react"
import type { IconProps } from "../types"
const FaceSmile = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M12.652 12.652a3.753 3.753 0 0 1-5.304 0M17.5 10a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0ZM8.125 8.125c0 .345-.14.625-.313.625-.172 0-.312-.28-.312-.625s.14-.625.313-.625c.172 0 .312.28.312.625Zm-.313 0h.007v.012h-.006v-.012Zm4.688 0c0 .345-.14.625-.313.625-.172 0-.312-.28-.312-.625s.14-.625.313-.625c.172 0 .312.28.312.625Zm-.313 0h.007v.012h-.007v-.012Z"
        />
      </svg>
    )
  }
)
FaceSmile.displayName = "FaceSmile"
export default FaceSmile
