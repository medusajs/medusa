import * as React from "react"
import type { IconProps } from "../types"
const Klarna = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>(
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
        <path fill="#FFB3C7" d="M10 19a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        <path
          fill="#000"
          d="M12.041 6.137h-1.64A4.159 4.159 0 0 1 8.723 9.49l-.641.476 2.492 3.397h2.045l-2.293-3.108a5.734 5.734 0 0 0 1.715-4.118ZM7.874 6.137H6.211v7.234h1.663V6.137Z"
        />
        <path
          fill="#000"
          d="M13.713 11.293a1.096 1.096 0 1 0-.001 2.191 1.096 1.096 0 0 0 .001-2.191Z"
        />
      </svg>
    )
  }
)
Klarna.displayName = "Klarna"
export default Klarna
