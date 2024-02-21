import * as React from "react"
import type { IconProps } from "../types"
const FolderOpenIllustration = React.forwardRef<SVGSVGElement, IconProps>(
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
        <path
          fill="#60A5FA"
          fillRule="evenodd"
          d="M18.25 14.722a2.972 2.972 0 0 1-2.972 2.972H4.722a2.972 2.972 0 0 1-2.972-2.972V5.278a2.972 2.972 0 0 1 2.972-2.973H6.89c.902 0 1.754.41 2.318 1.112l.445.555h5.625a2.972 2.972 0 0 1 2.972 2.972v7.778Z"
          clipRule="evenodd"
        />
        <path
          fill="url(#a)"
          fillOpacity={0.15}
          fillRule="evenodd"
          d="M18.25 14.722a2.972 2.972 0 0 1-2.972 2.972H4.722a2.972 2.972 0 0 1-2.972-2.972V5.278a2.972 2.972 0 0 1 2.972-2.973H6.89c.902 0 1.754.41 2.318 1.112l.445.555h5.625a2.972 2.972 0 0 1 2.972 2.972v7.778Z"
          clipRule="evenodd"
        />
        <path
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity={0.15}
          strokeWidth={0.5}
          d="M9.458 4.128a.25.25 0 0 0 .195.094h5.625A2.722 2.722 0 0 1 18 6.944v7.778a2.722 2.722 0 0 1-2.722 2.722H4.722A2.722 2.722 0 0 1 2 14.722V5.278a2.722 2.722 0 0 1 2.722-2.723H6.89c.826 0 1.606.375 2.123 1.018l.445.555Z"
        />
        <g fillRule="evenodd" clipRule="evenodd" filter="url(#b)">
          <path
            fill="#60A5FA"
            d="M3.002 7.778h13.995a2.5 2.5 0 0 1 2.415 3.143L18.19 15.51a3.055 3.055 0 0 1-2.952 2.269H4.763a3.054 3.054 0 0 1-2.952-2.27L.588 10.922A2.5 2.5 0 0 1 3 7.778h.002Z"
          />
          <path
            fill="url(#c)"
            fillOpacity={0.2}
            d="M3.002 7.778h13.995a2.5 2.5 0 0 1 2.415 3.143L18.19 15.51a3.055 3.055 0 0 1-2.952 2.269H4.763a3.054 3.054 0 0 1-2.952-2.27L.588 10.922A2.5 2.5 0 0 1 3 7.778h.002Z"
          />
        </g>
        <defs>
          <linearGradient
            id="a"
            x1={10}
            x2={10}
            y1={2.305}
            y2={17.694}
            gradientUnits="userSpaceOnUse"
          >
            <stop />
            <stop offset={1} stopOpacity={0} />
          </linearGradient>
          <linearGradient
            id="c"
            x1={10}
            x2={10}
            y1={7.778}
            y2={17.778}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" />
            <stop offset={1} stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <filter
            id="b"
            width={18.997}
            height={10}
            x={0.502}
            y={7.778}
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
            <feBlend in2="shape" result="effect1_innerShadow_6347_12110" />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dy={0.5} />
            <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
            <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0" />
            <feBlend
              in2="effect1_innerShadow_6347_12110"
              result="effect2_innerShadow_6347_12110"
            />
          </filter>
        </defs>
      </svg>
    )
  }
)
FolderOpenIllustration.displayName = "FolderOpenIllustration"
export default FolderOpenIllustration
