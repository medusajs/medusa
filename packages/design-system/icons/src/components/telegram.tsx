import * as React from "react"
import type { IconProps } from "../types"
const Telegram = React.forwardRef<SVGSVGElement, IconProps>(
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
        <path fill="#2AABEE" d="M0 0h20v20H0z" />
        <path fill="url(#a)" fillOpacity={0.2} d="M0 0h20v20H0z" />
        <path
          fill="#fff"
          d="M4.325 9.309a538 538 0 0 1 6.443-2.776c3.07-1.276 3.707-1.498 4.124-1.506.091-.001.295.022.428.129.11.09.141.213.157.3.014.085.033.281.017.434-.166 1.748-.886 5.988-1.252 7.945-.153.828-.459 1.106-.754 1.133-.642.059-1.13-.424-1.75-.832-.973-.637-1.522-1.034-2.466-1.656-1.092-.72-.384-1.114.238-1.76.162-.17 2.99-2.74 3.044-2.974.007-.03.014-.138-.052-.195-.064-.058-.159-.038-.228-.023q-.146.034-4.662 3.081-.66.454-1.198.443c-.394-.009-1.153-.223-1.718-.407-.69-.225-1.241-.344-1.193-.726q.037-.298.822-.61"
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
Telegram.displayName = "Telegram"
export default Telegram
