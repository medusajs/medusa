import * as React from "react"
import type { IconProps } from "../types"
const Photo = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g clipPath="url(#a)">
          <g fill={color} clipPath="url(#b)">
            <path d="M5.722 4.833c0 .49.399.89.889.89s.889-.4.889-.89a.89.89 0 0 0-.89-.889.89.89 0 0 0-.888.89" />
            <path
              fillRule="evenodd"
              d="M5.5 1.194a2.53 2.53 0 0 0-2.528 2.528v4.89A2.53 2.53 0 0 0 5.5 11.138h6.666a2.53 2.53 0 0 0 2.528-2.528V3.722a2.53 2.53 0 0 0-2.528-2.528zM4.472 3.722c0-.567.46-1.028 1.028-1.028h6.666c.568 0 1.028.46 1.028 1.028v2.933L11.77 5.23a1.64 1.64 0 0 0-2.318 0L5.113 9.563a1.03 1.03 0 0 1-.641-.953zm6.237 2.569 2.474 2.474a1.03 1.03 0 0 1-1.017.874H7.161l3.352-3.348a.14.14 0 0 1 .196 0"
              clipRule="evenodd"
            />
            <path d="M1.805 5.5a.75.75 0 0 0-1.5 0v5.778a2.527 2.527 0 0 0 2.528 2.528h7.556a.75.75 0 0 0 0-1.5H2.833c-.568 0-1.028-.46-1.028-1.028z" />
          </g>
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h15v15H0z" />
          </clipPath>
          <clipPath id="b">
            <path fill="#fff" d="M-.5-.5h16v16h-16z" />
          </clipPath>
        </defs>
      </svg>
    )
  }
)
Photo.displayName = "Photo"
export default Photo
