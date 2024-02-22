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
        <g clipPath="url(#a)">
          <g filter="url(#b)">
            <path
              fill="#3B82F6"
              fillRule="evenodd"
              d="M6.864 2.43A4.145 4.145 0 0 1 10 1a4.14 4.14 0 0 1 3.136 1.43 4.145 4.145 0 0 1 3.229 1.206 4.147 4.147 0 0 1 1.206 3.228A4.146 4.146 0 0 1 19 10a4.143 4.143 0 0 1-1.43 3.136 4.146 4.146 0 0 1-1.206 3.228 4.145 4.145 0 0 1-3.228 1.206A4.144 4.144 0 0 1 10 19a4.143 4.143 0 0 1-3.136-1.43 4.145 4.145 0 0 1-3.229-1.205 4.145 4.145 0 0 1-1.206-3.23A4.145 4.145 0 0 1 1 10a4.14 4.14 0 0 1 1.43-3.136 4.145 4.145 0 0 1 1.206-3.228A4.145 4.145 0 0 1 6.864 2.43Z"
              clipRule="evenodd"
            />
            <path
              fill="url(#c)"
              fillOpacity={0.2}
              fillRule="evenodd"
              d="M6.864 2.43A4.145 4.145 0 0 1 10 1a4.14 4.14 0 0 1 3.136 1.43 4.145 4.145 0 0 1 3.229 1.206 4.147 4.147 0 0 1 1.206 3.228A4.146 4.146 0 0 1 19 10a4.143 4.143 0 0 1-1.43 3.136 4.146 4.146 0 0 1-1.206 3.228 4.145 4.145 0 0 1-3.228 1.206A4.144 4.144 0 0 1 10 19a4.143 4.143 0 0 1-3.136-1.43 4.145 4.145 0 0 1-3.229-1.205 4.145 4.145 0 0 1-1.206-3.23A4.145 4.145 0 0 1 1 10a4.14 4.14 0 0 1 1.43-3.136 4.145 4.145 0 0 1 1.206-3.228A4.145 4.145 0 0 1 6.864 2.43Z"
              clipRule="evenodd"
            />
            <path
              stroke="#000"
              strokeOpacity={0.2}
              strokeWidth={0.5}
              d="m6.847 2.68.124.008.082-.094A3.895 3.895 0 0 1 10 1.25a3.89 3.89 0 0 1 2.947 1.344l.082.094.124-.009a3.894 3.894 0 0 1 3.035 1.134 3.895 3.895 0 0 1 1.134 3.034l-.01.124.095.082A3.896 3.896 0 0 1 18.75 10a3.896 3.896 0 0 1-1.344 2.947l-.094.082.009.124a3.896 3.896 0 0 1-1.134 3.034 3.899 3.899 0 0 1-3.034 1.134l-.124-.01-.082.095A3.896 3.896 0 0 1 10 18.75a3.896 3.896 0 0 1-2.947-1.344l-.082-.094-.125.009a3.894 3.894 0 0 1-3.034-1.133 3.897 3.897 0 0 1-1.134-3.034l.01-.125-.095-.082A3.895 3.895 0 0 1 1.25 10a3.89 3.89 0 0 1 1.344-2.947l.094-.082-.009-.124a3.895 3.895 0 0 1 1.134-3.034 3.894 3.894 0 0 1 3.034-1.134Z"
            />
          </g>
          <path
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M6.667 10.333 9.333 13l4-6"
          />
        </g>
        <defs>
          <linearGradient
            id="c"
            x1={10}
            x2={10}
            y1={1}
            y2={19}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" />
            <stop offset={1} stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h20v20H0z" />
          </clipPath>
          <filter
            id="b"
            width={22.215}
            height={22.215}
            x={-1.108}
            y={-0.054}
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
