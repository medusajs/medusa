import * as React from "react"
import type { IconProps } from "../types"
const Astro = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>(
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
        <path
          fill="url(#a)"
          d="M9.497 1.088c.11.137.167.322.28.691l2.456 8.07a10.2 10.2 0 0 0-2.937-.994l-1.6-5.405a.208.208 0 0 0-.399 0l-1.58 5.403c-1.029.179-2.024.515-2.95.995l2.468-8.07c.113-.37.17-.554.28-.69a.9.9 0 0 1 .368-.273C6.045.75 6.238.75 6.624.75h1.763c.386 0 .58 0 .743.066.144.058.27.151.367.272"
        />
        <path
          fill="#FF5D01"
          d="M9.791 10.234c-.405.346-1.213.582-2.144.582-1.143 0-2.1-.355-2.355-.834-.09.274-.111.588-.111.789 0 0-.06.984.625 1.669a.644.644 0 0 1 .643-.644c.61 0 .61.532.609.963v.038c0 .655.4 1.217.97 1.453a1.3 1.3 0 0 1-.134-.578c0-.625.367-.857.793-1.128.339-.215.716-.453.975-.932a1.76 1.76 0 0 0 .13-1.378"
        />
        <path
          fill="url(#b)"
          d="M9.791 10.234c-.405.346-1.213.582-2.144.582-1.143 0-2.1-.355-2.355-.834-.09.274-.111.588-.111.789 0 0-.06.984.625 1.669a.644.644 0 0 1 .643-.644c.61 0 .61.532.609.963v.038c0 .655.4 1.217.97 1.453a1.3 1.3 0 0 1-.134-.578c0-.625.367-.857.793-1.128.339-.215.716-.453.975-.932a1.76 1.76 0 0 0 .13-1.378"
        />
        <defs>
          <linearGradient
            id="a"
            x1={10.268}
            x2={7.5}
            y1={0.322}
            y2={9.85}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#000014" />
            <stop offset={1} stopColor="#150426" />
          </linearGradient>
          <linearGradient
            id="b"
            x1={11.615}
            x2={9.217}
            y1={7.417}
            y2={12.437}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF1639" />
            <stop offset={1} stopColor="#FF1639" stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>
    )
  }
)
Astro.displayName = "Astro"
export default Astro
