import { createPaymentCollectionForCartWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"

export const POST = async (
  req: AuthenticatedMedusaRequest<HttpTypes.StoreCreatePaymentCollection>,
  res: MedusaResponse<HttpTypes.StorePaymentCollectionResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const { cart_id } = req.body

  // We can potentially refactor the workflow to behave more like an upsert and return an existing collection if there is one.
  const [cartCollectionRelation] = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "cart_payment_collection",
      variables: { filters: { cart_id } },
      fields: req.remoteQueryConfig.fields.map(
        (f) => `payment_collection.${f}`
      ),
    })
  )
  let paymentCollection = cartCollectionRelation?.payment_collection

  if (!paymentCollection) {
    await createPaymentCollectionForCartWorkflow(req.scope).run({
      input: req.body,
    })

    const [cartCollectionRelation] = await remoteQuery(
      remoteQueryObjectFromString({
        entryPoint: "cart_payment_collection",
        variables: { filters: { cart_id } },
        fields: req.remoteQueryConfig.fields.map(
          (f) => `payment_collection.${f}`
        ),
      })
    )
    paymentCollection = cartCollectionRelation?.payment_collection
  }

  res.status(200).json({ payment_collection: paymentCollection })
}
