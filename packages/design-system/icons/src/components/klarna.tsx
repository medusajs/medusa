import * as React from "react"
import type { IconProps } from "../types"
const Klarna = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>(
  (props, ref) => {
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
          fill="#FFB3C7"
          d="M7.5 14.25a6.75 6.75 0 1 0 0-13.5 6.75 6.75 0 0 0 0 13.5"
        />
        <path
          fill="#000"
          d="M9.03 4.603H7.802a3.12 3.12 0 0 1-1.259 2.515l-.48.357 1.869 2.547h1.533l-1.72-2.33a4.3 4.3 0 0 0 1.287-3.09M5.906 4.603H4.658v5.425h1.248z"
        />
        <path
          fill="#000"
          d="M10.285 8.47a.821.821 0 1 0-.001 1.642.821.821 0 0 0 .001-1.642"
        />
      </svg>
    )
  }
)
Klarna.displayName = "Klarna"
export default Klarna
