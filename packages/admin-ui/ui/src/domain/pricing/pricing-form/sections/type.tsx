import { Controller } from "react-hook-form"
import Accordion from "../../../../components/organisms/accordion"
import RadioGroup from "../../../../components/organisms/radio-group"
import { usePriceListForm } from "../form/pricing-form-context"
import { PriceListType } from "../types"

const Type = () => {
  const { control } = usePriceListForm()

  return (
    <Accordion.Item
      forceMountContent
      required
      value="type"
      title="Price list type"
      description="Select the type of the price list"
      tooltip="Unlike with sale prices a price override will not communicate to the customer that the price is part of a sale."
    >
      <Controller
        name="type"
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => {
          return (
            <RadioGroup.Root
              value={value ?? undefined}
              onValueChange={onChange}
              className="gap-base group-radix-state-open:mt-5 accordion-margin-transition flex items-center"
            >
              <RadioGroup.Item
                value={PriceListType.SALE}
                className="flex-1"
                label="Sale"
                description="Use this if you are creating prices for a sale."
              />
              <RadioGroup.Item
                value={PriceListType.OVERRIDE}
                className="flex-1"
                label="Override"
                description="Use this to override prices."
              />
            </RadioGroup.Root>
          )
        }}
      />
    </Accordion.Item>
  )
}

export default Type
