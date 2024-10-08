import * as React from "react"
import type { IconProps } from "../types"
const FolderIllustration = React.forwardRef<SVGSVGElement, IconProps>(
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
          fill="#60A5FA"
          fillRule="evenodd"
          d="M13.935 11.183a2.32 2.32 0 0 1-2.318 2.319H3.383a2.32 2.32 0 0 1-2.318-2.319V3.817a2.32 2.32 0 0 1 2.318-2.319h1.691c.704 0 1.368.32 1.808.867l.348.433h4.387a2.32 2.32 0 0 1 2.318 2.319z"
          clipRule="evenodd"
        />
        <path
          fill="url(#a)"
          fillOpacity={0.15}
          fillRule="evenodd"
          d="M13.935 11.183a2.32 2.32 0 0 1-2.318 2.319H3.383a2.32 2.32 0 0 1-2.318-2.319V3.817a2.32 2.32 0 0 1 2.318-2.319h1.691c.704 0 1.368.32 1.808.867l.348.433h4.387a2.32 2.32 0 0 1 2.318 2.319z"
          clipRule="evenodd"
        />
        <path
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity={0.15}
          strokeWidth={0.5}
          d="M7.034 2.955a.25.25 0 0 0 .196.093h4.387c1.142 0 2.068.926 2.068 2.069v6.066a2.07 2.07 0 0 1-2.068 2.069H3.383a2.07 2.07 0 0 1-2.068-2.069V3.817c0-1.143.926-2.069 2.068-2.069h1.691c.628 0 1.22.285 1.613.774z"
        />
        <g filter="url(#b)">
          <path
            fill="#60A5FA"
            d="M1.065 7.283a2.32 2.32 0 0 1 2.318-2.318h8.234a2.32 2.32 0 0 1 2.318 2.318v3.9a2.32 2.32 0 0 1-2.318 2.318H3.383a2.32 2.32 0 0 1-2.318-2.318z"
          />
          <path
            fill="url(#c)"
            fillOpacity={0.2}
            d="M1.065 7.283a2.32 2.32 0 0 1 2.318-2.318h8.234a2.32 2.32 0 0 1 2.318 2.318v3.9a2.32 2.32 0 0 1-2.318 2.318H3.383a2.32 2.32 0 0 1-2.318-2.318z"
          />
        </g>
        <defs>
          <linearGradient
            id="a"
            x1={7.5}
            x2={7.5}
            y1={1.498}
            y2={13.502}
            gradientUnits="userSpaceOnUse"
          >
            <stop />
            <stop offset={1} stopOpacity={0} />
          </linearGradient>
          <linearGradient
            id="c"
            x1={7.5}
            x2={7.5}
            y1={4.965}
            y2={13.501}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" />
            <stop offset={1} stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <filter
            id="b"
            width={12.87}
            height={8.537}
            x={1.065}
            y={4.965}
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dy={-0.5} />
            <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
            <feBlend in2="shape" result="effect1_innerShadow_6347_11987" />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dy={0.5} />
            <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
            <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0" />
            <feBlend
              in2="effect1_innerShadow_6347_11987"
              result="effect2_innerShadow_6347_11987"
            />
          </filter>
        </defs>
      </svg>
    )
  }
)
FolderIllustration.displayName = "FolderIllustration"
export default FolderIllustration
