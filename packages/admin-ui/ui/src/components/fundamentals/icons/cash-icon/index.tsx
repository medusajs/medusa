import React from "react"
import IconProps from "../types/icon-type"

const CashIcon: React.FC<IconProps> = ({
  size = "20",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M3.75 7.5H2.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.75 12.5H2.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.33366 10H1.66699"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.69727 4.6967C5.74616 3.64781 7.08253 2.9335 8.53739 2.64411C9.99225 2.35472 11.5002 2.50325 12.8707 3.07091C14.2411 3.63856 15.4125 4.59986 16.2366 5.83323C17.0607 7.0666 17.5006 8.51664 17.5006 10C17.5006 11.4834 17.0607 12.9334 16.2366 14.1668C15.4125 15.4001 14.2411 16.3614 12.8707 16.9291C11.5002 17.4968 9.99225 17.6453 8.53739 17.3559C7.08253 17.0665 5.74616 16.3522 4.69727 15.3033"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 6.25V7.00737"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.125 8.52196C8.17767 8.07456 8.40336 7.66555 8.75379 7.38246C9.10421 7.09936 9.55152 6.96468 10 7.00722"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 13.7501V12.9927"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.875 11.4778C11.8223 11.9252 11.5966 12.3343 11.2462 12.6174C10.8958 12.9004 10.4485 13.0351 10 12.9926"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.8273 8.19148C11.6899 7.8243 11.4381 7.51099 11.1091 7.29776C10.7801 7.08453 10.3913 6.98266 10 7.00718"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.17188 11.8083C8.30928 12.1755 8.56105 12.4888 8.89004 12.702C9.21904 12.9152 9.60785 13.0171 9.99913 12.9926"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.125 8.52216C8.125 8.83316 8.23276 9.13455 8.42993 9.37506C8.6271 9.61556 8.90151 9.78033 9.20647 9.84132L10.7935 10.1587C11.0985 10.2197 11.3729 10.3845 11.5701 10.625C11.7672 10.8655 11.875 11.1669 11.875 11.4779"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default CashIcon
