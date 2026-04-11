import * as React from "react"
import type { IconProps } from "../types"
const Contentful = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={20}
        viewBox="0 0 20 20"
        fill="none"
        ref={ref}
        {...props}
      >
        <path fill="#F4F4F5" d="M0 0h20v20H0z" />
        <path fill="url(#a)" fillOpacity={0.2} d="M0 0h20v20H0z" />
        <path
          fill="#1773EB"
          d="M8.106 5.5a1.65 1.65 0 0 1 .422 1.614 3.33 3.33 0 0 1 1.722-.476h.013a3.35 3.35 0 0 1 2.371.994 1.32 1.32 0 1 0 1.874-1.858A5.98 5.98 0 0 0 10.27 4h-.022a5.97 5.97 0 0 0-3.346 1.018h.037c.438 0 .858.173 1.167.483"
        />
        <path
          fill="#E44F20"
          d="M13.547 12a1.32 1.32 0 0 0-.93.382 3.35 3.35 0 0 1-2.365.976h-.013a3.3 3.3 0 0 1-1.723-.484q.06.217.059.441a1.65 1.65 0 0 1-1.65 1.65h-.043A5.96 5.96 0 0 0 10.23 16h.023a5.97 5.97 0 0 0 4.224-1.742A1.32 1.32 0 0 0 13.548 12z"
        />
        <path
          fill="#FFDA00"
          d="M5.757 12.147c.308-.31.729-.485 1.166-.483q.229 0 .447.06a3.35 3.35 0 0 1 .007-3.463A1.65 1.65 0 0 1 5.29 6.667v-.044a6 6 0 0 0-.016 6.726v-.035a1.64 1.64 0 0 1 .484-1.167"
        />
        <path
          fill="#1773EB"
          d="M6.94 5.31c-.376 0-.639.156-.957.475-.304.302-.4.567-.4.882a1.356 1.356 0 1 0 1.356-1.356"
        />
        <path
          fill="#E44F20"
          d="M5.564 13.316c0 .374.155.638.473.955.303.304.568.4.883.4a1.351 1.351 0 1 0-1.356-1.35z"
        />
        <defs>
          <linearGradient
            id="a"
            x1={10}
            x2={10}
            y1={0}
            y2={20}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" />
            <stop offset={1} stopColor="#fff" stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>
    )
  }
)
Contentful.displayName = "Contentful"
export default Contentful
