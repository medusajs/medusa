import * as React from "react"
import type { IconProps } from "../types"
const Javascript = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>(
  (props, ref) => {
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
          fill="#F7DF1E"
          d="M11.25.75h-7.5a3 3 0 0 0-3 3v7.5a3 3 0 0 0 3 3h7.5a3 3 0 0 0 3-3v-7.5a3 3 0 0 0-3-3"
        />
        <path
          fill="#000"
          d="M8.953 10.461c.275.448.633.778 1.266.778.532 0 .871-.265.871-.632 0-.439-.349-.594-.934-.85l-.32-.137c-.927-.393-1.542-.887-1.542-1.929 0-.96.733-1.691 1.88-1.691.815 0 1.402.283 1.825 1.025l-1 .64c-.22-.393-.457-.548-.826-.548-.376 0-.614.237-.614.548 0 .384.239.54.79.778l.32.137c1.09.466 1.706.942 1.706 2.01 0 1.153-.908 1.785-2.126 1.785-1.192 0-1.962-.567-2.339-1.31zm-4.533.111c.201.357.385.659.825.659.422 0 .688-.165.688-.805V6.073h1.283v4.37c0 1.326-.779 1.93-1.916 1.93-1.027 0-1.622-.53-1.925-1.17z"
        />
      </svg>
    )
  }
)
Javascript.displayName = "Javascript"
export default Javascript
