import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import clsx from "clsx"
import React, { useState } from "react"
import CheckIcon from "../../fundamentals/icons/check-icon"
import ChevronDownIcon from "../../fundamentals/icons/chevron-down"

export type FilteringOptionProps = {
  title: string
  options: {
    title: string
    count?: number
    onClick: () => void
  }[]
} & React.HTMLAttributes<HTMLDivElement>

const FilteringOptions: React.FC<FilteringOptionProps> = ({
  title,
  options,
  className,
  ...props
}) => {
  const [selected, setSelected] = useState(options?.[0]?.title || "All")
  const [open, setOpen] = useState(false)
  return (
    <div
      className={clsx(
        "inter-small-regular flex text-grey-50 mr-6 last:mr-0",
        className
      )}
      {...props}
    >
      <span className="">{title}:</span>
      <DropdownMenu.Root onOpenChange={setOpen}>
        <DropdownMenu.Trigger
          asChild
          className={clsx(
            "inter-small-regular text-grey-50 flex items-center pl-1.5 pr-0.5 rounded active:bg-grey-5 hover:bg-grey-5",
            { "bg-grey-5": open }
          )}
        >
          <div className="flex align-center">
            {selected}
            <div className="text-grey-40 h-min">
              <ChevronDownIcon size={16} />
            </div>
          </div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          sideOffset={8}
          className="bg-grey-0 p-2 border border-grey-20 rounded-rounded shadow-dropdown"
        >
          {options.map((opt, idx) => (
            <DropdownMenu.DropdownMenuItem
              key={`${idx}-${opt.title}`}
              onSelect={() => {
                opt.onClick()
                setSelected(opt.title)
              }}
              disabled={typeof opt.count !== "undefined" && opt.count < 1}
              className={clsx(
                "py-1.5 my-1 w-48 px-3 flex items-center rounded text-grey-90  hover:border-0 hover:outline-none inter-small-semibold",
                {
                  "cursor-pointer hover:bg-grey-10":
                    typeof opt.count === "undefined" || opt.count > 0,
                }
              )}
            >
              {selected === opt.title && (
                <span className="w-4">
                  <CheckIcon size={16} />
                </span>
              )}
              <div
                className={clsx("ml-3 w-full flex justify-between", {
                  "ml-7": selected !== opt.title,
                  "text-grey-30": opt.count < 1,
                })}
              >
                {opt.title}
                <span
                  className={clsx("inter-small-regular text-grey-40 ml-3", {
                    "text-grey-30": opt.count < 1,
                  })}
                >
                  {opt.count}
                </span>
              </div>
            </DropdownMenu.DropdownMenuItem>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}

export default FilteringOptions
