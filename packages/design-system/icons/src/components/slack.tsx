import * as React from "react"
import type { IconProps } from "../types"
const Slack = React.forwardRef<SVGSVGElement, IconProps>(
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
          fill="#E01E5A"
          d="M6.51 11.608a1.254 1.254 0 1 1-2.51 0c0-.694.561-1.255 1.255-1.255H6.51zm.628 0a1.254 1.254 0 1 1 2.51 0v3.137a1.254 1.254 0 1 1-2.51 0z"
        />
        <path
          fill="#36C5F0"
          d="M8.394 6.506a1.252 1.252 0 1 1 0-2.506c.693 0 1.253.56 1.253 1.253v1.253zm0 .635a1.252 1.252 0 1 1 0 2.506H5.253a1.252 1.252 0 1 1 0-2.506z"
        />
        <path
          fill="#2EB67D"
          d="M13.49 8.395c0-.693.562-1.253 1.256-1.253a1.253 1.253 0 1 1 0 2.505H13.49zm-.627 0c0 .693-.56 1.252-1.255 1.252s-1.255-.56-1.255-1.252V5.253c0-.693.561-1.253 1.255-1.253s1.255.56 1.255 1.253z"
        />
        <path
          fill="#ECB22E"
          d="M11.606 13.49c.693 0 1.253.561 1.253 1.255a1.253 1.253 0 1 1-2.505 0V13.49zm0-.627c-.692 0-1.252-.561-1.252-1.255s.56-1.255 1.252-1.255h3.142c.693 0 1.252.56 1.252 1.255s-.56 1.255-1.252 1.255z"
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
Slack.displayName = "Slack"
export default Slack
