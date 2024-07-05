import { MedusaContainer } from "@medusajs/types"
import { refetchEntity } from "../../utils/refetch-entity"

export const refetchProduct = async (
  idOrFilter: string | object,
  scope: MedusaContainer,
  fields: string[]
) => {
  return await refetchEntity("product", idOrFilter, scope, fields)
}
