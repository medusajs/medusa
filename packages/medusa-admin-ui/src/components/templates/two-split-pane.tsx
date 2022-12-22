import clsx from "clsx"
import React, { Children } from "react"
import { useComputedHeight } from "../../hooks/use-computed-height"

type TwoSplitPaneProps = {
  className?: string
  threeCols?: boolean
  children?: React.ReactNode
}

const TwoSplitPane: React.FC<TwoSplitPaneProps> = ({
  threeCols,
  className,
  children,
}) => {
  const childrenCount = Children.count(children)
  const { ref, height } = useComputedHeight(32)

  const heightClass = height
    ? {
      gridTemplateRows: `${height}px`,
    }
    : undefined

  if (childrenCount > 2) {
    throw new Error("TwoSplitPane can only have two or less children")
  }

  return (
    <div
      className={clsx("grid gap-xsmall grid-cols-1", className, {
        "medium:grid-cols-2": !threeCols,
        "medium:grid-cols-3": threeCols,
      })}
      style={heightClass}
      ref={ref}
    >
      {Children.map(children, (child, i) => {
        return (
          <div
            className={clsx("w-full h-full", {
              "col-span-2": threeCols && i === 1,
            })}
            key={i}
          >
            {child}
          </div>
        )
      })}
    </div>
  )
}

export default TwoSplitPane
