import clsx from "clsx"
import React from "react"
import Switch from "../../atoms/switch"
import IconTooltip from "../icon-tooltip"

type SwitchableItemProps = {
  title: string
  description: React.ReactNode
  tooltip?: string
  open: boolean
  onSwitch: () => void
  children: React.ReactNode
}

const SwitchableItem: React.FC<SwitchableItemProps> = ({
  title,
  description,
  tooltip,
  open = false,
  onSwitch,
  children,
}) => {
  return (
    <div>
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-x-2xsmall">
            <p className="inter-base-semibold">{title}</p>
            {tooltip && <IconTooltip content={tooltip} />}
          </div>
          <p className="inter-small-regular text-grey-50 mt-1">{description}</p>
        </div>
        <Switch
          checked={open}
          onClick={onSwitch}
          type="button"
          className="cursor-pointer"
        />
      </div>
      <div
        className={clsx(
          "transition-[max-height,opacity] duration-500 ease-in-out overflow-hidden",
          {
            "max-h-[1000px] opacity-100": open,
            "max-h-0 opacity-0": !open,
          }
        )}
      >
        <div className="mt-base">{children}</div>
      </div>
    </div>
  )
}

export default SwitchableItem
