import clsx from "clsx"
import React from "react"
import { Controller } from "react-hook-form"
import RadioGroup from "../../../../../components/organisms/radio-group"
import { AllocationType } from "../../../types"
import { useDiscountForm } from "../form/discount-form-context"

const DiscountAllocation = () => {
  const { control } = useDiscountForm()

  return (
    <Controller
      name="rule.allocation"
      control={control}
      rules={{ required: true }}
      render={({ field: { onChange, value } }) => {
        return (
          <RadioGroup.Root
            value={value}
            onValueChange={onChange}
            className={clsx("flex items-center gap-base mt-base px-1")}
          >
            <RadioGroup.Item
              value={AllocationType.TOTAL}
              className="flex-1"
              label="Total amount"
              description="Apply to the total amount"
            />
            <RadioGroup.Item
              value={AllocationType.ITEM}
              className="flex-1"
              label="Item specific"
              description="Apply to every allowed item"
            />
          </RadioGroup.Root>
        )
      }}
    />
  )
}

export default DiscountAllocation
