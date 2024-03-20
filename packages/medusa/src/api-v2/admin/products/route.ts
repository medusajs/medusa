import { createProductsWorkflow } from "@medusajs/core-flows"
import { CreateProductDTO } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  isString,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { MedusaContainer } from "medusa-core-utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { listPriceLists } from "../price-lists/queries"
import { remapKeysForProduct, remapProduct } from "./helpers"
import { AdminGetProductsParams } from "./validators"

const applyVariantFiltersForPriceList = async (
  scope: MedusaContainer,
  filterableFields: AdminGetProductsParams
) => {
  const filterByPriceListIds = filterableFields.price_list_id
  const priceListVariantIds: string[] = []

  // When filtering by price_list_id, we need use the remote query to get
  // the variant IDs through the price list price sets.
  if (Array.isArray(filterByPriceListIds)) {
    const [priceLists] = await listPriceLists({
      container: scope,
      remoteQueryFields: ["price_set_money_amounts.price_set.variant.id"],
      apiFields: ["prices.variant_id"],
      variables: { filters: { id: filterByPriceListIds }, skip: 0, take: null },
    })

    priceListVariantIds.push(
      ...((priceLists
        .map((priceList) => priceList.prices?.map((price) => price.variant_id))
        .flat(2)
        .filter(isString) || []) as string[])
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

  return filterableFields
}

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetProductsParams>,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  let filterableFields: AdminGetProductsParams = { ...req.filterableFields }

  filterableFields = await applyVariantFiltersForPriceList(
    req.scope,
    filterableFields
  )

  const selectFields = remapKeysForProduct(req.remoteQueryConfig.fields ?? [])
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "product",
    variables: {
      filters: filterableFields,
      ...req.remoteQueryConfig.pagination,
    },
    fields: selectFields,
  })

  const { rows: products, metadata } = await remoteQuery(queryObject)

  res.json({
    products: products.map(remapProduct),
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

  res.status(200).json({ product: remapProduct(result[0]) })
}
