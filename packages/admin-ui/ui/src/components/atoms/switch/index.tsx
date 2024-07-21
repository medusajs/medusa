import * as RadixSwitch from "@radix-ui/react-switch"
import clsx from "clsx"
import React from "react"
import i18n from "../../../i18n"

/**
 * A controlled switch component atom.
 */
const Switch = React.forwardRef<HTMLButtonElement, RadixSwitch.SwitchProps>(
  (props, ref) => {
    const isRtl = i18n.dir() == "rtl" ? true : false
    return (
      <RadixSwitch.Root
        ref={ref}
        {...props}
        className={clsx(
          "transition-bg radix-state-checked:bg-violet-60 h-[18px] w-8 rounded-full bg-gray-300"
        )}
      >
        <RadixSwitch.Thumb
          className={clsx(
            "block h-2 w-2 rounded-full bg-white transition-transform",
            {
              "translate-x-[5px] radix-state-checked:translate-x-[19px]":
                !isRtl,
              "-translate-x-[19px] radix-state-checked:-translate-x-[5px] ":
                isRtl,
            }
          )}
        />
      </RadixSwitch.Root>
    )
  }
)

Switch.displayName = "Switch"

export default Switch
