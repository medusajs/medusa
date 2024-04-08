import { PaginatedResponse, PromotionDTO } from "@medusajs/types"

export type AdminPromotionsListRes = PaginatedResponse<{
  promotions: PromotionDTO[]
}>

export type AdminPromotionRes = {
  promotion: PromotionDTO
}
