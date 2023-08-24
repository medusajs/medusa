import React from "react"
import clsx from "clsx"

type KbdProps = {
  className?: string
} & React.ComponentProps<"kbd">

const Kbd: React.FC<KbdProps> = ({ children, className, ...props }) => {
  return (
    <kbd
      className={clsx(
        "h-[22px] w-[22px] rounded-sm p-0 border-solid",
        "inline-flex items-center justify-center",
        "border-medusa-tag-neutral-border dark:border-medusa-tag-neutral-border-dark border",
        "bg-medusa-tag-neutral-bg dark:bg-medusa-tag-neutral-bg-dark",
        "text-medusa-tag-neutral-text dark:text-medusa-tag-neutral-text-dark",
        "text-compact-x-small-plus shadow-none",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  )
}

export default Kbd
