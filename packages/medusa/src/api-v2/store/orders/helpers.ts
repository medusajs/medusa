import { MedusaContainer } from "@medusajs/types"
import { refetchEntity } from "../../utils/refetch-entity"

export const refetchOrder = async (
  idOrFilter: string | object,
  scope: MedusaContainer,
  fields: string[]
) => {
  return await refetchEntity("order", idOrFilter, scope, fields)
}
