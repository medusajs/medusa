import {
  ContainerRegistrationKeys,
  getTotalVariantAvailability,
  getVariantAvailability,
  MedusaError,
} from "@medusajs/framework/utils"
import { MedusaRequest, MedusaStoreRequest } from "@medusajs/framework/http"
import { transformAndValidateSalesChannelIds } from "./filter-by-valid-sales-channels"

const inventoryQuantityRequiredFields = ["id", "manage_inventory"]

export const prepareInventoryQuantityFields = (
  fields: string[],
  { relation }: { relation?: string } = {}
): { fields: string[]; withInventoryQuantity: boolean } => {
  const prefix = relation ? `${relation}.` : ""
  const inventoryQuantityField = `${prefix}inventory_quantity`

  const withInventoryQuantity = fields.some(
    (field) => field === inventoryQuantityField
  )

  if (!withInventoryQuantity) {
    return { fields, withInventoryQuantity }
  }

  const preparedFields = new Set(
    fields.filter((field) => field !== inventoryQuantityField)
  )

  for (const requiredField of inventoryQuantityRequiredFields) {
    preparedFields.add(`${prefix}${requiredField}`)
  }

  return { fields: Array.from(preparedFields), withInventoryQuantity }
}

export const wrapVariantsWithTotalInventoryQuantity = async (
  req: MedusaRequest,
  variants: VariantInput[]
) => {
  const variantsToWrap = (variants ?? []).filter(
    (variant): variant is VariantInput => !!variant?.id
  )
  const variantIds = variantsToWrap.map((variant) => variant.id)

  if (!variantIds.length) {
    return
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const availability = await getTotalVariantAvailability(query, {
    variant_ids: variantIds,
  })

  wrapVariants(variantsToWrap, availability)
}

export const wrapVariantsWithInventoryQuantityForSalesChannel = async (
  req: MedusaStoreRequest<unknown>,
  variants: VariantInput[]
) => {
  const salesChannelIds = transformAndValidateSalesChannelIds(req)

  const publishableApiKeySalesChannelIds =
    req.publishable_key_context.sales_channel_ids ?? []

  let channelsToUse: string

  if (publishableApiKeySalesChannelIds.length === 1) {
    channelsToUse = publishableApiKeySalesChannelIds[0]
  } else if (salesChannelIds.length === 1) {
    channelsToUse = salesChannelIds[0]
  } else {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Inventory availability cannot be calculated in the given context. Either provide a single sales channel id or configure a single sales channel in the publishable key`
    )
  }

  const variantsToWrap = (variants ?? []).filter(
    (variant): variant is VariantInput => !!variant?.id
  )
  const variantIds = variantsToWrap.map((variant) => variant.id)

  if (!variantIds.length) {
    return
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const availability = await getVariantAvailability(query, {
    variant_ids: variantIds,
    sales_channel_id: channelsToUse,
  })

  wrapVariants(variantsToWrap, availability)
}

type VariantInput = {
  id: string
  inventory_quantity?: number | null
  manage_inventory?: boolean
}

type VariantAvailability = Awaited<
  ReturnType<typeof getTotalVariantAvailability>
>

const wrapVariants = (
  variants: VariantInput[],
  availability: VariantAvailability
) => {
  for (const variant of variants) {
    if (!variant.manage_inventory) {
      continue
    }

    variant.inventory_quantity = availability[variant.id].availability
  }
}
