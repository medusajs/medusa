import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import clsx from "clsx"
import * as React from "react"
import { CheckIcon, ChevronDownIcon } from "../../icons"

export type FilteringOptionProps = {
  title: string
  options: {
    title: string
    count?: number
    onClick: () => void
  }[]
} & React.HTMLAttributes<HTMLDivElement>

export const FilteringOptions = ({
  title,
  options,
  className,
  ...props
}: FilteringOptionProps) => {
  const [selected, setSelected] = React.useState(options?.[0]?.title || "All")
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    console.log(
      selected === "All"
        ? "All"
        : `${selected} (${options?.find((o) => o.title === selected)?.count})`
    )
    console.log(open)
  }, [])

  return (
    <div
      className={clsx(
        "inter-small-regular text-grey-50 mr-6 flex last:mr-0",
        className
      )}
      {...props}
    >
      <span>{title}:</span>
      <DropdownMenu.Root onOpenChange={setOpen}>
        <DropdownMenu.Trigger
          asChild
          className={clsx(
            "inter-small-regular text-grey-50 active:bg-grey-5 hover:bg-grey-5 flex items-center rounded pl-1.5 pr-0.5",
            { "bg-grey-5": open }
          )}
        >
          <div className="align-center flex">
            {selected}
            <div className="text-grey-40 h-min">
              <ChevronDownIcon size={16} />
            </div>
          </div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          sideOffset={8}
          className="bg-grey-0 border-grey-20 rounded-rounded shadow-dropdown border p-2"
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
                "text-grey-90 inter-small-semibold my-1 flex w-48 items-center rounded py-1.5  px-3 hover:border-0 hover:outline-none",
                {
                  "hover:bg-grey-10 cursor-pointer":
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
                className={clsx("ml-3 flex w-full justify-between", {
                  "ml-7": selected !== opt.title,
                  "text-grey-30": (opt.count || 0) < 1,
                })}
              >
                {opt.title}
                <span
                  className={clsx("inter-small-regular ml-3", {
                    "text-grey-30": (opt.count || 0) < 1,
                    "text-grey-40": (opt.count || 0) > 0,
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
