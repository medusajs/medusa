import * as React from "react"
import type { IconProps } from "../types"
const Camera = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M5.69 5.146a1.925 1.925 0 0 1-1.368.879c-.317.045-.631.093-.945.146-.878.146-1.502.918-1.502 1.807V15a1.875 1.875 0 0 0 1.875 1.875h12.5A1.875 1.875 0 0 0 18.125 15V7.978c0-.889-.625-1.661-1.502-1.807-.314-.053-.63-.101-.945-.146a1.925 1.925 0 0 1-1.366-.88l-.685-1.096a1.827 1.827 0 0 0-1.447-.866 40.643 40.643 0 0 0-4.36 0 1.827 1.827 0 0 0-1.447.866L5.69 5.146Z"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13.75 10.625a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Zm1.875-1.875h.007v.007h-.007V8.75Z"
        />
      </svg>
    )
  }
)
Camera.displayName = "Camera"
export default Camera
