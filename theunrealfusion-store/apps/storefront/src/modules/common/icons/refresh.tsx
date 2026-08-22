import React from "react"

import { IconProps } from "types/icon"

const Refresh: React.FC<IconProps> = ({
  size = "16",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M19.8007 3.33301V8.53308H14.6006"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.2002 12C4.20157 10.4949 4.63839 9.02228 5.45797 7.75984C6.27755 6.4974 7.44488 5.49905 8.81917 4.8852C10.1935 4.27135 11.716 4.06823 13.2031 4.30034C14.6903 4.53244 16.0785 5.18986 17.2004 6.19329L19.8004 8.53332"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.2002 20.6669V15.4668H9.40027"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.8004 12C19.799 13.5051 19.3622 14.9778 18.5426 16.2402C17.7231 17.5026 16.5557 18.501 15.1814 19.1148C13.8072 19.7287 12.2846 19.9318 10.7975 19.6997C9.31033 19.4676 7.9221 18.8102 6.80023 17.8067L4.2002 15.4667"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default Refresh
