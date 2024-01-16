import { DALUtils } from "@medusajs/utils"
import { LineItem } from "@models"
import { CreateLineItemDTO, UpdateLineItemDTO } from "../types"

export class LineItemRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  LineItem,
  {
    create: CreateLineItemDTO
    update: UpdateLineItemDTO
  }
>(LineItem) {}
