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
  creationInput?: Partial<InventoryItemDTO>
  existingItem?: WorkflowTypes.ProductWorkflow.CreateVariantInventoryInputDTO
}

export async function prepareCreateInventoryItems({
  data,
}: WorkflowArguments<{
  prepare: {
    productsHandleVariantsIndexPricesMap: Map<
      ProductHandle,
      VariantIndexAndInventoryItems[]
    >
  }
  products: ProductTypes.ProductDTO[]
}>) {
  const taggedVariants = data.products.reduce<InventoryItemAssociation[]>(
    (acc, product: ProductTypes.ProductDTO) => {
      const inventoryVariants =
        data.prepare.productsHandleVariantsIndexPricesMap.get(product.handle!)

      const cleanVariants = product.variants.reduce<InventoryItemAssociation[]>(
        (acc, variant: AssociationTaggedVariant, index: number) => {
          // We need to create and/or attach inventory items to variants in two
          // cases:
          //  1. The consuming party has specified that inventory should be
          //     managed for the variant and has not provided any existing
          //     inventory items to associate the variant with.
          //  2. The consuming party has specified inventory items that should
          //     be associated with the variant.
          //
          // We want to carry over inventory item ids and required quantities
          // in the case of 2. and we want to create new inventory items in The
          // case of 1.

          // Return early if we don't need to perform inventory operations.
          const itemsToAssociate = inventoryVariants?.find(
            (iv) => iv.index === index
          )

          if (itemsToAssociate && itemsToAssociate.inventoryItems?.length) {
            const toAssociate = itemsToAssociate.inventoryItems.map((item) => {
              return {
                existingItem: item,
                _associationTag: variant.id,
              }
            })

            return acc.concat(toAssociate)
          }

          if (!variant.manage_inventory) {
            return acc
          }

          acc.push({
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
          })
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

prepareCreateInventoryItems.aliases = {
  products: "products",
  output: "prepareCreateInventoryItemsOutput",
}
