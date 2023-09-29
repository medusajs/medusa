import clsx from "clsx"
import { Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"
import RadioGroup from "../../../../../components/organisms/radio-group"
import { AllocationType } from "../../../types"
import { useDiscountForm } from "../form/discount-form-context"

const DiscountAllocation = () => {
  const { control } = useDiscountForm()
  const { t } = useTranslation()

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
            className={clsx("gap-base mt-base flex items-center px-1")}
          >
            <RadioGroup.Item
              value={AllocationType.TOTAL}
              className="flex-1"
              label={t("sections-total-amount", "Total amount")}
              description={t(
                "sections-apply-to-the-total-amount",
                "Apply to the total amount"
              )}
            />
            <RadioGroup.Item
              value={AllocationType.ITEM}
              className="flex-1"
              label={t("sections-item-specific", "Item specific")}
              description={t(
                "sections-apply-to-every-allowed-item",
                "Apply to every allowed item"
              )}
            />
          </RadioGroup.Root>
        )
      }}
    />
  )
}

export default DiscountAllocation
