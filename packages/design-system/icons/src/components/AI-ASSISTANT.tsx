import * as React from "react"
import type { IconProps } from "../types"
const AIAssistant = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={19}
        height={19}
        fill="none"
        ref={ref}
        {...props}
      >
        <g filter="url(#a)">
          <circle cx={9.5} cy={8.457} r={7.414} fill="url(#b)" />
          <circle cx={9.5} cy={8.457} r={7.414} fill="url(#c)" />
        </g>
        <g
          filter="url(#d)"
          opacity={0.8}
          style={{
            mixBlendMode: "plus-lighter",
          }}
        >
          <circle cx={9.5} cy={5.85} r={4.171} fill="url(#e)" />
          <circle
            cx={9.5}
            cy={5.85}
            r={4.071}
            stroke="url(#f)"
            strokeWidth={0.2}
          />
        </g>
        <g
          filter="url(#g)"
          opacity={0.8}
          style={{
            mixBlendMode: "plus-lighter",
          }}
        >
          <circle cx={12.107} cy={9.5} r={4.171} fill="url(#h)" />
          <circle
            cx={12.107}
            cy={9.5}
            r={4.071}
            stroke="url(#i)"
            strokeWidth={0.2}
          />
        </g>
        <g
          filter="url(#j)"
          opacity={0.8}
          style={{
            mixBlendMode: "plus-lighter",
          }}
          transform="matrix(-1.0428 0 0 1.0428 11.064 3.243)"
        >
          <circle cx={4} cy={4} r={4} fill="url(#k)" />
          <circle cx={4} cy={4} r={3.9} stroke="url(#l)" strokeWidth={0.2} />
        </g>
        <g
          filter="url(#m)"
          opacity={0.8}
          style={{
            mixBlendMode: "plus-lighter",
          }}
          transform="scale(1.0428 -1.0428)rotate(90 12.61 .5)"
        >
          <circle cx={4} cy={4} r={4} fill="url(#n)" />
          <circle cx={4} cy={4} r={3.9} stroke="url(#o)" strokeWidth={0.2} />
        </g>
        <g
          filter="url(#p)"
          opacity={0.8}
          style={{
            mixBlendMode: "plus-lighter",
          }}
          transform="matrix(-1.0428 0 0 1.0428 13.67 6.893)"
        >
          <circle cx={4} cy={4} r={4} fill="url(#q)" />
          <circle cx={4} cy={4} r={3.9} stroke="url(#r)" strokeWidth={0.2} />
        </g>
        <defs>
          <linearGradient
            id="b"
            x1={9.589}
            x2={9.589}
            y1={1.087}
            y2={15.916}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset={0.2} stopColor="#C686FF" />
            <stop offset={0.8} stopColor="#8D99FF" />
          </linearGradient>
          <linearGradient
            id="c"
            x1={5.017}
            x2={13.721}
            y1={8.468}
            y2={11.691}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF6778" stopOpacity={0.8} />
            <stop offset={1} stopColor="#fff" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient
            id="e"
            x1={9.728}
            x2={13.899}
            y1={5.922}
            y2={5.922}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#8D99FF" stopOpacity={0.1} />
            <stop offset={1} stopColor="#fff" stopOpacity={0.3} />
          </linearGradient>
          <linearGradient
            id="f"
            x1={13.899}
            x2={9.728}
            y1={5.922}
            y2={5.922}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" />
            <stop offset={1} stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <linearGradient
            id="h"
            x1={12.446}
            x2={16.618}
            y1={9.728}
            y2={9.728}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#8D99FF" stopOpacity={0.1} />
            <stop offset={1} stopColor="#fff" stopOpacity={0.3} />
          </linearGradient>
          <linearGradient
            id="i"
            x1={16.618}
            x2={12.446}
            y1={9.728}
            y2={9.728}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#8D99FF" />
            <stop offset={1} stopColor="#8D99FF" stopOpacity={0} />
          </linearGradient>
          <linearGradient
            id="k"
            x1={4}
            x2={8}
            y1={4}
            y2={4}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#8D99FF" stopOpacity={0.1} />
            <stop offset={1} stopColor="#fff" stopOpacity={0.3} />
          </linearGradient>
          <linearGradient
            id="l"
            x1={8}
            x2={4}
            y1={4}
            y2={4}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#8D99FF" />
            <stop offset={1} stopColor="#8D99FF" stopOpacity={0} />
          </linearGradient>
          <linearGradient
            id="n"
            x1={4}
            x2={8}
            y1={4}
            y2={4}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#8D99FF" stopOpacity={0.1} />
            <stop offset={1} stopColor="#fff" stopOpacity={0.3} />
          </linearGradient>
          <linearGradient
            id="o"
            x1={8}
            x2={4}
            y1={4}
            y2={4}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#8D99FF" />
            <stop offset={1} stopColor="#8D99FF" stopOpacity={0} />
          </linearGradient>
          <linearGradient
            id="q"
            x1={4}
            x2={8}
            y1={4}
            y2={4}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#8D99FF" stopOpacity={0.1} />
            <stop offset={1} stopColor="#fff" stopOpacity={0.3} />
          </linearGradient>
          <linearGradient
            id="r"
            x1={8}
            x2={4}
            y1={4}
            y2={4}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" />
            <stop offset={1} stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <filter
            id="a"
            width={19}
            height={19}
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
            <feOffset dy={1} />
            <feGaussianBlur stdDeviation={1} />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
            <feBlend
              in2="BackgroundImageFix"
              result="effect1_dropShadow_7446_46535"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect1_dropShadow_7446_46535"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dx={-0.25} dy={-0.25} />
            <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
            <feBlend in2="shape" result="effect2_innerShadow_7446_46535" />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dx={0.25} dy={0.25} />
            <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0" />
            <feBlend
              in2="effect2_innerShadow_7446_46535"
              result="effect3_innerShadow_7446_46535"
            />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dx={1} dy={1} />
            <feGaussianBlur stdDeviation={1} />
            <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
            <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0" />
            <feBlend
              in2="effect3_innerShadow_7446_46535"
              result="effect4_innerShadow_7446_46535"
            />
          </filter>
          <filter
            id="d"
            width={9.385}
            height={9.385}
            x={4.807}
            y={1.158}
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              result="effect1_foregroundBlur_7446_46535"
              stdDeviation={0.25}
            />
          </filter>
          <filter
            id="g"
            width={9.385}
            height={9.385}
            x={7.414}
            y={4.807}
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              result="effect1_foregroundBlur_7446_46535"
              stdDeviation={0.25}
            />
          </filter>
          <filter
            id="j"
            width={9.385}
            height={9.385}
            x={2.2}
            y={2.722}
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              result="effect1_foregroundBlur_7446_46535"
              stdDeviation={0.25}
            />
          </filter>
          <filter
            id="m"
            width={9.385}
            height={9.385}
            x={4.807}
            y={3.765}
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              result="effect1_foregroundBlur_7446_46535"
              stdDeviation={0.25}
            />
          </filter>
          <filter
            id="p"
            width={9.385}
            height={9.385}
            x={4.807}
            y={6.372}
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              result="effect1_foregroundBlur_7446_46535"
              stdDeviation={0.25}
            />
          </filter>
        </defs>
      </svg>
    )
  }
)
AIAssistant.displayName = "AIAssistant"
export default AIAssistant
