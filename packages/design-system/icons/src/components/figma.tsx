import * as React from "react"
import type { IconProps } from "../types"
const Figma = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>(
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
          fill="#1ABCFE"
          d="M10 10a2.97 2.97 0 1 1 5.939 0A2.97 2.97 0 0 1 10 10Z"
        />
        <path
          fill="#0ACF83"
          d="M4.061 15.939a2.97 2.97 0 0 1 2.97-2.97H10v2.97a2.97 2.97 0 1 1-5.94 0Z"
        />
        <path
          fill="#FF7262"
          d="M10 1.092V7.03h2.97a2.97 2.97 0 1 0 0-5.938H10Z"
        />
        <path
          fill="#F24E1E"
          d="M4.061 4.061a2.97 2.97 0 0 0 2.97 2.97H10V1.09H7.03a2.97 2.97 0 0 0-2.97 2.97Z"
        />
        <path
          fill="#A259FF"
          d="M4.061 10a2.97 2.97 0 0 0 2.97 2.97H10V7.03H7.03A2.97 2.97 0 0 0 4.06 10Z"
        />
      </svg>
    )
  }
)
Figma.displayName = "Figma"
export default Figma
