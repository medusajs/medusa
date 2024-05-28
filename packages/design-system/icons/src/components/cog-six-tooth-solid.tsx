import * as React from "react"
import type { IconProps } from "../types"
const CogSixToothSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path
            fill={color}
            d="m13.434 5.664-.806-.285a6 6 0 0 0-.318-.657c-.117-.202-.263-.378-.401-.56l.163-.874a1.77 1.77 0 0 0-.853-1.853l-.313-.18a1.77 1.77 0 0 0-2.03.187l-.648.555a5.5 5.5 0 0 0-1.443-.009l-.647-.554a1.77 1.77 0 0 0-2.03-.187l-.313.18a1.77 1.77 0 0 0-.852 1.853l.154.829c-.29.376-.51.8-.697 1.243l-.834.295A1.77 1.77 0 0 0 .389 7.312v.36c0 .747.473 1.416 1.177 1.664l.805.285c.093.223.195.443.318.656.117.203.263.379.402.562l-.163.873a1.77 1.77 0 0 0 .853 1.853l.313.18a1.76 1.76 0 0 0 2.03-.187l.644-.551q.37.05.74.05.354 0 .706-.046l.648.555a1.77 1.77 0 0 0 2.03.187l.313-.18c.647-.373.99-1.117.852-1.853l-.154-.83c.29-.376.51-.799.696-1.242l.835-.295a1.77 1.77 0 0 0 1.177-1.665v-.36c0-.747-.473-1.416-1.177-1.664M7.5 10.167a2.666 2.666 0 1 1 0-5.333 2.666 2.666 0 0 1 0 5.333"
          />
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h15v15H0z" />
          </clipPath>
        </defs>
      </svg>
    )
  }
)
CogSixToothSolid.displayName = "CogSixToothSolid"
export default CogSixToothSolid
