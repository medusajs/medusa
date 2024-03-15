import { clx } from "@medusajs/ui"

type SkeletonProps = {
  className?: string
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      className={clx(
        "bg-ui-bg-component h-3 w-3 animate-pulse rounded-[4px]",
        className
      )}
    />
  )
}
