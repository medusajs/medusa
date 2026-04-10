import * as React from "react"
import type { IconProps } from "../types"
const ImageSparkle = React.forwardRef<SVGSVGElement, IconProps>(
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
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13.056 4.62v6.658c0 .982-.796 1.777-1.778 1.777H3.722a1.777 1.777 0 0 1-1.778-1.777V3.722c0-.982.796-1.778 1.778-1.778h1.402"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="m2.844 12.824 5.4-5.4a1.777 1.777 0 0 1 2.513 0l2.299 2.298"
        />
        <path
          fill={color}
          d="m6.383 5.27-.841-.28-.281-.841c-.09-.272-.541-.272-.632 0l-.281.842-.84.28a.334.334 0 0 0 0 .632l.84.28.28.842a.333.333 0 0 0 .632 0l.28-.842.842-.28a.334.334 0 0 0 0-.632M11.64 1.769l-1.122-.374-.375-1.123c-.121-.363-.721-.363-.843 0l-.374 1.123-1.123.374a.444.444 0 0 0 0 .843l1.123.374.374 1.122a.446.446 0 0 0 .844 0l.375-1.122 1.122-.374a.445.445 0 0 0 0-.843M9.944 11.056a.667.667 0 1 0 0-1.334.667.667 0 0 0 0 1.334"
        />
      </svg>
    )
  }
)
ImageSparkle.displayName = "ImageSparkle"
export default ImageSparkle
