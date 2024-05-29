import * as React from "react"
import type { IconProps } from "../types"
const ReceiptPercent = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g clipPath="url(#a)">
          <path
            fill={color}
            fillRule="evenodd"
            d="M2.833 1.593C1.368 1.593.306 2.88.306 4.307v1.474c0 .414.335.75.75.75.375 0 .805.361.805.97 0 .607-.43.968-.805.968a.75.75 0 0 0-.75.75v1.474c0 1.426 1.062 2.715 2.527 2.715h9.334c1.465 0 2.527-1.289 2.527-2.715V9.219a.75.75 0 0 0-.75-.75c-.376 0-.805-.361-.805-.969s.43-.97.805-.97a.75.75 0 0 0 .75-.75V4.308c0-1.426-1.062-2.714-2.527-2.714zM1.806 4.307c0-.743.528-1.214 1.027-1.214h9.334c.499 0 1.027.471 1.027 1.214v.855c-.936.341-1.555 1.303-1.555 2.338s.62 1.997 1.555 2.338v.855c0 .743-.528 1.215-1.027 1.215H2.833c-.499 0-1.027-.472-1.027-1.215v-.855C2.742 9.498 3.36 8.536 3.36 7.5c0-1.035-.62-1.997-1.555-2.338zm8.224.663a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 1 1-1.06-1.06l4-4a.75.75 0 0 1 1.06 0m-3.419.752a.889.889 0 1 1-1.778 0 .889.889 0 0 1 1.778 0m3.556 3.556a.889.889 0 1 1-1.778 0 .889.889 0 0 1 1.778 0"
            clipRule="evenodd"
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
