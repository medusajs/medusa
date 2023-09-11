import type IconProps from "../types"

const IconCheckMini = ({
  iconColorClassName,
  containerClassName,
  ...props
}: IconProps) => {
  return (
    <svg
      width={props.width || 20}
      height={props.height || 20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={containerClassName}
      {...props}
    >
      <path
        d="M5.83334 10.4167L9.16668 13.75L14.1667 6.25"
        className={
          iconColorClassName ||
          "stroke-medusa-fg-subtle dark:stroke-medusa-fg-subtle-dark"
        }
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default IconCheckMini
