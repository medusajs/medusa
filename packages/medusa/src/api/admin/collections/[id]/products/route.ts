import { batchLinkProductsToCollectionWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { LinkMethodRequest } from "@medusajs/types/src"
import { refetchCollection } from "../../helpers"

export const POST = async (
  req: AuthenticatedMedusaRequest<LinkMethodRequest>,
  res: MedusaResponse
) => {
  const id = req.params.id
  const { add = [], remove = [] } = req.validatedBody

  const workflow = batchLinkProductsToCollectionWorkflow(req.scope)
  const { errors } = await workflow.run({
    input: {
      id,
      add,
      remove,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const collection = await refetchCollection(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({
    collection,
  })
}
