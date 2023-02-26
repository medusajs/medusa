import React from "react"
import IconProps from "../types/icon-type"

const UsersIcon: React.FC<IconProps> = ({
  size = "24",
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
        d="M16.3333 19V17.3333C16.3333 16.4493 15.9821 15.6014 15.357 14.9763C14.7319 14.3512 13.8841 14 13 14H6.33333C5.44928 14 4.60143 14.3512 3.97631 14.9763C3.35119 15.6014 3 16.4493 3 17.3333V19"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.66634 10.6667C11.5073 10.6667 12.9997 9.17428 12.9997 7.33333C12.9997 5.49238 11.5073 4 9.66634 4C7.82539 4 6.33301 5.49238 6.33301 7.33333C6.33301 9.17428 7.82539 10.6667 9.66634 10.6667Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.333 19V17.3333C21.3325 16.5948 21.0866 15.8773 20.6341 15.2936C20.1817 14.7099 19.5481 14.293 18.833 14.1083"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 4.10834C16.217 4.29192 16.8525 4.70892 17.3064 5.2936C17.7602 5.87827 18.0065 6.59736 18.0065 7.3375C18.0065 8.07765 17.7602 8.79674 17.3064 9.38141C16.8525 9.96609 16.217 10.3831 15.5 10.5667"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default UsersIcon
