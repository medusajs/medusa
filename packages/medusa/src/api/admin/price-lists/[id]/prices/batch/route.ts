import { promiseAll } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"
import { listPrices } from "../../../queries"
import { adminPriceListPriceRemoteQueryFields } from "../../../query-config"
import { BatchMethodRequest } from "@medusajs/types"
import {
  AdminCreatePriceListPriceType,
  AdminUpdatePriceListPriceType,
} from "../../../validators"
import { batchPriceListPricesWorkflow } from "@medusajs/core-flows"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    BatchMethodRequest<
      AdminCreatePriceListPriceType,
      AdminUpdatePriceListPriceType
    >
  >,
  res: MedusaResponse
) => {
  const id = req.params.id
  const {
    create = [],
    update = [],
    delete: deletePriceIds = [],
  } = req.validatedBody

  const workflow = batchPriceListPricesWorkflow(req.scope)
  const { result } = await workflow.run({
    input: {
      data: {
        id,
        create,
        update,
        delete: deletePriceIds,
      },
    },
  })

  const [created, updated] = await promiseAll([
    listPrices(
      result.created.map((c) => c.id),
      req.scope,
      adminPriceListPriceRemoteQueryFields
    ),
    listPrices(
      result.updated.map((c) => c.id),
      req.scope,
      adminPriceListPriceRemoteQueryFields
    ),
  ])

  res.status(200).json({
    created,
    updated,
    deleted: {
      ids: deletePriceIds,
      object: "price",
      deleted: true,
    },
  })
}
