import { clx } from "@medusajs/ui"

type SkeletonProps = {
  className?: string
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      className={clx(
        "bg-ui-bg-component animate-pulse w-3 h-3 rounded-[4px]",
        className
      )}
    />
  )
}
