import * as React from "react"
import type { IconProps } from "../types"
const Image = React.forwardRef<SVGSVGElement, IconProps>(
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
        <path
          stroke="#212121"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="m2.844 12.824 5.4-5.4a1.777 1.777 0 0 1 2.513 0l2.299 2.298"
        />
        <path
          stroke="#212121"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11.278 1.944H3.722c-.982 0-1.778.796-1.778 1.778v7.556c0 .981.796 1.777 1.778 1.777h7.556c.982 0 1.778-.796 1.778-1.777V3.722c0-.982-.796-1.778-1.778-1.778"
        />
        <path
          fill="#212121"
          d="M5.26 7.247a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5"
        />
      </svg>
    )
  }
)
Image.displayName = "Image"
export default Image
