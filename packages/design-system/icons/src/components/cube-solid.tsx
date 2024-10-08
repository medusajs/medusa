import * as React from "react"
import type { IconProps } from "../types"
const CubeSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M13.4 4.095s-.001-.01-.004-.015q-.006-.006-.012-.013c-.21-.359-.509-.666-.879-.88L8.727.996a2.45 2.45 0 0 0-2.454 0L2.496 3.187a2.44 2.44 0 0 0-.88.88q-.005.006-.012.013-.003.008-.004.015a2.44 2.44 0 0 0-.322 1.207v4.396c0 .869.466 1.678 1.218 2.115l3.777 2.191c.376.217.795.325 1.215.327l.012.003q.006-.001.013-.003c.42-.002.84-.11 1.214-.327l3.778-2.191a2.45 2.45 0 0 0 1.217-2.114V5.302c0-.43-.115-.845-.322-1.207M3.165 10.66a1.12 1.12 0 0 1-.554-.962V5.435l4.222 2.449v4.902zm8.67 0-3.668 2.128V7.885l4.222-2.449v4.263c0 .395-.212.763-.554.961"
        />
      </svg>
    )
  }
)
CubeSolid.displayName = "CubeSolid"
export default CubeSolid
