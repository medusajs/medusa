import * as React from "react"
import type { IconProps } from "../types"
const DraftOrders = React.forwardRef<SVGSVGElement, IconProps>(
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
        <path fill="#10B981" d="M0 0h20v20H0z" />
        <path fill="url(#a)" fillOpacity={0.2} d="M0 0h20v20H0z" />
        <path
          fill="#fff"
          d="M13.258 16a1 1 0 1 0 0-2.001 1 1 0 0 0 0 2.001M6.753 16a1 1 0 1 0 0-2.002 1 1 0 0 0 0 2.002M3.812 4.694a.75.75 0 0 1 .987-.39l.74.32a1.74 1.74 0 0 1 1.037 1.348l.078.522h2.788l-.877 2.172a1.503 1.503 0 0 0 1.937 1.961l3.029-1.181a3.4 3.4 0 0 0 1.207-.788l.63-.631-.632 3.162a2.26 2.26 0 0 1-2.208 1.81H8.046a2.266 2.266 0 0 1-2.226-1.92l-.554-3.714-.003-.019-.17-1.151a.25.25 0 0 0-.15-.192l-.74-.322a.75.75 0 0 1-.391-.987"
        />
        <path
          fill="#fff"
          d="M14.997 4.283a1.01 1.01 0 0 0-1.4-.003l-2.464 2.464q-.165.165-.253.385l-.42 1.042a.501.501 0 0 0 .645.653l1.01-.393q.229-.09.402-.263l2.485-2.485a.99.99 0 0 0-.004-1.4z"
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
DraftOrders.displayName = "DraftOrders"
export default DraftOrders
