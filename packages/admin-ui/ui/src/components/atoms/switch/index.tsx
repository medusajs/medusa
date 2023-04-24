import * as RadixSwitch from "@radix-ui/react-switch"
import clsx from "clsx"
import { forwardRef } from "react"

export interface SwitchProps extends RadixSwitch.SwitchProps {
  label?: string
}

/**
 * A controlled switch component atom.
 */
const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ label, className, ...props }, ref) => (
    <div className={clsx("flex items-center gap-2")}>
      <RadixSwitch.Root
        {...props}
        ref={ref}
        id={props.id || props.name}
        disabled={props.disabled}
        className={clsx(
          "w-8 h-[18px] rounded-full transition-bg !bg-grey-30 radix-state-checked:!bg-violet-60 cursor-pointer"
        )}
      >
        <RadixSwitch.Thumb
          className={clsx(
            "w-2 h-2 bg-white rounded-full block transition-transform translate-x-[5px] radix-state-checked:translate-x-[19px]"
          )}
        />
      </RadixSwitch.Root>
      {label && (
        <label htmlFor={props.id || props.name} className="cursor-pointer">
          {label}
        </label>
      )}
    </div>
  )
)

export default Switch
