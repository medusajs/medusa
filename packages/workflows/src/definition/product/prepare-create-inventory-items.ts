import { ProductTypes } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

type AssociationTaggedVariant = ProductTypes.ProductVariantDTO & {
  _associationTag?: string
}

export async function prepareCreateInventoryItems({
  data,
}: WorkflowArguments<{
  products: ProductTypes.ProductDTO[]
}>) {
  const taggedVariants = data.products.reduce(
    (
      acc: ProductTypes.ProductVariantDTO[],
      product: ProductTypes.ProductDTO
    ) => {
      const cleanVariants = product.variants.reduce<AssociationTaggedVariant[]>(
        (acc, variant: AssociationTaggedVariant) => {
          if (!variant.manage_inventory) {
            return acc
          }

          variant._associationTag = variant.id

          acc.push(variant)
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
