import type IconProps from "../types"

const IconChevronDownMini = ({ iconColorClassName, ...props }: IconProps) => {
  return (
    <svg
      width={props.width || 20}
      height={props.height || 20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15 8L10 13L5 8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={
          iconColorClassName ||
          "stroke-medusa-fg-subtle dark:stroke-medusa-fg-subtle-dark"
        }
      />
    </svg>
  )
}

export default IconChevronDownMini
