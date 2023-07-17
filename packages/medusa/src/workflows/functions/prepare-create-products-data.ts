import { MedusaContainer, ProductTypes } from "@medusajs/types"
import { EntityManager } from "typeorm"
import { SalesChannelService, ShippingProfileService } from "../../services"
import { kebabCase } from "@medusajs/utils"
import { FlagRouter } from "../../utils/flag-router"
import SalesChannelFeatureFlag from "../../loaders/feature-flags/sales-channels"
import { SalesChannel } from "../../models"
import { ProductVariantPricesCreateReq } from "../../types/product-variant"
import { AdminPostProductsReq } from "../../api"

export type CreateProductsInputData = AdminPostProductsReq[]

export type CreateProductsPreparedData = {
  products: ProductTypes.CreateProductDTO[]
  productsHandleShippingProfileMap: Map<string, string>
  productsHandleSalesChannelsMap: Map<string, string[]>
  productsHandleVariantsIndexPricesMap: Map<
    string,
    { index: number; prices: ProductVariantPricesCreateReq[] }
  >
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
  const shippingProfileService: ShippingProfileService = container
    .resolve("shippingProfileService")
    .withTransaction(manager)
  const featureFlagRouter: FlagRouter = container.resolve("featureFlagRouter")
  const salesChannelService: SalesChannelService = container
    .resolve("salesChannelService")
    .withTransaction(manager)

  const shippingProfileServiceTx =
    shippingProfileService.withTransaction(manager)

  const [gitCardShippingProfile, defaultShippingProfile] = await Promise.all([
    shippingProfileServiceTx.retrieveGiftCardDefault(),
    shippingProfileServiceTx.retrieveDefault(),
  ])

  let defaultSalesChannel: SalesChannel | undefined
  if (featureFlagRouter.isFeatureEnabled(SalesChannelFeatureFlag.key)) {
    defaultSalesChannel = await salesChannelService
      .withTransaction(manager)
      .retrieveDefault()
  }

  const productsHandleShippingProfileMap = new Map<string, string>()
  const productsHandleSalesChannelsMap = new Map<string, string[]>()
  const productsHandleVariantsIndexPricesMap = new Map<
    string,
    { index: number; prices: ProductVariantPricesCreateReq[] }
  >()

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

    if (
      featureFlagRouter.isFeatureEnabled(SalesChannelFeatureFlag.key) &&
      !product.sales_channels?.length
    ) {
      productsHandleSalesChannelsMap.set(product.handle!, [
        defaultSalesChannel!.id,
      ])
    } else {
      productsHandleSalesChannelsMap.set(
        product.handle!,
        product.sales_channels!.map((s) => s.id)
      )
    }

    if (product.variants) {
      const hasPrices = product.variants.some((variant) => {
        return variant.prices.length > 0
      })

      if (hasPrices) {
        product.variants.forEach((variant, index) => {
          productsHandleVariantsIndexPricesMap.set(product.handle!, {
            index,
            prices: variant.prices,
          })
        })
      }
    }
  }

  data = data.map((productData) => {
    delete productData.sales_channels
    return productData
  })

  return {
    products: data as ProductTypes.CreateProductDTO[],
    productsHandleShippingProfileMap,
    productsHandleSalesChannelsMap,
    productsHandleVariantsIndexPricesMap,
  }
}
