import type { Discount } from "@medusajs/medusa"

import { useTranslation } from "react-i18next"

type DiscountCellProps = {
  discount: Discount
}

export const DescriptionCell = ({ discount }: DiscountCellProps) => {
  return (
    <div className="flex h-full w-full items-center gap-x-3 overflow-hidden">
      <span className="truncate">{discount.rule.description}</span>
    </div>
  )
}

export const DescriptionHeader = () => {
  const { t } = useTranslation()

  return (
    <div className=" flex h-full w-full items-center ">
      <span>{t("fields.description")}</span>
    </div>
  )
}
