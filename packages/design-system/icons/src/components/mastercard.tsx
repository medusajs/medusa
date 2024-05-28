import * as React from "react"
import type { IconProps } from "../types"
const Mastercard = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>(
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
        <path fill="#FF5A00" d="M9.524 3.815h-4.06v7.37h4.06z" />
        <path
          fill="#EB001B"
          d="M5.735 7.5c0-1.497.696-2.826 1.765-3.685a4.6 4.6 0 0 0-2.861-1.002C2.075 2.813 0 4.909 0 7.5s2.075 4.688 4.639 4.688A4.6 4.6 0 0 0 7.5 11.185 4.7 4.7 0 0 1 5.735 7.5"
        />
        <path
          fill="#F79E1B"
          d="M15 7.5c0 2.591-2.075 4.688-4.639 4.688A4.6 4.6 0 0 1 7.5 11.185 4.68 4.68 0 0 0 9.265 7.5 4.72 4.72 0 0 0 7.5 3.815a4.58 4.58 0 0 1 2.86-1.002c2.565 0 4.64 2.11 4.64 4.687"
        />
      </svg>
    )
  }
)
Mastercard.displayName = "Mastercard"
export default Mastercard
