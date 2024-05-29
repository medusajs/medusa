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
        <g filter="url(#a)">
          <circle cx={10} cy={8.903} r={7.806} fill="#3B82F6" />
          <circle
            cx={10}
            cy={8.903}
            r={7.806}
            fill="url(#b)"
            fillOpacity={0.2}
          />
          <circle
            cx={10}
            cy={8.903}
            r={7.556}
            stroke="#000"
            strokeOpacity={0.2}
            strokeWidth={0.5}
          />
        </g>
        <g fill="#fff" clipPath="url(#c)">
          <path d="M6.098 11.393a.724.724 0 0 1-.724-.723V7.136a.724.724 0 0 1 .951-.686l.487.163a.434.434 0 1 1-.274.822l-.297-.098v3.133l.297-.099a.433.433 0 1 1 .274.823l-.487.162a.7.7 0 0 1-.227.037M8.41 12.517a.723.723 0 0 1-.722-.723V6.012a.72.72 0 0 1 1-.667l.467.194a.434.434 0 0 1-.333.801l-.267-.111v5.349l.267-.111a.434.434 0 1 1 .333.8l-.467.195a.7.7 0 0 1-.278.055M14.038 5.752l-3.012-1.39A.722.722 0 0 0 10 5.018v7.77a.72.72 0 0 0 .722.724.7.7 0 0 0 .304-.067l3.012-1.39c.357-.165.588-.526.588-.92V6.672c0-.393-.23-.754-.588-.919" />
        </g>
        <defs>
          <linearGradient
            id="b"
            x1={10.09}
            x2={10.09}
            y1={1.142}
            y2={16.754}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" />
            <stop offset={1} stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <clipPath id="c">
            <path fill="#fff" d="M4.796 3.699h10.408v10.408H4.796z" />
          </clipPath>
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
