import React from "react"

const CloseIcon = ({ fill = "black" }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 9 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.05 7.76L0.51 7.22L3.79 3.92L0.51 0.62L1.05 0.0799997L4.33 3.38L7.59 0.0799997L8.13 0.62L4.85 3.92L8.13 7.22L7.59 7.76L4.33 4.48L1.05 7.76Z"
      fill={fill}
    />
  </svg>
)

export default CloseIcon
