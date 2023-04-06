import { FC } from "react"
import IconProps from "./types/icon-type"

type WarningCircleIconProps = IconProps & {
  fillType?: "solid" | "outline"
}

const WarningCircleIcon: FC<WarningCircleIconProps> = ({
  fillType = "outline",
  ...attributes
}) => {
  if (fillType === "outline") {
    return <WarningCircle {...attributes} />
  } else {
    return <ExclamationCircle {...attributes} />
  }
}

const ExclamationCircle: FC<IconProps> = ({
  size = "24",
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 10C18 12.1217 17.1571 14.1566 15.6569 15.6569C14.1566 17.1571 12.1217 18 10 18C7.87827 18 5.84344 17.1571 4.34315 15.6569C2.84285 14.1566 2 12.1217 2 10C2 7.87827 2.84285 5.84344 4.34315 4.34315C5.84344 2.84285 7.87827 2 10 2C12.1217 2 14.1566 2.84285 15.6569 4.34315C17.1571 5.84344 18 7.87827 18 10ZM10 5C10.1989 5 10.3897 5.07902 10.5303 5.21967C10.671 5.36032 10.75 5.55109 10.75 5.75V10.25C10.75 10.4489 10.671 10.6397 10.5303 10.7803C10.3897 10.921 10.1989 11 10 11C9.80109 11 9.61032 10.921 9.46967 10.7803C9.32902 10.6397 9.25 10.4489 9.25 10.25V5.75C9.25 5.55109 9.32902 5.36032 9.46967 5.21967C9.61032 5.07902 9.80109 5 10 5ZM10 15C10.2652 15 10.5196 14.8946 10.7071 14.7071C10.8946 14.5196 11 14.2652 11 14C11 13.7348 10.8946 13.4804 10.7071 13.2929C10.5196 13.1054 10.2652 13 10 13C9.73478 13 9.48043 13.1054 9.29289 13.2929C9.10536 13.4804 9 13.7348 9 14C9 14.2652 9.10536 14.5196 9.29289 14.7071C9.48043 14.8946 9.73478 15 10 15Z"
        fill={color}
      />
    </svg>
  )
}

const WarningCircle: FC<IconProps> = (props) => {
  const { fill, size, ...attributes } = props
  const line = fill || "#111827"

  return (
    <svg
      width={size || 24}
      height={size || 24}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
        stroke={line}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 6.66699V10.0003"
        stroke={line}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 13.333H10.0088"
        stroke={line}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default WarningCircleIcon
