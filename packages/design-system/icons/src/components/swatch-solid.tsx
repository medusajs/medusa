import * as React from "react"
import type { IconProps } from "../types"
const SwatchSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
        <path
          fill={color}
          fillRule="evenodd"
          d="M1.875 3.438c0-.864.7-1.563 1.563-1.563h4.374c.864 0 1.563.7 1.563 1.563v10.937a3.75 3.75 0 1 1-7.5 0V3.437Zm3.75 11.874a.938.938 0 1 0 0-1.875.938.938 0 0 0 0 1.876Z"
          clipRule="evenodd"
        />
        <path
          fill={color}
          d="M8.932 18.125h7.63c.864 0 1.563-.7 1.563-1.563v-4.375c0-.863-.7-1.562-1.563-1.562h-.116L9.16 17.91c-.075.074-.15.146-.229.214Zm1.683-3.438 5.395-5.395a1.562 1.562 0 0 0 0-2.209L12.917 3.99a1.563 1.563 0 0 0-2.21 0l-.083.083v10.303c0 .105-.002.21-.008.312h-.001Z"
        />
      </svg>
    )
  }
)
SwatchSolid.displayName = "SwatchSolid"
export default SwatchSolid
