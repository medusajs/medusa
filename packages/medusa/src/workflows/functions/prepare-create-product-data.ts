import { MedusaContainer, ProductTypes } from "@medusajs/types"
import { EntityManager } from "typeorm"
import { SalesChannelService, ShippingProfileService } from "../../services"
import { kebabCase } from "@medusajs/utils"
import { FlagRouter } from "../../utils/flag-router"
import SalesChannelFeatureFlag from "../../loaders/feature-flags/sales-channels"

export type CreateProductsInputData = {
  salesChannelIds?: string[]
  shippingProfileId?: string
  product: ProductTypes.CreateProductDTO
}[]

export type CreateProductPreparedData = {
  productsHandleShippingProfileMap: Map<string, string>
  productsHandleSalesChannelsMap: Map<string, string[]>
}

export async function prepareCreateProductData({
  container,
  manager,
  data,
}: {
  container: MedusaContainer
  manager: EntityManager
  data: CreateProductsInputData
}): Promise<CreateProductPreparedData> {
  const productsHandleShippingProfileMap =
    await createProductsShippingProfileMap_({
      container,
      manager,
      data,
    })

  const productsHandleSalesChannelsMap = await createProductsSalesChannelMap_({
    container,
    manager,
    data,
  })

  return {
    productsHandleShippingProfileMap,
    productsHandleSalesChannelsMap,
  }
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

  const productsHandleShippingProfileMap = new Map<string, string>()

  const promises: Promise<any>[] = []
  for (const createProductData of data) {
    const { product } = createProductData
    product.handle ??= kebabCase(product.title)

    let promise
    if (product.is_giftcard) {
      promise = shippingProfileService.retrieveGiftCardDefault()
    } else {
      promise = shippingProfileService.retrieveDefault()
    }

    promise.then((profile) => {
      productsHandleShippingProfileMap.set(product.handle!, profile.id)
    })

    promises.push(promise)
  }

  await Promise.all(promises)

  return productsHandleShippingProfileMap
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

  const productsHandleSalesChannelsMap = new Map<string, string[]>()

  const promises: Promise<any>[] = []
  for (const createProductData of data) {
    const { product } = createProductData
    product.handle = kebabCase(product.title)

    let promise
    if (
      featureFlagRouter.isFeatureEnabled(SalesChannelFeatureFlag.key) &&
      !createProductData.salesChannelIds?.length
    ) {
      promise = salesChannelService
        .withTransaction(manager)
        .retrieveDefault()
        .then((channel) => [channel.id])
    } else {
      promise = Promise.resolve(createProductData.salesChannelIds)
    }

    promise.then((salesChannelIds: string[]) => {
      productsHandleSalesChannelsMap.set(product.handle!, salesChannelIds)
    })

    promises.push(promise)
  }

  await Promise.all(promises)

  return productsHandleSalesChannelsMap
}
