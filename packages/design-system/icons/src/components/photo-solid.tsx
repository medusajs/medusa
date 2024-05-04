import * as React from "react"
import type { IconProps } from "../types"
const PhotoSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M1.25 5a1.875 1.875 0 0 1 1.875-1.875h13.75A1.875 1.875 0 0 1 18.75 5v10a1.875 1.875 0 0 1-1.875 1.875H3.125A1.875 1.875 0 0 1 1.25 15V5Zm1.25 8.383V15c0 .345.28.625.625.625h13.75A.624.624 0 0 0 17.5 15v-1.617l-2.242-2.24a1.25 1.25 0 0 0-1.766 0l-.734.732.809.808a.627.627 0 0 1 .015.9.623.623 0 0 1-.899-.016l-4.3-4.3a1.25 1.25 0 0 0-1.766 0L2.5 13.384Zm8.438-6.508a.938.938 0 1 1 1.875 0 .938.938 0 0 1-1.876 0Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
PhotoSolid.displayName = "PhotoSolid"
export default PhotoSolid
