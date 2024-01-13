import { clx } from "@medusajs/ui"
import * as Popover from "@radix-ui/react-popover"

type ComboboxOption = {
  value: string
  label: string
}

type ComboboxProps = {
  size?: "base" | "small"
  options: ComboboxOption[]
  value: string
}

export const Combobox = ({ size = "base" }: ComboboxProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className={clx(
            "bg-ui-bg-field shadow-buttons-neutral transition-fg flex w-full select-none items-center justify-between rounded-md outline-none",
            "data-[placeholder]:text-ui-fg-muted text-ui-fg-base",
            "hover:bg-ui-bg-field-hover",
            "focus:shadow-borders-interactive-with-active data-[state=open]:!shadow-borders-interactive-with-active",
            "aria-[invalid=true]:border-ui-border-error aria-[invalid=true]:shadow-borders-error",
            "invalid::border-ui-border-error invalid:shadow-borders-error",
            "disabled:!bg-ui-bg-disabled disabled:!text-ui-fg-disabled",
            {
              "h-8 px-2 py-1.5 txt-compact-small": size === "base",
              "h-7 px-2 py-1 txt-compact-small": size === "small",
            }
          )}
        ></button>
      </Popover.Trigger>
    </Popover.Root>
  )
}
