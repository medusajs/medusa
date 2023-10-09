import { WorkflowTypes, ProductTypes, InventoryItemDTO } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

type AssociationTaggedVariant = ProductTypes.ProductVariantDTO & {
  _associationTag?: string
}
type ProductHandle = string
type VariantIndexAndInventoryItems = {
  index: number
  inventoryItems: WorkflowTypes.ProductWorkflow.CreateVariantInventoryInputDTO[]
}

type InventoryItemAssociation = {
  /** The variant id that the inventory item should be associated with. */
  _associationTag: string

  /** The inventory item creation input. */
  creationInput?: Partial<InventoryItemDTO>

  /** The inventory item that should be associated with the variant. */
  existingItem?: WorkflowTypes.ProductWorkflow.CreateVariantInventoryInputDTO
}

export async function prepareCreateInventoryItems({
  data,
}: WorkflowArguments<{
  prepare: {
    productsHandleVariantsIndexInventoryItemsMap: Map<
      ProductHandle,
      VariantIndexAndInventoryItems[]
    >
  }
  products: ProductTypes.ProductDTO[]
}>) {
  const taggedVariants = data.products.reduce<InventoryItemAssociation[]>(
    (acc, product: ProductTypes.ProductDTO) => {
      /*
       * An array of VariantIndexAndInventoryItems objects.
       *
       *   {
       *     index: number
       *     inventoryItems: {
       *       inventory_item_id: string
       *       required_quantity: number
       *     }[]
       *   }
       *
       * We can use this to find the inventory items that should be
       * associated with a variant.
       */
      const inventoryVariants =
        data.prepare.productsHandleVariantsIndexInventoryItemsMap.get(
          product.handle!
        )

      /*
       * It is not given that all variants will have inventory items to
       * associate with them. Here we loop through the product's variants and
       * check whether we should create new inventory items or associate
       * existing ones. If there are no inventory items to create/associate
       * we ignore the variant.
       */
      const cleanVariants = product.variants.reduce<InventoryItemAssociation[]>(
        (acc, variant: AssociationTaggedVariant, index: number) => {
          /*
           * We need to create and/or attach inventory items to variants in two
           * cases:
           *  1. Client specified inventory items to associate with the variant
           *  2. Client specified inventory should managed for the variant.
           *
           * In the case of 1. we want to associate existing inventory items.
           * In the case of 2. we want to create new inventory items.
           */

          /*
           * Case 1.
           * Check if there are inventory items to associate with variant.
           */
          const itemsToAssociate = inventoryVariants?.find(
            (iv) => iv.index === index
          )

          if (itemsToAssociate && itemsToAssociate.inventoryItems?.length) {
            const toAssociate = prepareExistingItemsForVariant(
              itemsToAssociate,
              variant
            )
            return acc.concat(toAssociate)
          }

          /*
           * Case 2.
           * We know this variant doesn't have inventory items to associate, but
           * we still need to check if we should create new inventory items.
           *
           * Check if the variant has inventory management enabled and if so,
           * we pass inventory item creation input and the variant id.
           */
          if (!variant.manage_inventory) {
            return acc
          }

          const preparedData = prepareCreationInputForVariant(variant)
          acc.push(preparedData)

          return acc
        },
        []
      )

      return acc.concat(cleanVariants)
    },
    []
  )

  return {
    alias: prepareCreateInventoryItems.aliases.output,
    value: {
      inventoryItems: taggedVariants,
    },
  }
}

function prepareExistingItemsForVariant(
  itemsToAssociate: VariantIndexAndInventoryItems,
  variant: ProductTypes.ProductVariantDTO
) {
  return itemsToAssociate.inventoryItems.map((item) => {
    return {
      existingItem: item,
      _associationTag: variant.id,
    }
  })
}

function prepareCreationInputForVariant(
  variant: ProductTypes.ProductVariantDTO
) {
  return {
    _associationTag: variant.id,
    creationInput: {
      sku: variant.sku,
      origin_country: variant.origin_country,
      hs_code: variant.hs_code,
      mid_code: variant.mid_code,
      material: variant.material,
      weight: variant.weight,
      length: variant.length,
      height: variant.height,
      width: variant.width,
    },
  }
}

prepareCreateInventoryItems.aliases = {
  products: "products",
  output: "prepareCreateInventoryItemsOutput",
}
