import * as React from "react"
import type { IconProps } from "../types"
const ThumbnailBadge = React.forwardRef<SVGSVGElement, IconProps>(
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
            <circle cx={10} cy={10} r={9} fill="#3B82F6" />
            <circle cx={10} cy={10} r={9} fill="url(#c)" fillOpacity={0.2} />
            <circle
              cx={10}
              cy={10}
              r={8.75}
              stroke="#000"
              strokeOpacity={0.2}
              strokeWidth={0.5}
            />
          </g>
          <g fill="#fff" clipPath="url(#d)">
            <path d="M5.5 12.87a.835.835 0 0 1-.833-.833V7.963a.835.835 0 0 1 1.096-.791l.562.187a.5.5 0 0 1-.317.949l-.342-.114v3.613l.342-.114a.5.5 0 1 1 .317.948l-.562.188a.826.826 0 0 1-.262.042ZM8.167 14.167a.834.834 0 0 1-.833-.834V6.667a.832.832 0 0 1 1.153-.77l.539.224a.5.5 0 0 1-.385.924l-.307-.128v6.166l.307-.128a.5.5 0 0 1 .385.924l-.539.224a.843.843 0 0 1-.32.064ZM14.655 6.367l-3.472-1.603A.833.833 0 0 0 10 5.52v8.958a.83.83 0 0 0 .833.834.84.84 0 0 0 .35-.077l3.472-1.603a1.17 1.17 0 0 0 .678-1.06V7.428c0-.454-.266-.87-.678-1.06Z" />
          </g>
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h20v20H0z" />
          </clipPath>
          <clipPath id="d">
            <path fill="#fff" d="M4 4h12v12H4z" />
          </clipPath>
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
              result="effect1_dropShadow_6384_214"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect1_dropShadow_6384_214"
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
            <feBlend in2="shape" result="effect2_innerShadow_6384_214" />
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
              in2="effect2_innerShadow_6384_214"
              result="effect3_innerShadow_6384_214"
            />
          </filter>
        </defs>
      </svg>
    )
  }
)
ThumbnailBadge.displayName = "ThumbnailBadge"
export default ThumbnailBadge
