import { MedusaContainer, ProductTypes } from "@medusajs/types"
import { EntityManager } from "typeorm"
import { SalesChannelService, ShippingProfileService } from "../../services"
import { kebabCase } from "@medusajs/utils"
import { FlagRouter } from "../../utils/flag-router"
import SalesChannelFeatureFlag from "../../loaders/feature-flags/sales-channels"

export type CreateProductsInputData = (ProductTypes.CreateProductDTO & {
  sales_channels?: { id: string }[]
})[]

export type CreateProductsPreparedData = {
  products: ProductTypes.CreateProductDTO[]
  productsHandleShippingProfileMap: Map<string, string>
  productsHandleSalesChannelsMap: Map<string, string[]>
}

export async function prepareCreateProductsData({
  container,
  manager,
  data,
}: {
  container: MedusaContainer
  manager: EntityManager
  data: CreateProductsInputData
}): Promise<CreateProductsPreparedData> {
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

  data = data.map((productData) => {
    delete productData.sales_channels
    return productData
  })

  return {
    products: data as ProductTypes.CreateProductDTO[],
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
  const shippingProfileServiceTx =
    shippingProfileService.withTransaction(manager)

  const [gitCardShippingProfile, defaultShippingProfile] = await Promise.all([
    shippingProfileServiceTx.retrieveGiftCardDefault(),
    shippingProfileServiceTx.retrieveDefault(),
  ])

  const productsHandleShippingProfileMap = new Map<string, string>()

  for (const product of data) {
    product.handle ??= kebabCase(product.title)

    if (product.is_giftcard) {
      productsHandleShippingProfileMap.set(
        product.handle!,
        gitCardShippingProfile!.id
      )
    } else {
      productsHandleShippingProfileMap.set(
        product.handle!,
        defaultShippingProfile!.id
      )
    }
  }

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

  const defaultSalesChannel = await salesChannelService
    .withTransaction(manager)
    .retrieveDefault()

  const productsHandleSalesChannelsMap = new Map<string, string[]>()

  for (const product of data) {
    product.handle = kebabCase(product.title)

    if (
      featureFlagRouter.isFeatureEnabled(SalesChannelFeatureFlag.key) &&
      !product.sales_channels?.length
    ) {
      productsHandleSalesChannelsMap.set(product.handle!, [
        defaultSalesChannel.id,
      ])
    } else {
      productsHandleSalesChannelsMap.set(
        product.handle!,
        product.sales_channels!.map((s) => s.id)
      )
    }
  }

  return productsHandleSalesChannelsMap
}
