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
    productsHandleVariantsIndexInventoryItemsMap: Map<
      ProductHandle,
      VariantIndexAndInventoryItems[]
    >
  }
  products: ProductTypes.ProductDTO[]
}>) {
  const taggedVariants = data.products.reduce<InventoryItemAssociation[]>(
    (acc, product: ProductTypes.ProductDTO) => {
      const inventoryVariants =
        data.prepare.productsHandleVariantsIndexInventoryItemsMap.get(
          product.handle!
        )

      const cleanVariants = product.variants.reduce<InventoryItemAssociation[]>(
        (acc, variant: AssociationTaggedVariant, index: number) => {
          // We need to create and/or attach inventory items to variants in two
          // cases:
          //  1. The consuming party has specified inventory items that should
          //     be associated with the variant.
          //  2. The consuming party has specified that inventory should be
          //     managed for the variant and has not provided any existing
          //     inventory items to associate the variant with.
          //
          // We want to carry over inventory item ids and required quantities
          // in the case of 1. and we want to create new inventory items in The
          // case of 2.

          // Case 1.
          // We check if there are inventory items to associate with the variant
          // and if so, we create an association for each inventory item.
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

          // Case 2.
          // We check if the variant has inventory management enabled and if so,
          // we pass inventory item creation input and the variant id.
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
