import * as React from "react"
import type { IconProps } from "../types"
const WandSparkle = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g clipPath="url(#a)">
          <path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M14.107 3.393 3.381 14.119a1.111 1.111 0 0 0 0 1.572l.928.928a1.111 1.111 0 0 0 1.572 0L16.607 5.893a1.111 1.111 0 0 0 0-1.572l-.928-.928a1.111 1.111 0 0 0-1.572 0ZM11.541 5.959l2.5 2.5"
          />
          <path
            fill={color}
            d="m8.048 3.88-1.051-.35-.351-1.052c-.114-.34-.677-.34-.79 0L5.504 3.53l-1.05.35a.417.417 0 0 0 0 .791l1.05.35.352 1.052a.416.416 0 0 0 .788 0l.352-1.052 1.05-.35a.417.417 0 0 0 .002-.791ZM18.509 13.322l-1.404-.468-.467-1.403c-.153-.453-.903-.453-1.055 0l-.467 1.403-1.404.468a.556.556 0 0 0 0 1.054l1.404.467.467 1.404a.557.557 0 0 0 1.056 0l.468-1.404 1.403-.467a.555.555 0 0 0-.001-1.054ZM10.278 2.778a.833.833 0 1 0 0-1.667.833.833 0 0 0 0 1.667Z"
          />
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h20v20H0z" />
          </clipPath>
        </defs>
      </svg>
    )
  }
)
WandSparkle.displayName = "WandSparkle"
export default WandSparkle
