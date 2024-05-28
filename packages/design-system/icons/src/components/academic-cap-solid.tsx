import * as React from "react"
import type { IconProps } from "../types"
const AcademicCapSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g fill={color} clipPath="url(#a)">
          <path d="M8.823 10.513c-.408.21-.866.32-1.323.32s-.916-.11-1.324-.32L2.611 8.677v3.267c0 1.605 2.46 2.445 4.889 2.445s4.889-.84 4.889-2.445V8.678z" />
          <path d="M14.361 7.7a9.3 9.3 0 0 1 .192-2.134c.016-.116.058-.17.058-.4 0-.534-.295-1.018-.77-1.262L8.213 1.006a1.56 1.56 0 0 0-1.426 0L1.16 3.905c-.475.244-.77.728-.77 1.262s.295 1.018.77 1.263l5.628 2.897a1.56 1.56 0 0 0 1.426 0l4.845-2.495c-.017.304-.04.607-.03.91.021.687.112 1.375.268 2.046a.666.666 0 1 0 1.298-.3 9.2 9.2 0 0 1-.233-1.787" />
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
AcademicCapSolid.displayName = "AcademicCapSolid"
export default AcademicCapSolid
