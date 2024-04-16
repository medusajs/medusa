import { batchPriceListPricesWorkflow } from "@medusajs/core-flows"
import { z } from "zod"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"
import { AdminBatchPriceListPrices } from "../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<z.infer<typeof AdminBatchPriceListPrices>>,
  res: MedusaResponse
) => {
  const {
    create = [],
    update = [],
    delete: deletePriceIds = [],
  } = req.validatedBody

  const id = req.params.id
  const workflow = batchPriceListPricesWorkflow(req.scope)
  const { result, errors } = await workflow.run({
    input: {
      data: {
        id,
        create,
        update,
        delete: deletePriceIds,
      },
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json(result)
}
