import { ProductTypes } from "@medusajs/types"
import { WorkflowArguments } from "@medusajs/workflows-sdk"

type AssociationTaggedVariant = ProductTypes.ProductVariantDTO & {
  _associationTag?: string
}

type ObjectWithVariant = { variants: ProductTypes.ProductVariantDTO[] }

export async function prepareCreateInventoryItems({
  data,
}: WorkflowArguments<{
  products: ObjectWithVariant[]
}>) {
  const taggedVariants = data.products.reduce<AssociationTaggedVariant[]>(
    (acc, product: ObjectWithVariant) => {
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
