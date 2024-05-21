import { MedusaContainer, PaymentCollectionDTO } from "@medusajs/types"
import { refetchEntity } from "../../utils/refetch-entity"

export const refetchPaymentCollection = async (
  id: string,
  scope: MedusaContainer,
  fields: string[]
): Promise<PaymentCollectionDTO> => {
  return refetchEntity("payment_collection", id, scope, fields)
}
