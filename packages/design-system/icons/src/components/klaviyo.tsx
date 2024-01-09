import * as React from "react"
import type { IconProps } from "../types"
const Klaviyo = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>(
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
        <path fill="url(#a)" d="M19 16H1V4h18l-3.778 6L19 16Z" />
        <defs>
          <linearGradient
            id="a"
            x1={20.2}
            x2={-1.7}
            y1={4.835}
            y2={18.335}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#ED7598" />
            <stop offset={0.456} stopColor="#F75650" />
            <stop offset={1} stopColor="#FFA661" />
          </linearGradient>
        </defs>
      </svg>
    )
  }
)
Klaviyo.displayName = "Klaviyo"
export default Klaviyo
