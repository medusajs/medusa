import { LinkDefinition } from "@medusajs/modules-sdk"
import {
  BatchMethodResponse,
  HttpTypes,
  MedusaContainer,
  PriceDTO,
  ProductDTO,
  ProductVariantDTO,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  Modules,
  promiseAll,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { AdminBatchVariantInventoryItemsType } from "./validators"

const isPricing = (fieldName: string) =>
  fieldName.startsWith("variants.prices") ||
  fieldName.startsWith("*variants.prices") ||
  fieldName.startsWith("prices") ||
  fieldName.startsWith("*prices")

// The variant had prices before, but that is not part of the price_set money amounts. Do we remap the request and response or not?
export const remapKeysForProduct = (selectFields: string[]) => {
  const productFields = selectFields.filter(
    (fieldName: string) => !isPricing(fieldName)
  )

  const pricingFields = selectFields
    .filter((fieldName: string) => isPricing(fieldName))
    .map((fieldName: string) =>
      fieldName.replace("variants.prices.", "variants.price_set.prices.")
    )

  return [...productFields, ...pricingFields]
}

export const remapKeysForVariant = (selectFields: string[]) => {
  const variantFields = selectFields.filter(
    (fieldName: string) => !isPricing(fieldName)
  )

  const pricingFields = selectFields
    .filter((fieldName: string) => isPricing(fieldName))
    .map((fieldName: string) =>
      fieldName.replace("prices.", "price_set.prices.")
    )

  return [...variantFields, ...pricingFields]
}

export const remapProductResponse = (
  product: ProductDTO
): HttpTypes.AdminProduct => {
  return {
    ...product,
    variants: product.variants?.map(remapVariantResponse),
    // TODO: Remove any once all typings are cleaned up
  } as any
}

export const remapVariantResponse = (
  variant: ProductVariantDTO
): HttpTypes.AdminProductVariant => {
  if (!variant) {
    return variant
  }

  const resp = {
    ...variant,
    prices: (variant as any).price_set?.prices?.map((price) => ({
      id: price.id,
      amount: price.amount,
      currency_code: price.currency_code,
      min_quantity: price.min_quantity,
      max_quantity: price.max_quantity,
      variant_id: variant.id,
      created_at: price.created_at,
      updated_at: price.updated_at,
      rules: buildRules(price),
    })),
  }

  delete (resp as any).price_set

  // TODO: Remove any once all typings are cleaned up
  return resp as any
}

export const buildRules = (price: PriceDTO) => {
  const rules: Record<string, string> = {}

  for (const priceRule of price.price_rules || []) {
    const ruleAttribute = priceRule.rule_type?.rule_attribute

    if (ruleAttribute) {
      rules[ruleAttribute] = priceRule.value
    }
  }

  return rules
}

export const refetchVariant = async (
  variantId: string,
  scope: MedusaContainer,
  fields: string[]
) => {
  const remoteQuery = scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "product_variant",
    variables: {
      filters: { id: variantId },
    },
    fields: remapKeysForVariant(fields ?? []),
  })

  const [variant] = await remoteQuery(queryObject)

  return remapVariantResponse(variant)
}

export const refetchBatchProducts = async (
  batchResult: BatchMethodResponse<ProductDTO>,
  scope: MedusaContainer,
  fields: string[]
) => {
  const remoteQuery = scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  let created = Promise.resolve<ProductDTO[]>([])
  let updated = Promise.resolve<ProductDTO[]>([])

  if (batchResult.created.length) {
    const createdQuery = remoteQueryObjectFromString({
      entryPoint: "product",
      variables: {
        filters: { id: batchResult.created.map((p) => p.id) },
      },
      fields: remapKeysForProduct(fields ?? []),
    })

    // @ts-expect-error "Remote query can return null"
    created = remoteQuery(createdQuery)
  }

  if (batchResult.updated.length) {
    const updatedQuery = remoteQueryObjectFromString({
      entryPoint: "product",
      variables: {
        filters: { id: batchResult.updated.map((p) => p.id) },
      },
      fields: remapKeysForProduct(fields ?? []),
    })

    // @ts-expect-error "Remote query can return null"
    updated = remoteQuery(updatedQuery)
  }

  const [createdRes, updatedRes] = await promiseAll([created, updated])
  return {
    created: createdRes,
    updated: updatedRes,
    deleted: batchResult.deleted,
  }
}

export const refetchBatchVariants = async (
  batchResult: BatchMethodResponse<ProductVariantDTO>,
  scope: MedusaContainer,
  fields: string[]
) => {
  const remoteQuery = scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  let created = Promise.resolve<ProductVariantDTO[]>([])
  let updated = Promise.resolve<ProductVariantDTO[]>([])

  if (batchResult.created.length) {
    const createdQuery = remoteQueryObjectFromString({
      entryPoint: "variant",
      variables: {
        filters: { id: batchResult.created.map((v) => v.id) },
      },
      fields: remapKeysForVariant(fields ?? []),
    })

    // @ts-expect-error "Remote query can return null"
    created = remoteQuery(createdQuery)
  }

  if (batchResult.updated.length) {
    const updatedQuery = remoteQueryObjectFromString({
      entryPoint: "variant",
      variables: {
        filters: { id: batchResult.updated.map((v) => v.id) },
      },
      fields: remapKeysForVariant(fields ?? []),
    })

    // @ts-expect-error "Remote query can return null"
    updated = remoteQuery(updatedQuery)
  }

  const [createdRes, updatedRes] = await promiseAll([created, updated])
  return {
    created: createdRes,
    updated: updatedRes,
    deleted: batchResult.deleted,
  }
}

export const buildBatchVariantInventoryData = (
  inputs:
    | AdminBatchVariantInventoryItemsType["create"]
    | AdminBatchVariantInventoryItemsType["update"]
    | AdminBatchVariantInventoryItemsType["delete"]
) => {
  const results: LinkDefinition[] = []

  for (const input of inputs || []) {
    const result: LinkDefinition = {
      [Modules.PRODUCT]: { variant_id: input.variant_id },
      [Modules.INVENTORY]: {
        inventory_item_id: input.inventory_item_id,
      },
    }

    if ("required_quantity" in input) {
      result.data = {
        required_quantity: input.required_quantity,
      }
    }

    results.push(result)
  }

  return results
}
