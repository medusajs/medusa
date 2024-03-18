import { createProductsWorkflow } from "@medusajs/core-flows"
import { CreateProductDTO } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  isString,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { listPriceLists } from "../price-lists/queries"
import { AdminGetProductsParams } from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetProductsParams>,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const filterableFields: AdminGetProductsParams = { ...req.filterableFields }
  const filterByPriceListIds = filterableFields.price_list_id
  const priceListVariantIds: string[] = []

  // When filtering by price_list_id, we need use the remote query to get
  // the variant IDs through the price list price sets.
  if (Array.isArray(filterByPriceListIds)) {
    const [priceLists] = await listPriceLists({
      container: req.scope,
      remoteQueryFields: ["price_set_money_amounts.price_set.variant.id"],
      apiFields: ["prices.variant_id"],
      variables: { filters: { id: filterByPriceListIds }, skip: 0, take: null },
    })

    priceListVariantIds.push(
      ...(priceLists
        .map((priceList) => priceList.prices?.map((price) => price.variant_id))
        .flat(2)
        .filter(isString) || [])
    )

    delete filterableFields.price_list_id
  }

  if (priceListVariantIds.length) {
    const existingVariantFilters = filterableFields.variants || {}

    filterableFields.variants = {
      ...existingVariantFilters,
      id: priceListVariantIds,
    }
  }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "product",
    variables: {
      filters: filterableFields,
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: products, metadata } = await remoteQuery(queryObject)

  res.json({
    products,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<CreateProductDTO>,
  res: MedusaResponse
) => {
  const input = [
    {
      ...req.validatedBody,
    },
  ]

  const { result, errors } = await createProductsWorkflow(req.scope).run({
    input: { products: input },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ product: result[0] })
}
