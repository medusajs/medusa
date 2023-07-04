import React from "react"
import RadioGroup from "../../../../../../components/organisms/radio-group"
import { DiscountConditionOperator } from "../../../../types"

type ConditionOperatorProps = {
  value: "in" | "not_in"
  onChange: (value: DiscountConditionOperator) => void
}

const ConditionOperator: React.FC<ConditionOperatorProps> = ({
  value,
  onChange,
}) => {
  return (
    <RadioGroup.Root
      value={value}
      onValueChange={onChange}
      className="gap-base mb-4 grid grid-cols-2"
    >
      <RadioGroup.Item
        className="w-full"
        label="In"
        value={DiscountConditionOperator.IN}
        description="Applies to the selected items."
      />
      <RadioGroup.Item
        className="w-full"
        label="Not in"
        value={DiscountConditionOperator.NOT_IN}
        description="Applies to all items except the selected items."
      />
    </RadioGroup.Root>
  )
}

export default ConditionOperator
