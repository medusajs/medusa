import { Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"
import Accordion from "../../../../components/organisms/accordion"
import RadioGroup from "../../../../components/organisms/radio-group"
import { usePriceListForm } from "../form/pricing-form-context"
import { PriceListType } from "../types"

const Type = () => {
  const { t } = useTranslation()
  const { control } = usePriceListForm()

  return (
    <Accordion.Item
      forceMountContent
      required
      value="type"
      title={t("sections-price-list-type", "Price list type")}
      description={t(
        "sections-select-the-type-of-the-price-list",
        "Select the type of the price list"
      )}
      tooltip={t(
        "sections-sale-prices-compare-to-price-override",
        "Unlike with sale prices a price override will not communicate to the customer that the price is part of a sale."
      )}
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
                label={t("sections-sale", "Sale")}
                description={t(
                  "sections-use-this-if-you-are-creating-prices-for-a-sale",
                  "Use this if you are creating prices for a sale."
                )}
              />
              <RadioGroup.Item
                value={PriceListType.OVERRIDE}
                className="flex-1"
                label={t("sections-override", "Override")}
                description={t(
                  "sections-use-this-to-override-prices",
                  "Use this to override prices."
                )}
              />
            </RadioGroup.Root>
          )
        }}
      />
    </Accordion.Item>
  )
}

export default Type
