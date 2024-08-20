import { markPaymentCollectionAsPaid } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { refetchEntity } from "../../../../utils/refetch-entity"
import { AdminMarkPaymentCollectionPaidType } from "../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminMarkPaymentCollectionPaidType>,
  res: MedusaResponse<HttpTypes.AdminPaymentCollectionResponse>
) => {
  const { id } = req.params

  await markPaymentCollectionAsPaid(req.scope).run({
    input: {
      ...req.body,
      payment_collection_id: id,
    },
  })

  const paymentCollection = await refetchEntity(
    "payment_collection",
    id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ payment_collection: paymentCollection })
}
