import React from "react"
import Badge from "../../../components/fundamentals/badge"
import Actionables, {
  ActionType,
} from "../../../components/molecules/actionables"

type NumberedItemProps = {
  actions?: ActionType[]
  index: number
  title: string
  description?: React.ReactNode | string
}

const NumberedItem: React.FC<NumberedItemProps> = ({
  actions,
  index,
  title,
  description,
}) => {
  return (
    <div className="p-base rounded-rounded gap-base flex items-center justify-between border">
      <div className="gap-base flex w-full overflow-hidden">
        <div>
          <Badge
            className="inter-base-semibold flex h-[40px] w-[40px] items-center justify-center"
            variant="default"
          >
            §{index}
          </Badge>
        </div>
        <div className="flex w-full flex-1 flex-col justify-center truncate">
          <div className="inter-small-semibold">{title}</div>
          {description &&
            (typeof description === "string" ? (
              <div className="inter-small-regular text-grey-50">
                {description}
              </div>
            ) : (
              description
            ))}
        </div>
      </div>
      {actions && (
        <div>
          <Actionables forceDropdown actions={actions} />
        </div>
      )}
    </div>
  )
}

export default NumberedItem
