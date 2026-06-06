import {
  MedusaContainer,
  PaymentCollectionDTO,
} from "@zjedene-medusa/framework/types"
import { refetchEntity } from "@zjedene-medusa/framework/http"

export const refetchPaymentCollection = async (
  id: string,
  scope: MedusaContainer,
  fields: string[]
): Promise<PaymentCollectionDTO> => {
  return refetchEntity({
    entity: "payment_collection",
    idOrFilter: id,
    scope,
    fields,
  })
}
