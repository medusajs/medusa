import { MedusaContainer, ProductTypes } from "@medusajs/types"
import { kebabCase } from "@medusajs/utils"
import { SalesChannelService, ShippingProfileService } from "../../services"
import { EntityManager } from "typeorm"
import { FlagRouter } from "../../utils/flag-router"
import SalesChannelFeatureFlag from "../../loaders/feature-flags/sales-channels"

export type CreateProductsInputData = {
  sales_channel_ids?: string[]
  product: ProductTypes.CreateProductDTO
}[]
export async function createProducts({
  container,
  manager,
  data,
}: {
  container: MedusaContainer
  manager: EntityManager
  data: CreateProductsInputData
}): Promise<ProductTypes.ProductDTO[]> {
  const productModuleService: ProductTypes.IProductModuleService =
    container.resolve("productModuleService")

  const productsShippingProfileMap = await createProductsShippingProfileMap_({
    container,
    manager,
    data,
  })

  const productsSalesChannelsMap = await createProductsSalesChannelMap_({
    container,
    manager,
    data,
  })

  return await productModuleService.create(data.map((p) => p.product))
}

export async function createProductsShippingProfileMap_({
  container,
  manager,
  data,
}: {
  container: MedusaContainer
  manager: EntityManager
  data: CreateProductsInputData
}): Promise<Map<string, string>> {
  const shippingProfileService: ShippingProfileService = container
    .resolve("shippingProfileService")
    .withTransaction(manager)

  const productsShippingProfileMap = new Map<string, string>()

  const promises: Promise<any>[] = []
  for (const createProductData of data) {
    const { product } = createProductData
    product.handle = kebabCase(product.title)

    let promise
    if (product.is_giftcard) {
      promise = shippingProfileService.retrieveGiftCardDefault()
    } else {
      promise = shippingProfileService.retrieveDefault()
    }

    promise.then((profile) => {
      productsShippingProfileMap.set(product.handle!, profile.id)
    })

    promises.push(promise)
  }

  await Promise.all(promises)

  return productsShippingProfileMap
}

export async function createProductsSalesChannelMap_({
  container,
  manager,
  data,
}: {
  container: MedusaContainer
  manager: EntityManager
  data: CreateProductsInputData
}): Promise<Map<string, string[]>> {
  const featureFlagRouter: FlagRouter = container.resolve("featureFlagRouter")
  const salesChannelService: SalesChannelService = container
    .resolve("salesChannelService")
    .withTransaction(manager)

  const productsSalesChannelsMap = new Map<string, string[]>()

  const promises: Promise<any>[] = []
  for (const createProductData of data) {
    const { product } = createProductData
    product.handle = kebabCase(product.title)

    let promise
    if (
      featureFlagRouter.isFeatureEnabled(SalesChannelFeatureFlag.key) &&
      !createProductData.sales_channel_ids?.length
    ) {
      promise = salesChannelService
        .withTransaction(manager)
        .retrieveDefault()
        .then((channel) => [channel.id])
    } else {
      promise = Promise.resolve(createProductData.sales_channel_ids)
    }

    promise.then((salesChannelIds: string[]) => {
      productsSalesChannelsMap.set(product.handle!, salesChannelIds)
    })

    promises.push(promise)
  }

  await Promise.all(promises)

  return productsSalesChannelsMap
}
