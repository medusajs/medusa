import clsx from "clsx"
import capitalize from "@/utils/capitalize"

export type MethodLabelProps = {
  method: string
  className?: string
}

const MethodLabel = ({ method, className }: MethodLabelProps) => {
  return (
    <span
      className={clsx(
        "text-compact-x-small-plus rounded-sm border py-0 px-[6px]",
        method === "get" &&
          "bg-medusa-tag-green-bg dark:bg-medusa-tag-green-bg-dark text-medusa-tag-green-text dark:text-medusa-tag-green-text-dark border-medusa-tag-green-border dark:border-medusa-tag-green-border-dark",
        method === "post" &&
          "bg-medusa-tag-blue-bg dark:bg-medusa-tag-blue-bg-dark text-medusa-tag-blue-text dark:text-medusa-tag-blue-text-dark border-medusa-tag-blue-border dark:border-medusa-tag-blue-border-dark",
        method === "delete" &&
          "bg-medusa-tag-red-bg dark:bg-medusa-tag-red-bg-dark text-medusa-tag-red-text dark:text-medusa-tag-red-text-dark border-medusa-tag-red-border dark:border-medusa-tag-red-border-dark",
        className
      )}
    >
      {method === "delete" ? "Del" : capitalize(method)}
    </span>
  )
}

export default MethodLabel
