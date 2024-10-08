import * as React from "react"
import type { IconProps } from "../types"
const Visa = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>(
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
        <g clipPath="url(#a)">
          <path
            fill="#1A1F71"
            d="M5.695 5.164 3.731 9.849H2.45l-.966-3.74c-.059-.23-.11-.314-.288-.41C.904 5.54.423 5.391 0 5.298l.029-.135H2.09a.565.565 0 0 1 .559.477l.51 2.712 1.262-3.19zm5.02 3.156c.006-1.237-1.71-1.305-1.697-1.858.003-.168.163-.347.513-.392.41-.04.823.033 1.196.21l.212-.994a3.3 3.3 0 0 0-1.133-.208c-1.198 0-2.042.637-2.05 1.549-.007.674.603 1.05 1.062 1.275.473.23.631.377.629.582-.003.315-.376.453-.725.459-.61.009-.963-.165-1.245-.296l-.22 1.026c.284.13.806.244 1.348.249 1.273 0 2.106-.629 2.11-1.602m3.164 1.529H15l-.978-4.685h-1.035a.55.55 0 0 0-.516.344l-1.819 4.34h1.273l.253-.7h1.555zm-1.352-1.66.637-1.76.368 1.76zm-5.1-3.025L6.425 9.849H5.213l1.003-4.685z"
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
Visa.displayName = "Visa"
export default Visa
