import { batchPriceListPricesWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { fetchPriceList, fetchPriceListPriceIdsForProduct } from "../../helpers"

const getNumberValue = (value: unknown, defaultValue: number) => {
  const numberValue = Number(Array.isArray(value) ? value[0] : value)

  return Number.isFinite(numberValue) ? numberValue : defaultValue
}

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminProductListResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const limit = getNumberValue(
    req.validatedQuery?.limit ?? req.query?.limit,
    req.queryConfig.pagination?.take ?? 50
  )
  const offset = getNumberValue(
    req.validatedQuery?.offset ?? req.query?.offset,
    req.queryConfig.pagination?.skip ?? 0
  )

  const { data: products, metadata } = await query.graph({
    entity: "product",
    fields: req.queryConfig.fields,
    filters: req.filterableFields,
    pagination: {
      ...req.queryConfig.pagination,
      take: limit,
      skip: offset,
    },
  })

  res.status(200).json({
    products,
    count: metadata?.count ?? products.length,
    offset: metadata?.skip ?? offset,
    limit: metadata?.take ?? limit,
  })
}

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
