import React from "react"
import clsx from "clsx"

type LargeCardListProps = {
  colSize?: string
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

const LargeCardList: React.FC<LargeCardListProps> = ({
  colSize = "4",
  className,
  children,
}) => {
  return (
    <section
      className={clsx(
        "cards-grid",
        `grid-${colSize}`,
        "gap-1",
        "[&+*:not(.large-card)]:mt-2",
        "[&+.large-card]:mt-1",
        className
      )}
    >
      {children}
    </section>
  )
}

export default LargeCardList
