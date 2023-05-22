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
    <section className={clsx("cards-grid", `grid-${colSize}`, className)}>
      {children}
    </section>
  )
}

export default LargeCardList
