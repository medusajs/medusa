import { archiveOrderWorkflow } from "@medusajs/core-flows"
import { remoteQueryObjectFromString } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { AdminArchiveOrderType } from "../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminArchiveOrderType>,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve("remoteQuery")
  const { id } = req.params

  const { errors } = await archiveOrderWorkflow(req.scope).run({
    input: { order_ids: [req.validatedBody.order_id] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order",
    variables: { id },
    fields: req.remoteQueryConfig.fields,
  })

  const [order] = await remoteQuery(queryObject)

  res.status(200).json({ order })
}
