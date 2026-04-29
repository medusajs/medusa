import * as React from "react"
import type { IconProps } from "../types"
const ReceiptPercent = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g clipPath="url(#a)">
          <path
            fill={color}
            d="M5.722 6.611a.889.889 0 1 0 0-1.778.889.889 0 0 0 0 1.778M9.278 10.167a.889.889 0 1 0 0-1.778.889.889 0 0 0 0 1.778"
          />
          <path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="m5.5 9.5 4-4M12.389 7.5c0-.921.697-1.667 1.555-1.667V4.405c0-1.052-.795-1.905-1.777-1.905H2.833c-.982 0-1.777.853-1.777 1.905v1.428c.858 0 1.555.746 1.555 1.667 0 .92-.697 1.667-1.555 1.667v1.428c0 1.052.795 1.905 1.777 1.905h9.334c.982 0 1.777-.853 1.777-1.905V9.167c-.858 0-1.555-.746-1.555-1.667"
          />
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h15v15H0z" />
          </clipPath>
        </defs>
      </svg>
    )
  }
)
ReceiptPercent.displayName = "ReceiptPercent"
export default ReceiptPercent
