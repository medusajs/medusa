import * as RadixSwitch from "@radix-ui/react-switch"
import clsx from "clsx"

/**
 * A controlled switch component atom.
 */
function Switch(props: RadixSwitch.SwitchProps) {
  return (
    <RadixSwitch.Root
      {...props}
      disabled={props.disabled}
      className={clsx(
        "transition-bg radix-state-checked:bg-violet-60 h-[18px] w-8 rounded-full bg-gray-300"
      )}
    >
      <RadixSwitch.Thumb
        className={clsx(
          "radix-state-checked:translate-x-[19px] block h-2 w-2 translate-x-[5px] rounded-full bg-white transition-transform"
        )}
      />
    </RadixSwitch.Root>
  )
}

export default Switch
