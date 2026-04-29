import { Button, clx } from "@medusajs/ui"
import { ReactNode } from "react"

export type SegmentedControlOption = {
  value: string
  label: ReactNode
}

type SegmentedControlProps = {
  value: string
  onValueChange: (value: string) => void
  options: SegmentedControlOption[]
  className?: string
}

export const SegmentedControl = ({
  value,
  onValueChange,
  options,
  className,
}: SegmentedControlProps) => {
  return (
    <div
      className={clx(
        "bg-ui-bg-disabled grid items-center gap-x-[1px] rounded-md p-[1px]",
        className
      )}
      style={{
        gridTemplateColumns: `repeat(${options.length}, 1fr)`,
      }}
    >
      {options.map((option) => {
        const isSelected = value === option.value

        return (
          <Button
            key={option.value}
            size="small"
            onClick={() => onValueChange(option.value)}
            variant={isSelected ? "secondary" : "transparent"}
            type="button"
            className={clx(
              "w-auto",
              !isSelected && "hover:text-ui-fg-base text-ui-fg-muted"
            )}
          >
            {option.label}
          </Button>
        )
      })}
    </div>
  )
}
