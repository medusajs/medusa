import { MedusaContainer } from "@medusajs/framework/types"
import { refetchEntity } from "@medusajs/framework/http"

export const refetchOrder = async (
  idOrFilter: string | object,
  scope: MedusaContainer,
  fields: string[]
) => {
  return await refetchEntity("order", idOrFilter, scope, fields)
}
