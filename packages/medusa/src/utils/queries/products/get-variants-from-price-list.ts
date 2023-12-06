import {
  IPricingModuleService,
  IProductModuleService,
  MedusaContainer,
} from "@medusajs/types"

export async function getVariantsFromPriceList(
  container: MedusaContainer,
  priceListId: string
) {
  const remoteQuery = container.resolve("remoteQuery")
  const pricingModuleService: IPricingModuleService = container.resolve(
    "pricingModuleService"
  )
  const productModuleService: IProductModuleService = container.resolve(
    "productModuleService"
  )

  const [priceList] = await pricingModuleService.listPriceLists(
    { id: [priceListId] },
    {
      relations: [
        "price_set_money_amounts",
        "price_set_money_amounts.price_set",
      ],
      select: ["price_set_money_amounts.price_set.id"],
    }
  )

  const priceSetIds = priceList.price_set_money_amounts?.map(
    (psma) => psma.price_set?.id
  )

  const query = {
    product_variant_price_set: {
      __args: {
        price_set_id: priceSetIds,
      },
      fields: ["variant_id", "price_set_id"],
    },
  }

  const variantPriceSets = await remoteQuery(query)
  const variantIds = variantPriceSets.map((vps) => vps.variant_id)

  return await productModuleService.listVariants(
    {
      id: variantIds,
    },
    {
      select: ["product_id"],
    }
  )
}
