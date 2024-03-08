import { PriceList } from "@medusajs/medusa"
import { ActionMenu } from "../../../../../components/common/action-menu"

type PricingTableActionsProps = {
  priceList: PriceList
}

export const PricingTableActions = ({
  priceList,
}: PricingTableActionsProps) => {
  return <ActionMenu groups={[]} />
}
