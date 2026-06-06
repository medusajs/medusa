import { batchPriceListPricesWorkflow } from "@zjedene-medusa/core-flows"
import { HttpTypes } from "@zjedene-medusa/framework/types"
import { MedusaError } from "@zjedene-medusa/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { fetchPriceList, fetchPriceListPriceIdsForProduct } from "../../helpers"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminLinkPriceListProducts,
    HttpTypes.AdminPriceListParams
  >,
  res: MedusaResponse<HttpTypes.AdminPriceListResponse>
) => {
  const id = req.params.id
  const { remove = [] } = req.validatedBody

  if (!remove.length) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "No product ids passed to remove from price list"
    )
  }

  const productPriceIds = await fetchPriceListPriceIdsForProduct(
    id,
    remove,
    req.scope
  )

  const workflow = batchPriceListPricesWorkflow(req.scope)
  await workflow.run({
    input: {
      data: {
        id,
        create: [],
        update: [],
        delete: productPriceIds,
      },
    },
  })

  const priceList = await fetchPriceList(id, req.scope, req.queryConfig.fields)

  res.status(200).json({ price_list: priceList })
}
