import * as React from "react"
import type { IconProps } from "../types"
const PuzzleSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
        <path
          fill={color}
          d="M13.201 7.202a.667.667 0 0 0 .966-.595v-1.55a2.446 2.446 0 0 0-2.445-2.445h-1.578c.01-.074.023-.146.023-.222A1.78 1.78 0 0 0 8.389.612 1.78 1.78 0 0 0 6.61 2.39c0 .076.013.148.022.222H5.056A2.446 2.446 0 0 0 2.61 5.057v1.577c-.074-.01-.146-.022-.222-.022A1.78 1.78 0 0 0 .61 8.39c0 .98.797 1.778 1.778 1.778.076 0 .148-.014.222-.023v1.578a2.446 2.446 0 0 0 2.445 2.445h1.55a.67.67 0 0 0 .596-.965 1.3 1.3 0 0 1-.146-.59c0-.736.598-1.334 1.333-1.334s1.333.598 1.333 1.333q0 .297-.147.592a.665.665 0 0 0 .597.964h1.55a2.446 2.446 0 0 0 2.445-2.445v-1.55a.668.668 0 0 0-.966-.596c-.913.458-1.923-.253-1.923-1.186 0-.934 1.008-1.645 1.923-1.187z"
        />
      </svg>
    )
  }
)
PuzzleSolid.displayName = "PuzzleSolid"
export default PuzzleSolid
