import { AdminGetPromotionsParams } from "@medusajs/medusa"

import { PromotionRes } from "../../types/api-responses"
import { makeRequest } from "./common"

const retrievePromotion = async (
  id: string,
  query?: AdminGetPromotionsParams
) => {
  return makeRequest<PromotionRes, AdminGetPromotionsParams>(
    `/admin/promotions/${id}`,
    query
  )
}

export const promotions = {
  retrieve: retrievePromotion,
}
