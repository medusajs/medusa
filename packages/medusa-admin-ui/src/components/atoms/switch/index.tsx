import * as RadixSwitch from "@radix-ui/react-switch"
import clsx from "clsx"
import React from "react"

/**
 * A controlled switch component atom.
 */
function Switch(props: RadixSwitch.SwitchProps) {
  return (
    <RadixSwitch.Root
      {...props}
      disabled={props.disabled}
      className={clsx(
        "w-8 h-[18px] rounded-full transition-bg bg-gray-300 radix-state-checked:bg-violet-60"
      )}
    >
      <RadixSwitch.Thumb
        className={clsx(
          "w-2 h-2 bg-white rounded-full block transition-transform translate-x-[5px] radix-state-checked:translate-x-[19px]"
        )}
      />
    </RadixSwitch.Root>
  )
}

export default Switch
