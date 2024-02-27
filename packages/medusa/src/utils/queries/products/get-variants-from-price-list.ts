import { MedusaContainer, ProductVariantDTO } from "@medusajs/types"

export async function getVariantsFromPriceList(
  container: MedusaContainer,
  priceListId: string
) {
  const remoteQuery = container.resolve("remoteQuery")

  const query = {
    price_list: {
      __args: { id: [priceListId] },
      price_set_money_amounts: {
        price_set: {
          variant_link: { variant: { fields: ["id", "product_id"] } },
        },
      },
    },
  }

  const priceLists = await remoteQuery(query)
  const variants: ProductVariantDTO[] = []

  priceLists.forEach((priceList) => {
    priceList.price_set_money_amounts?.forEach((psma) => {
      const variant = psma.price_set?.variant_link?.variant

      if (variant) {
        variants.push(variant)
      }
    })
  })

  return variants
}
