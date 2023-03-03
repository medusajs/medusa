import clsx from "clsx"
import React from "react"
import { useContext } from "react"
import Button from "../../../../../components/fundamentals/button"
import PlusIcon from "../../../../../components/fundamentals/icons/plus-icon"
import { LayeredModalContext } from "../../../../../components/molecules/modal/layered-modal"
import { useAddConditionsModalScreen } from "./add-conditions-screens"
import { useEditConditionContext } from "./edit-condition-provider"

type Props = {
  numberOfSelectedRows: number
  onDeselect: () => void
  onRemove: () => void
}

const ExistingConditionTableActions = ({
  numberOfSelectedRows,
  onDeselect,
  onRemove,
}: Props) => {
  const { condition } = useEditConditionContext()

  const addConditionsModalScreen = useAddConditionsModalScreen(condition)

  const showAddConditions = !!numberOfSelectedRows

  const classes = {
    "translate-y-[-42px]": !showAddConditions,
    "translate-y-[0px]": showAddConditions,
  }

  const { push } = useContext(LayeredModalContext)

  return (
    <div className="flex space-x-xsmall h-[34px] overflow-hidden">
      <div className={clsx("transition-all duration-200", classes)}>
        <div className="divide-x flex items-center h-[34px] mb-2">
          <span className="mr-3 inter-small-regular text-grey-50">
            {numberOfSelectedRows} selected
          </span>
          <div className="flex space-x-xsmall pl-3">
            <Button
              onClick={onDeselect}
              size="small"
              variant="ghost"
              className="border border-grey-20"
            >
              Deselect
            </Button>
            <Button
              onClick={onRemove}
              size="small"
              variant="ghost"
              className="border border-grey-20 text-rose-50"
            >
              Remove
            </Button>
          </div>
        </div>
        <div className="flex justify-end h-[34px]">
          <Button
            size="small"
            variant="ghost"
            className="border border-grey-20"
            onClick={() => push(addConditionsModalScreen)}
          >
            <PlusIcon size={20} /> Add
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ExistingConditionTableActions
