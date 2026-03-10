import * as React from "react"
import type { IconProps } from "../types"
const TagIllustration = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
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
        <g filter="url(#a)">
          <path
            fill="#60A5FA"
            d="M12.863 6.686 8.315 2.138A2.16 2.16 0 0 0 6.777 1.5H2.884c-.763 0-1.384.62-1.384 1.384v3.893c0 .581.226 1.127.638 1.538l4.548 4.548c.41.412.957.637 1.537.637s1.128-.226 1.538-.637l3.102-3.102c.412-.41.637-.957.637-1.538 0-.58-.226-1.127-.637-1.537"
          />
          <path
            fill="url(#b)"
            fillOpacity={0.2}
            d="M12.863 6.686 8.315 2.138A2.16 2.16 0 0 0 6.777 1.5H2.884c-.763 0-1.384.62-1.384 1.384v3.893c0 .581.226 1.127.638 1.538l4.548 4.548c.41.412.957.637 1.537.637s1.128-.226 1.538-.637l3.102-3.102c.412-.41.637-.957.637-1.538 0-.58-.226-1.127-.637-1.537"
          />
        </g>
        <path
          stroke="#000"
          strokeOpacity={0.15}
          strokeWidth={0.5}
          d="M2.884 1.75h3.892c.515 0 .998.2 1.363.564l4.548 4.548c.363.364.563.847.563 1.362 0 .45-.153.876-.435 1.218l-.128.142-3.103 3.103a1.9 1.9 0 0 1-1.36.563c-.45 0-.877-.152-1.22-.435l-.142-.128-4.548-4.548a1.91 1.91 0 0 1-.564-1.363V2.884c0-.625.509-1.134 1.134-1.134Z"
        />
        <g filter="url(#c)">
          <path
            fill="#60A5FA"
            d="M5.257 6.246a.99.99 0 0 1-.989-.989.99.99 0 0 1 .989-.989.99.99 0 0 1 .989.99.99.99 0 0 1-.989.988m3.385 3.979a.59.59 0 0 1-.838 0L6.222 8.643a.593.593 0 1 1 .84-.84l1.581 1.582a.593.593 0 0 1 0 .84m1.582-1.582a.59.59 0 0 1-.838 0L7.804 7.06a.593.593 0 1 1 .84-.84l1.581 1.582a.593.593 0 0 1 0 .84"
          />
          <path
            fill="url(#d)"
            fillOpacity={0.15}
            d="M5.257 6.246a.99.99 0 0 1-.989-.989.99.99 0 0 1 .989-.989.99.99 0 0 1 .989.99.99.99 0 0 1-.989.988m3.385 3.979a.59.59 0 0 1-.838 0L6.222 8.643a.593.593 0 1 1 .84-.84l1.581 1.582a.593.593 0 0 1 0 .84m1.582-1.582a.59.59 0 0 1-.838 0L7.804 7.06a.593.593 0 1 1 .84-.84l1.581 1.582a.593.593 0 0 1 0 .84"
          />
        </g>
        <defs>
          <linearGradient
            id="b"
            x1={7.5}
            x2={7.5}
            y1={1.5}
            y2={13.5}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" />
            <stop offset={1} stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <linearGradient
            id="d"
            x1={7.333}
            x2={7.333}
            y1={4.268}
            y2={10.399}
            gradientUnits="userSpaceOnUse"
          >
            <stop />
            <stop offset={1} stopOpacity={0} />
          </linearGradient>
          <filter
            id="a"
            width={12}
            height={12}
            x={1.5}
            y={1.5}
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
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" />
            <feBlend in2="shape" result="effect1_innerShadow_9148_1663" />
          </filter>
          <filter
            id="c"
            width={6.13}
            height={6.13}
            x={4.268}
            y={4.268}
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
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" />
            <feBlend in2="shape" result="effect1_innerShadow_9148_1663" />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dy={0.5} />
            <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
            <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0" />
            <feBlend
              in2="effect1_innerShadow_9148_1663"
              result="effect2_innerShadow_9148_1663"
            />
          </filter>
        </defs>
      </svg>
    )
  }
)
TagIllustration.displayName = "TagIllustration"
export default TagIllustration
