import {
  AdditionalData,
  InventoryTypes,
  LinkDefinition,
  PricingTypes,
  ProductTypes,
} from "@medusajs/framework/types"
import {
  MedusaError,
  Modules,
  ProductVariantWorkflowEvents,
} from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common"
import { createLinksWorkflow } from "../../common/workflows/create-links"
import { validateInventoryItems } from "../../inventory/steps/validate-inventory-items"
import { createInventoryItemsWorkflow } from "../../inventory/workflows/create-inventory-items"
import { createPriceSetsStep } from "../../pricing"
import { createProductVariantsStep } from "../steps/create-product-variants"
import { createVariantPricingLinkStep } from "../steps/create-variant-pricing-link"

/**
 * @privateRemarks
 * TODO: Create separate typings for the workflow input
 */
export type CreateProductVariantsWorkflowInput = {
  product_variants: (ProductTypes.CreateProductVariantDTO & {
    prices?: PricingTypes.CreateMoneyAmountDTO[]
  } & {
    inventory_items?: {
      inventory_item_id: string
      required_quantity?: number
    }[]
  })[]
} & AdditionalData

const buildLink = (
  variant_id: string,
  inventory_item_id: string,
  required_quantity: number
) => {
  const link: LinkDefinition = {
    [Modules.PRODUCT]: { variant_id },
    [Modules.INVENTORY]: { inventory_item_id: inventory_item_id },
    data: { required_quantity: required_quantity },
  }

  return link
}

const validateVariantsDuplicateInventoryItemIds = (
  variantsData: {
    variantId: string
    inventory_items: {
      inventory_item_id: string
      required_quantity?: number
    }[]
  }[]
) => {
  const erroredVariantIds: string[] = []

  for (const variantData of variantsData) {
    const inventoryItemIds = variantData.inventory_items.map(
      (item) => item.inventory_item_id
    )
    const duplicatedInventoryItemIds = inventoryItemIds.filter(
      (id, index) => inventoryItemIds.indexOf(id) !== index
    )

    if (duplicatedInventoryItemIds.length) {
      erroredVariantIds.push(variantData.variantId)
    }
  }

  if (erroredVariantIds.length) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Cannot associate duplicate inventory items to variant(s) ${erroredVariantIds.join(
        "\n"
      )}`
    )
  }
}

const buildLinksToCreate = (data: {
  createdVariants: ProductTypes.ProductVariantDTO[]
  inventoryIndexMap: Record<number, InventoryTypes.InventoryItemDTO>
  input: CreateProductVariantsWorkflowInput
}) => {
  let index = 0
  const linksToCreate: LinkDefinition[] = []

  validateVariantsDuplicateInventoryItemIds(
    (data.createdVariants ?? []).map((variant, index) => {
      const variantInput = data.input.product_variants[index]
      const inventoryItems = variantInput.inventory_items || []

      return {
        variantId: variant.id,
        inventory_items: inventoryItems,
      }
    })
  )

  for (const variant of data.createdVariants) {
    const variantInput = data.input.product_variants[index]
    const shouldManageInventory = variant.manage_inventory
    const hasInventoryItems = variantInput.inventory_items?.length
    index += 1

    if (!shouldManageInventory) {
      continue
    }

    if (!hasInventoryItems) {
      const inventoryItem = data.inventoryIndexMap[index]

      linksToCreate.push(buildLink(variant.id, inventoryItem.id, 1))

      continue
    }

    for (const inventoryInput of variantInput.inventory_items || []) {
      linksToCreate.push(
        buildLink(
          variant.id,
          inventoryInput.inventory_item_id,
          inventoryInput.required_quantity ?? 1
        )
      )
    }
  }

  return linksToCreate
}

const buildVariantItemCreateMap = (data: {
  createdVariants: ProductTypes.ProductVariantDTO[]
  input: CreateProductVariantsWorkflowInput
}) => {
  let index = 0
  const map: Record<number, InventoryTypes.CreateInventoryItemInput> = {}

  for (const variant of data.createdVariants || []) {
    const variantInput = data.input.product_variants[index]
    const shouldManageInventory = variant.manage_inventory
    const hasInventoryItems = variantInput.inventory_items?.length
    index += 1

    if (!shouldManageInventory || hasInventoryItems) {
      continue
    }

    // Create a default inventory item if the above conditions arent met
    map[index] = {
      sku: variantInput.sku,
      origin_country: variantInput.origin_country,
      mid_code: variantInput.mid_code,
      material: variantInput.material,
      weight: variantInput.weight,
      length: variantInput.length,
      height: variantInput.height,
      width: variantInput.width,
      title: variantInput.title,
      description: variantInput.title,
      hs_code: variantInput.hs_code,
      requires_shipping: true,
    }
  }

  return map
}

export const createProductVariantsWorkflowId = "create-product-variants"
/**
 * This workflow creates one or more product variants.
 */
export const createProductVariantsWorkflow = createWorkflow(
  createProductVariantsWorkflowId,
  (input: WorkflowData<CreateProductVariantsWorkflowInput>) => {
    // Passing prices to the product module will fail, we want to keep them for after the variant is created.
    const variantsWithoutPrices = transform({ input }, (data) =>
      data.input.product_variants.map((v) => ({
        ...v,
        prices: undefined,
      }))
    )

    const createdVariants = createProductVariantsStep(variantsWithoutPrices)

    // Setup variants inventory
    const inventoryItemIds = transform(input, (data) => {
      return data.product_variants
        .map((variant) => variant.inventory_items || [])
        .flat()
        .map((item) => item.inventory_item_id)
        .flat()
    })

    validateInventoryItems(inventoryItemIds)

    const variantItemCreateMap = transform(
      { createdVariants, input },
      buildVariantItemCreateMap
    )

    const createdInventoryItems = createInventoryItemsWorkflow.runAsStep({
      input: {
        items: transform(variantItemCreateMap, (data) => Object.values(data)),
      },
    })

    const inventoryIndexMap = transform(
      { createdInventoryItems, variantItemCreateMap },
      (data) => {
        const map: Record<number, InventoryTypes.InventoryItemDTO> = {}
        let inventoryIndex = 0

        for (const variantIndex of Object.keys(data.variantItemCreateMap)) {
          map[variantIndex] = data.createdInventoryItems[inventoryIndex]
          inventoryIndex += 1
        }

        return map
      }
    )

    const linksToCreate = transform(
      { createdVariants, inventoryIndexMap, input },
      buildLinksToCreate
    )

    createLinksWorkflow.runAsStep({ input: linksToCreate })

    // Note: We rely on the same order of input and output when creating variants here, make sure that assumption holds
    const pricesToCreate = transform({ input, createdVariants }, (data) =>
      data.createdVariants.map((v, i) => {
        return {
          prices: data.input.product_variants[i]?.prices,
        }
      })
    )

    const createdPriceSets = createPriceSetsStep(pricesToCreate)

    const variantAndPriceSets = transform(
      { createdVariants, createdPriceSets },
      (data) => {
        return data.createdVariants.map((variant, i) => ({
          variant: variant,
          price_set: data.createdPriceSets[i],
        }))
      }
    )

    const variantAndPriceSetLinks = transform(
      { variantAndPriceSets },
      (data) => {
        return {
          links: data.variantAndPriceSets.map((entry) => ({
            variant_id: entry.variant.id,
            price_set_id: entry.price_set.id,
          })),
        }
      }
    )

    createVariantPricingLinkStep(variantAndPriceSetLinks)

    const response = transform(
      {
        variantAndPriceSets,
      },
      (data) => {
        return data.variantAndPriceSets.map((variantAndPriceSet) => ({
          ...variantAndPriceSet.variant,
          prices: variantAndPriceSet?.price_set?.prices || [],
        }))
      }
    )

    const variantIdEvents = transform({ response }, ({ response }) => {
      return response.map((v) => {
        return { id: v.id }
      })
    })

    emitEventStep({
      eventName: ProductVariantWorkflowEvents.CREATED,
      data: variantIdEvents,
    })

    const productVariantsCreated = createHook("productVariantsCreated", {
      product_variants: response,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(response, {
      hooks: [productVariantsCreated],
    })
  }
)
