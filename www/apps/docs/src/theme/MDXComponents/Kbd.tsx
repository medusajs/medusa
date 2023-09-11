import React from "react"
import clsx from "clsx"

type KbdProps = {
  className?: string
} & React.ComponentProps<"kbd">

const Kbd: React.FC<KbdProps> = ({ children, className, ...props }) => {
  return (
    <kbd
      className={clsx(
        "rounded-sm py-0 px-[6px] border-solid",
        "inline-flex items-center justify-center",
        "border-medusa-tag-neutral-border dark:border-medusa-tag-neutral-border-dark border border-solid",
        "bg-medusa-tag-neutral-bg dark:bg-medusa-tag-neutral-bg-dark",
        "text-medusa-tag-neutral-text dark:text-medusa-tag-neutral-text-dark",
        "text-compact-x-small-plus shadow-none !font-monospace",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  )
}

export default Kbd
