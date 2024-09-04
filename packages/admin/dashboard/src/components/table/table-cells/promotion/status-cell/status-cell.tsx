import { PromotionDTO } from "@medusajs/types"
import { useTranslation } from "react-i18next"
import {
  getPromotionStatus,
  PromotionStatus,
} from "../../../../../lib/promotions"
import { StatusCell as StatusCell_ } from "../../common/status-cell"

type PromotionCellProps = {
  promotion: PromotionDTO
}
type StatusColors = "grey" | "orange" | "green" | "red"
type StatusMap = Record<string, [StatusColors, string]>

export const StatusCell = ({ promotion }: PromotionCellProps) => {
  const { t } = useTranslation()

  const statusMap: StatusMap = {
    [PromotionStatus.DISABLED]: ["grey", t("statuses.disabled")],
    [PromotionStatus.ACTIVE]: ["green", t("statuses.active")],
    [PromotionStatus.SCHEDULED]: ["orange", t("statuses.scheduled")],
    [PromotionStatus.EXPIRED]: ["red", t("statuses.expired")],
  }

  const [color, text] = statusMap[getPromotionStatus(promotion)]

  return <StatusCell_ color={color}>{text}</StatusCell_>
}
