import { MedusaContainer, ProductTypes } from "@medusajs/types"
import { EntityManager } from "typeorm"
import { PricingService } from "../../services"
import { Product } from "../../models"

export async function createProductsVariantsPrices({
  container,
  manager,
  data,
}: {
  container: MedusaContainer
  manager: EntityManager
  data: {
    products: ProductTypes.ProductDTO[]
  }
}) {
  const pricingService: PricingService = container.resolve("pricingService")
  const pricingServiceTx = pricingService.withTransaction(manager)

  await pricingServiceTx.setProductPrices(data.products as unknown as Product[])
}
