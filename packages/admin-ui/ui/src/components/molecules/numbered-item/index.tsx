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
    <div className="p-base border rounded-rounded flex gap-base justify-between items-center">
      <div className="flex overflow-hidden gap-base w-full">
        <div>
          <Badge
            className="inter-base-semibold flex justify-center items-center w-[40px] h-[40px]"
            variant="default"
          >
            §{index}
          </Badge>
        </div>
        <div className="truncate flex flex-col justify-center flex-1 w-full">
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
