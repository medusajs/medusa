import * as React from "react"
import type { IconProps } from "../types"
const Klaviyo = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>(
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
        <path fill="url(#a)" d="M14.25 12H.75V3h13.5l-2.834 4.5z" />
        <defs>
          <linearGradient
            id="a"
            x1={15.15}
            x2={-1.275}
            y1={3.626}
            y2={13.751}
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
