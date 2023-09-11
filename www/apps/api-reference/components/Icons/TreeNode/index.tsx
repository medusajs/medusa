import IconProps from "../types"

const IconTreeNode = ({ iconColorClassName, ...props }: IconProps) => {
  return (
    <svg
      width={props.width || 16}
      height={props.height || 32}
      viewBox="0 0 16 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        width="1"
        height="32"
        rx="0.5"
        className={
          iconColorClassName ||
          "fill-medusa-fg-subtle dark:fill-medusa-fg-subtle-dark"
        }
      />
      <rect
        y="15.5"
        width="16"
        height="1"
        rx="0.5"
        className={
          iconColorClassName ||
          "fill-medusa-fg-subtle dark:fill-medusa-fg-subtle-dark"
        }
      />
    </svg>
  )
}

export default IconTreeNode
