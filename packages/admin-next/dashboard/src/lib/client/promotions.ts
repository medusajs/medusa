import { AdminGetPromotionsParams } from "@medusajs/medusa"

import { PromotionListRes, PromotionRes } from "../../types/api-responses"
import { getRequest } from "./common"

const retrievePromotion = async (
  id: string,
  query?: AdminGetPromotionsParams
) => {
  return getRequest<PromotionRes, AdminGetPromotionsParams>(
    `/admin/promotions/${id}`,
    query
  )
}

const listPromotions = async (query?: AdminGetPromotionsParams) => {
  return getRequest<PromotionListRes>(`/admin/promotions`, query)
}

export const promotions = {
  retrieve: retrievePromotion,
  list: listPromotions,
}
