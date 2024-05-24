import { createPaymentCollectionForCartWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { StoreCreatePaymentCollectionType } from "./validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<StoreCreatePaymentCollectionType>,
  res: MedusaResponse
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

    if (Array.isArray(errors) && errors[0]) {
      throw errors[0].error
    }

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
