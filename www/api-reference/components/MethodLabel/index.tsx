import clsx from "clsx"

export type MethodLabelProps = {
  method: string
}

const MethodLabel = ({ method }: MethodLabelProps) => {
  return (
    <span
      className={clsx(
        "text-label-x-small mr-0.5 rounded py-[4px] px-0.5 !text-[10px]",
        method === "get" &&
          "bg-medusa-tag-green-bg dark:bg-medusa-tag-green-bg-dark text-medusa-tag-green-text dark:text-medusa-tag-green-text-dark",
        method === "post" &&
          "bg-medusa-tag-blue-bg dark:bg-medusa-tag-blue-bg-dark text-medusa-tag-blue-text dark:text-medusa-tag-blue-text-dark",
        method === "delete" &&
          "bg-medusa-tag-red-bg dark:bg-medusa-tag-red-bg-dark text-medusa-tag-red-text dark:text-medusa-tag-red-text-dark"
      )}
    >
      {method.toUpperCase()}
    </span>
  )
}

export default MethodLabel
