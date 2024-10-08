import * as React from "react"
import type { IconProps } from "../types"
const VerifiedBadge = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g filter="url(#a)">
          <path
            fill="#3B82F6"
            fillRule="evenodd"
            d="M7.28 2.337A3.6 3.6 0 0 1 10 1.097c1.086 0 2.06.48 2.72 1.24a3.6 3.6 0 0 1 2.8 1.046 3.6 3.6 0 0 1 1.047 2.8 3.6 3.6 0 0 1 1.24 2.72 3.6 3.6 0 0 1-1.241 2.72 3.6 3.6 0 0 1-1.046 2.8 3.6 3.6 0 0 1-2.8 1.046 3.6 3.6 0 0 1-4.215.916 3.6 3.6 0 0 1-1.225-.916 3.6 3.6 0 0 1-2.8-1.046 3.6 3.6 0 0 1-1.047-2.8 3.6 3.6 0 0 1-1.24-2.72c0-1.087.481-2.06 1.241-2.72a3.6 3.6 0 0 1 1.047-2.8 3.6 3.6 0 0 1 2.8-1.046"
            clipRule="evenodd"
          />
          <path
            fill="url(#b)"
            fillOpacity={0.2}
            fillRule="evenodd"
            d="M7.28 2.337A3.6 3.6 0 0 1 10 1.097c1.086 0 2.06.48 2.72 1.24a3.6 3.6 0 0 1 2.8 1.046 3.6 3.6 0 0 1 1.047 2.8 3.6 3.6 0 0 1 1.24 2.72 3.6 3.6 0 0 1-1.241 2.72 3.6 3.6 0 0 1-1.046 2.8 3.6 3.6 0 0 1-2.8 1.046 3.6 3.6 0 0 1-4.215.916 3.6 3.6 0 0 1-1.225-.916 3.6 3.6 0 0 1-2.8-1.046 3.6 3.6 0 0 1-1.047-2.8 3.6 3.6 0 0 1-1.24-2.72c0-1.087.481-2.06 1.241-2.72a3.6 3.6 0 0 1 1.047-2.8 3.6 3.6 0 0 1 2.8-1.046"
            clipRule="evenodd"
          />
          <path
            stroke="#000"
            strokeOpacity={0.2}
            strokeWidth={0.5}
            d="M3.433 11.623a3.6 3.6 0 0 0 1.047 2.8 3.6 3.6 0 0 0 2.8 1.046zm0 0a3.6 3.6 0 0 1-1.24-2.72c0-1.087.481-2.06 1.241-2.72m0 5.44v-5.44m0 0a3.6 3.6 0 0 1 1.047-2.8zm3.828-3.586.13.009.085-.099A3.34 3.34 0 0 1 10 1.357c1.008 0 1.91.445 2.523 1.15l.085.099.13-.01a3.34 3.34 0 0 1 2.598.971 3.34 3.34 0 0 1 .971 2.598l-.01.13.1.085a3.34 3.34 0 0 1 1.149 2.523 3.34 3.34 0 0 1-1.15 2.523l-.099.085.01.13a3.34 3.34 0 0 1-.971 2.597 3.34 3.34 0 0 1-2.598.971l-.13-.009-.085.098A3.34 3.34 0 0 1 10 16.448a3.34 3.34 0 0 1-2.523-1.15l-.085-.098-.13.01a3.34 3.34 0 0 1-2.598-.97v-.001a3.34 3.34 0 0 1-.971-2.598l.01-.13-.1-.085a3.34 3.34 0 0 1-1.149-2.523c0-1.008.445-1.911 1.15-2.523l.099-.086-.01-.13a3.34 3.34 0 0 1 .971-2.596 3.34 3.34 0 0 1 2.598-.971Z"
          />
        </g>
        <path
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="m6.964 9.206 2.429 2.429 3.643-5.464"
        />
        <defs>
          <linearGradient
            id="b"
            x1={10}
            x2={10}
            y1={1.097}
            y2={16.709}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" />
            <stop offset={1} stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <filter
            id="a"
            width={20}
            height={20}
            x={0}
            y={0}
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dy={1.054} />
            <feGaussianBlur stdDeviation={1.054} />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
            <feBlend
              in2="BackgroundImageFix"
              result="effect1_dropShadow_6386_370"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect1_dropShadow_6386_370"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dy={1.054} />
            <feGaussianBlur stdDeviation={1.054} />
            <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
            <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0" />
            <feBlend in2="shape" result="effect2_innerShadow_6386_370" />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dy={-1.054} />
            <feGaussianBlur stdDeviation={2.635} />
            <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
            <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0" />
            <feBlend
              in2="effect2_innerShadow_6386_370"
              result="effect3_innerShadow_6386_370"
            />
          </filter>
        </defs>
      </svg>
    )
  }
)
VerifiedBadge.displayName = "VerifiedBadge"
export default VerifiedBadge
