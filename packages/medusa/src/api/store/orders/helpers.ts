import { MedusaContainer } from "@zjedene-medusa/framework/types"
import { refetchEntity } from "@zjedene-medusa/framework/http"

export const refetchOrder = async (
  idOrFilter: string | object,
  scope: MedusaContainer,
  fields: string[]
) => {
  return await refetchEntity({ entity: "order", idOrFilter, scope, fields })
}
