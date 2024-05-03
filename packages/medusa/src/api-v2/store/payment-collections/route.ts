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
  let [paymentCollection] = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "payment_collection",
      variables: { cart: { id: cart_id } },
      fields: req.remoteQueryConfig.fields,
    })
  )

  if (!paymentCollection) {
    const { errors } = await createPaymentCollectionForCartWorkflow(
      req.scope
    ).run({
      input: req.body,
    })

    if (Array.isArray(errors) && errors[0]) {
      throw errors[0].error
    }

    const [newPaymentCollection] = await remoteQuery(
      remoteQueryObjectFromString({
        entryPoint: "payment_collection",
        variables: { cart: { id: cart_id } },
        fields: req.remoteQueryConfig.fields,
      })
    )
    paymentCollection = newPaymentCollection
  }

  res.status(200).json({ payment_collection: paymentCollection })
}
