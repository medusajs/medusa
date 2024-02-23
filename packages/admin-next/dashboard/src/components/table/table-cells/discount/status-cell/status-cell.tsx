import { Discount } from "@medusajs/medusa"
import { end, parse } from "iso8601-duration"

import { StatusCell as StatusCell_ } from "../../common/status-cell"

import { useTranslation } from "react-i18next"

type DiscountCellProps = {
  discount: Discount
}

enum PromotionStatus {
  SCHEDULED = "SCHEDULED",
  EXPIRED = "EXPIRED",
  ACTIVE = "ACTIVE",
  DISABLED = "DISABLED",
}

const getDiscountStatus = (discount: Discount) => {
  if (discount.is_disabled) {
    return PromotionStatus.DISABLED
  }

  const date = new Date()
  if (new Date(discount.starts_at) > date) {
    return PromotionStatus.SCHEDULED
  }

  if (
    (discount.ends_at && new Date(discount.ends_at) < date) ||
    (discount.valid_duration &&
      date >
        end(parse(discount.valid_duration), new Date(discount.starts_at))) ||
    discount.usage_count === discount.usage_limit
  ) {
    return PromotionStatus.EXPIRED
  }

  return PromotionStatus.ACTIVE
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
