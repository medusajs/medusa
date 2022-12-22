import React from "react"
import IconProps from "../types/icon-type"

const MedusaIcon: React.FC<IconProps> = ({ size = "48", ...attributes }) => {
  const width = +size * 0.9375 // width relative to height (from size prop)
  return (
    <svg
      width={width}
      height={size}
      viewBox="0 0 45 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M38.8535 7.79156L28.0165 1.5383C24.4707 -0.512767 20.1259 -0.512767 16.5802 1.5383L5.69318 7.79156C2.19737 9.84263 0 13.6446 0 17.6967V30.2533C0 34.3554 2.19737 38.1073 5.69318 40.1584L16.5302 46.4617C20.076 48.5128 24.4208 48.5128 27.9665 46.4617L38.8036 40.1584C42.3493 38.1073 44.4967 34.3554 44.4967 30.2533V17.6967C44.5966 13.6446 42.3992 9.84263 38.8535 7.79156ZM22.2733 35.1558C16.1307 35.1558 11.1367 30.1532 11.1367 24C11.1367 17.8468 16.1307 12.8442 22.2733 12.8442C28.416 12.8442 33.4599 17.8468 33.4599 24C33.4599 30.1532 28.4659 35.1558 22.2733 35.1558Z"
        fill="#8B5CF6"
      />
    </svg>
  )
}

export default MedusaIcon
