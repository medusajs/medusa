import * as React from "react"
import type { IconProps } from "../types"
const Vite = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>(
  (props, ref) => {
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
            fill="url(#b)"
            d="M14.2 2.586 7.868 13.91a.344.344 0 0 1-.6.003L.809 2.587a.344.344 0 0 1 .36-.51l6.34 1.134q.06.01.123 0l6.207-1.132a.344.344 0 0 1 .363.507"
          />
          <path
            fill="url(#c)"
            d="m10.528.591-4.687.918a.17.17 0 0 0-.139.16l-.288 4.869a.172.172 0 0 0 .21.178l1.305-.302a.172.172 0 0 1 .208.203l-.388 1.898a.172.172 0 0 0 .219.2l.806-.246a.172.172 0 0 1 .218.2l-.616 2.982c-.038.187.21.288.313.128l.07-.107 3.819-7.622a.172.172 0 0 0-.187-.246l-1.343.26a.172.172 0 0 1-.198-.217l.877-3.04a.172.172 0 0 0-.199-.216"
          />
        </g>
        <defs>
          <linearGradient
            id="b"
            x1={0.651}
            x2={8.533}
            y1={1.673}
            y2={12.378}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#41D1FF" />
            <stop offset={1} stopColor="#BD34FE" />
          </linearGradient>
          <linearGradient
            id="c"
            x1={7.144}
            x2={8.57}
            y1={0.84}
            y2={10.622}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFEA83" />
            <stop offset={0.083} stopColor="#FFDD35" />
            <stop offset={1} stopColor="#FFA800" />
          </linearGradient>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h15v15H0z" />
          </clipPath>
        </defs>
      </svg>
    )
  }
)
Vite.displayName = "Vite"
export default Vite
