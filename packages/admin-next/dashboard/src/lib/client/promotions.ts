import { AdminGetPromotionsParams } from "@medusajs/medusa"

import { PromotionRes } from "../../types/api-responses"
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

export const promotions = {
  retrieve: retrievePromotion,
}
