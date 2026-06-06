import { HttpTypes } from "@zjedene-medusa/types"
import { getPromotionStatus } from "../../../../../lib/promotions"
import { StatusCell as StatusCell_ } from "../../common/status-cell"

type PromotionCellProps = {
  promotion: HttpTypes.AdminPromotion
}

export const StatusCell = ({ promotion }: PromotionCellProps) => {
  const [color, text] = getPromotionStatus(promotion)

  return <StatusCell_ color={color}>{text}</StatusCell_>
}
