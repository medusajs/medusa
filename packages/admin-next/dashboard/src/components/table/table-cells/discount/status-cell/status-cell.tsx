import { Discount } from "@medusajs/medusa"

import { StatusCell as StatusCell_ } from "../../common/status-cell"

import { useTranslation } from "react-i18next"
import {
  getDiscountStatus,
  PromotionStatus,
} from "../../../../../lib/discounts.ts"

type DiscountCellProps = {
  discount: Discount
}

export const StatusCell = ({ discount }: DiscountCellProps) => {
  const { t } = useTranslation()

  const [color, text] = {
    [PromotionStatus.DISABLED]: [
      "grey",
      t("discounts.discountStatus.disabled"),
    ],
    [PromotionStatus.ACTIVE]: ["green", t("discounts.discountStatus.active")],
    [PromotionStatus.SCHEDULED]: [
      "orange",
      t("discounts.discountStatus.scheduled"),
    ],
    [PromotionStatus.EXPIRED]: ["red", t("discounts.discountStatus.expired")],
  }[getDiscountStatus(discount)] as [
    "grey" | "orange" | "green" | "red",
    string
  ]

  return <StatusCell_ color={color}>{text}</StatusCell_>
}

export const StatusHeader = () => {
  const { t } = useTranslation()

  return (
    <div className=" flex h-full w-full items-center ">
      <span>{t("fields.status")}</span>
    </div>
  )
}
