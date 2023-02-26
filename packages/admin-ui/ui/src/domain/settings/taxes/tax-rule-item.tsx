import React from "react"

import Actionables from "../../../components/molecules/actionables"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import Badge from "../../../components/fundamentals/badge"

export const TaxRuleItem = ({ onEdit, onDelete, index, name, description }) => {
  return (
    <div className="p-base border rounded-rounded flex gap-base items-center">
      <div>
        <Badge
          className="inter-base-semibold flex justify-center items-center w-[40px] h-[40px]"
          variant="default"
        >
          §{index}
        </Badge>
      </div>
      <div className="flex-1">
        <div className="inter-small-semibold">{name}</div>
        <div className="inter-small-regular text-grey-50">{description}</div>
      </div>
      <div>
        <Actionables
          forceDropdown
          actions={[
            {
              label: "Edit",
              onClick: () => onEdit(),
              icon: <EditIcon size={20} />,
            },
            {
              label: "Delete rule",
              variant: "danger",
              onClick: () => onDelete(),
              icon: <TrashIcon size={20} />,
            },
          ]}
        />
      </div>
    </div>
  )
}

