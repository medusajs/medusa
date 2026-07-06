import * as React from "react"
import type { IconProps } from "../types"
const AiAssistentLuminosity = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={15}
        height={16}
        viewBox="0 0 15 16"
        fill="none"
        ref={ref}
        {...props}
      >
        <g filter="url(#a)">
          <circle cx={7.5} cy={7.5} r={7.11} fill="url(#b)" />
          <circle cx={7.5} cy={7.5} r={7.11} fill="url(#c)" />
        </g>
        <g
          filter="url(#d)"
          opacity={0.8}
          style={{
            mixBlendMode: "plus-lighter",
          }}
        >
          <circle cx={7.5} cy={5} r={4} fill="url(#e)" />
          <circle cx={7.5} cy={5} r={3.9} stroke="url(#f)" strokeWidth={0.2} />
        </g>
        <g
          filter="url(#g)"
          opacity={0.8}
          style={{
            mixBlendMode: "plus-lighter",
          }}
        >
          <circle cx={10} cy={8.5} r={4} fill="url(#h)" />
          <circle cx={10} cy={8.5} r={3.9} stroke="url(#i)" strokeWidth={0.2} />
        </g>
        <g
          filter="url(#j)"
          opacity={0.8}
          style={{
            mixBlendMode: "plus-lighter",
          }}
          transform="matrix(-1 0 0 1 9 2.5)"
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
          transform="matrix(0 -1 -1 0 11.5 11.5)"
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
          transform="matrix(-1 0 0 1 11.5 6)"
        >
          <circle cx={4} cy={4} r={4} fill="url(#q)" />
          <circle cx={4} cy={4} r={3.9} stroke="url(#r)" strokeWidth={0.2} />
        </g>
        <circle
          cx={7.5}
          cy={7.5}
          r={7.11}
          fill={color}
          style={{
            mixBlendMode: "color",
          }}
        />
        <defs>
          <linearGradient
            id="b"
            x1={7.5}
            x2={7.5}
            y1={0.39}
            y2={14.61}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset={0.2} stopColor="#C686FF" />
            <stop offset={0.8} stopColor="#8D99FF" />
          </linearGradient>
          <linearGradient
            id="c"
            x1={3.115}
            x2={11.463}
            y1={7.468}
            y2={10.558}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF6778" stopOpacity={0.8} />
            <stop offset={1} stopColor="#fff" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient
            id="e"
            x1={7.5}
            x2={11.5}
            y1={5}
            y2={5}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#8D99FF" stopOpacity={0.1} />
            <stop offset={1} stopColor="#fff" stopOpacity={0.3} />
          </linearGradient>
          <linearGradient
            id="f"
            x1={11.5}
            x2={7.5}
            y1={5}
            y2={5}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" />
            <stop offset={1} stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <linearGradient
            id="h"
            x1={10}
            x2={14}
            y1={8.5}
            y2={8.5}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#8D99FF" stopOpacity={0.1} />
            <stop offset={1} stopColor="#fff" stopOpacity={0.3} />
          </linearGradient>
          <linearGradient
            id="i"
            x1={14}
            x2={10}
            y1={8.5}
            y2={8.5}
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
            width={15.47}
            height={15.22}
            x={0.14}
            y={0.39}
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dy={0.25} />
            <feGaussianBlur stdDeviation={0.125} />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
            <feBlend
              in2="BackgroundImageFix"
              result="effect1_dropShadow_9187_11750"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect1_dropShadow_9187_11750"
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
            <feBlend in2="shape" result="effect2_innerShadow_9187_11750" />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dx={0.25} dy={0.25} />
            <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0" />
            <feBlend
              in2="effect2_innerShadow_9187_11750"
              result="effect3_innerShadow_9187_11750"
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
              in2="effect3_innerShadow_9187_11750"
              result="effect4_innerShadow_9187_11750"
            />
          </filter>
          <filter
            id="d"
            width={9}
            height={9}
            x={3}
            y={0.5}
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
              result="effect1_foregroundBlur_9187_11750"
              stdDeviation={0.25}
            />
          </filter>
          <filter
            id="g"
            width={9}
            height={9}
            x={5.5}
            y={4}
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
              result="effect1_foregroundBlur_9187_11750"
              stdDeviation={0.25}
            />
          </filter>
          <filter
            id="j"
            width={9}
            height={9}
            x={0.5}
            y={2}
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
              result="effect1_foregroundBlur_9187_11750"
              stdDeviation={0.25}
            />
          </filter>
          <filter
            id="m"
            width={9}
            height={9}
            x={3}
            y={3}
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
              result="effect1_foregroundBlur_9187_11750"
              stdDeviation={0.25}
            />
          </filter>
          <filter
            id="p"
            width={9}
            height={9}
            x={3}
            y={5.5}
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
              result="effect1_foregroundBlur_9187_11750"
              stdDeviation={0.25}
            />
          </filter>
        </defs>
      </svg>
    )
  }
)
AiAssistentLuminosity.displayName = "AiAssistentLuminosity"
export default AiAssistentLuminosity
