import { IPricingModuleService, MedusaContainer } from "@medusajs/types"
import { MedusaError, promiseAll } from "@medusajs/utils"

import { ProductVariantService } from "../../services"
import dotenv from "dotenv"
import Logger from "../../loaders/logger"

dotenv.config()

const BATCH_SIZE = 100

export const migrateProductVariantPricing = async function (
  container: MedusaContainer
) {
  const variantService: ProductVariantService = await container.resolve(
    "productVariantService"
  )

  const pricingService: IPricingModuleService = container.resolve(
    "pricingModuleService"
  )

  const link = await container.resolve("remoteLink")

  if (!link) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "Can't migrate money_amounts: Pricing module is not configured correctly"
    )
  }

  const [_, totalCount] = await variantService.listAndCount(
    {},
    { take: BATCH_SIZE, order: { id: "ASC" }, relations: ["prices"] }
  )

  let processedCount = 0
  while (processedCount < totalCount) {
    const [variants] = await variantService.listAndCount(
      {},
      {
        skip: processedCount,
        take: BATCH_SIZE,
        order: { id: "ASC" },
        relations: ["prices"],
      }
    )

    const links: any[] = []

    await promiseAll(
      variants.map(async (variant) => {
        const priceSet = await pricingService.create({
          rules: [{ rule_attribute: "region_id" }],
          prices:
            variant?.prices
              ?.filter(({ price_list_id }) => !price_list_id)
              .map((price) => ({
                rules: {
                  ...(price.region_id ? { region_id: price.region_id } : {}),
                },
                currency_code: price.currency_code,
                min_quantity: price.min_quantity,
                max_quantity: price.max_quantity,
                amount: price.amount,
              })) ?? [],
        })

        links.push({
          productService: {
            variant_id: variant.id,
          },
          pricingService: {
            price_set_id: priceSet.id,
          },
        })
      })
    )
    await link.create(links)

    processedCount += variants.length
    Logger.log(`Processed ${processedCount} of ${totalCount}`)
  }
}
