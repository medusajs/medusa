import { ShippingOption } from "@medusajs/medusa"
import { useTranslation } from "react-i18next"
import { MoneyAmountCell } from "../../common/money-amount-cell"
import { PlaceholderCell } from "../../common/placeholder-cell"

type SubtotalType = "min" | "max"

type SubtotalRequirementCellProps = {
  type: SubtotalType
  shippingOption: ShippingOption
}

export const SubtotalRequirementCell = (
  props: SubtotalRequirementCellProps
) => {
  const requirement = props.shippingOption.requirements?.find(
    (r) => r.type === `${props.type}_subtotal`
  )

  if (!requirement) {
    return <PlaceholderCell />
  }

  return (
    <MoneyAmountCell
      currencyCode={props.shippingOption.region!.currency_code}
      amount={requirement.amount}
    />
  )
}

export const SubtotalRequirementHeader = ({ type }: { type: SubtotalType }) => {
  const { t } = useTranslation()

  const header =
    type === "min" ? t("fields.minSubtotal") : t("fields.maxSubtotal")

  return (
    <div className="flex size-full items-center overflow-hidden">
      <span className="truncate">{header}</span>
    </div>
  )
}
