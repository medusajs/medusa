import {
  MedusaContainer,
  PaymentCollectionDTO,
} from "@medusajs/framework/types"
import { refetchEntity } from "@medusajs/framework/http"

export const refetchPaymentCollection = async (
  id: string,
  scope: MedusaContainer,
  fields: string[]
): Promise<PaymentCollectionDTO> => {
  return refetchEntity("payment_collection", id, scope, fields)
}
