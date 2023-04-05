import { Controller } from "react-hook-form"
import { NestedForm } from "../../../../utils/nested-form"
import Switch from "../../../atoms/switch"

export type DiscountableFormType = {
  value: boolean
}

type Props = {
  form: NestedForm<DiscountableFormType>
  isGiftCard?: boolean
}

const DiscountableForm = ({ form, isGiftCard }: Props) => {
  const { control, path } = form
  return (
    <div>
      <div className="mb-2xsmall flex items-center justify-between">
        <h2 className="inter-base-semibold">Discountable</h2>
        <Controller
          control={control}
          name={path("value")}
          render={({ field: { value, onChange } }) => {
            return <Switch checked={value} onCheckedChange={onChange} />
          }}
        />
      </div>
      <p className="inter-base-regular text-grey-50">
        When unchecked discounts will not be applied to this{" "}
        {isGiftCard ? "gift card" : "product"}.
      </p>
    </div>
  )
}

export default DiscountableForm
