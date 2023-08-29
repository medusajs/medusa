import type IconProps from "../types"

const IconChevronUpDown = ({
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
        d="M6 12.75L9.75 16.5L13.5 12.75M6 6.75L9.75 3L13.5 6.75"
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

export default IconChevronUpDown
