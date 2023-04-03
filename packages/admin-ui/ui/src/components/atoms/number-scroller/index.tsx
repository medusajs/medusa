import clsx from "clsx"
import React from "react"

type NumberScrollerProps = {
  numbers: number[]
  selected: number
  onSelect: (value: number) => void
} & React.HTMLAttributes<HTMLDivElement>

const NumberScroller: React.FC<NumberScrollerProps> = ({
  numbers,
  selected,
  onSelect,
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={clsx(
        "time-list flex h-[305px] flex-col overflow-y-auto",
        className
      )}
    >
      {numbers.map((n, i) => {
        return (
          <div
            key={i}
            className={clsx(
              "inter-base-regular hover:bg-grey-20 h-[40px] w-[40px] rounded last:mb-4",
              {
                "bg-violet-60 text-grey-0 inter-base-semibold hover:bg-violet-50":
                  n === selected,
              }
            )}
          >
            <button
              onClick={() => onSelect(n)}
              className="h-full w-full py-2"
              type="button"
            >
              {n.toLocaleString("en-US", { minimumIntegerDigits: 2 })}
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default NumberScroller
