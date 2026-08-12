import { HttpTypes } from "@medusajs/types"
import type { SearchEntityDefinition } from "./search-entities"

/**
 * Built-in admin search entities. The registry in `./search-entities` seeds
 * itself from this map when it is evaluated, which always happens before any
 * app or plugin `search-entities.tsx` file runs — registering an entity
 * requires importing the registry module first. That makes overrides safe in
 * every bundling order without any registration-time bookkeeping.
 */
export const DEFAULT_SEARCH_ENTITIES: Record<string, SearchEntityDefinition> = {
  order: {
    transform: (order: HttpTypes.AdminOrder) => ({
      id: order.id,
      title: `#${order.display_id}`,
      subtitle: order.email ?? undefined,
      to: `/orders/${order.id}`,
      value: `order:${order.id}`,
    }),
  },
  product: {
    transform: (product: HttpTypes.AdminProduct) => ({
      id: product.id,
      title: product.title,
      to: `/products/${product.id}`,
      thumbnail: product.thumbnail ?? undefined,
      value: `product:${product.id}`,
    }),
  },
  productVariant: {
    transform: (variant: HttpTypes.AdminProductVariant) => ({
      id: variant.id,
      title: variant.title!,
      subtitle: variant.sku ?? undefined,
      to: `/products/${variant.product_id}/variants/${variant.id}`,
      value: `variant:${variant.id}`,
    }),
  },
  category: {
    transform: (category: HttpTypes.AdminProductCategory) => ({
      id: category.id,
      title: category.name,
      to: `/categories/${category.id}`,
      value: `category:${category.id}`,
    }),
  },
  inventory: {
    transform: (inventory: HttpTypes.AdminInventoryItem) => ({
      id: inventory.id,
      title: inventory.title ?? "",
      subtitle: inventory.sku ?? undefined,
      to: `/inventory/${inventory.id}`,
      value: `inventory:${inventory.id}`,
    }),
  },
  customer: {
    transform: (customer: HttpTypes.AdminCustomer) => {
      const name = [customer.first_name, customer.last_name]
        .filter(Boolean)
        .join(" ")
      return {
        id: customer.id,
        title: name || customer.email,
        subtitle: name ? customer.email : undefined,
        to: `/customers/${customer.id}`,
        value: `customer:${customer.id}`,
      }
    },
  },
  customerGroup: {
    transform: (customerGroup: HttpTypes.AdminCustomerGroup) => ({
      id: customerGroup.id,
      title: customerGroup.name!,
      to: `/customer-groups/${customerGroup.id}`,
      value: `customerGroup:${customerGroup.id}`,
    }),
  },
  collection: {
    transform: (collection: HttpTypes.AdminCollection) => ({
      id: collection.id,
      title: collection.title,
      to: `/collections/${collection.id}`,
      value: `collection:${collection.id}`,
    }),
  },
  promotion: {
    transform: (promotion: HttpTypes.AdminPromotion) => ({
      id: promotion.id,
      title: promotion.code!,
      to: `/promotions/${promotion.id}`,
      value: `promotion:${promotion.id}`,
    }),
  },
  campaign: {
    transform: (campaign: HttpTypes.AdminCampaign) => ({
      id: campaign.id,
      title: campaign.name,
      to: `/campaigns/${campaign.id}`,
      value: `campaign:${campaign.id}`,
    }),
  },
  priceList: {
    transform: (priceList: HttpTypes.AdminPriceList) => ({
      id: priceList.id,
      title: priceList.title,
      to: `/price-lists/${priceList.id}`,
      value: `priceList:${priceList.id}`,
    }),
  },
  user: {
    transform: (user: HttpTypes.AdminUser) => ({
      id: user.id,
      title: `${user.first_name} ${user.last_name}`,
      subtitle: user.email,
      to: `/settings/users/${user.id}`,
      value: `user:${user.id}`,
    }),
  },
  region: {
    transform: (region: HttpTypes.AdminRegion) => ({
      id: region.id,
      title: region.name,
      to: `/settings/regions/${region.id}`,
      value: `region:${region.id}`,
    }),
  },
  taxRegion: {
    transform: (taxRegion: HttpTypes.AdminTaxRegion) => ({
      id: taxRegion.id,
      title:
        taxRegion.province_code?.toUpperCase() ??
        taxRegion.country_code!.toUpperCase(),
      subtitle: taxRegion.province_code ? taxRegion.country_code! : undefined,
      to: `/settings/tax-regions/${taxRegion.id}`,
      value: `taxRegion:${taxRegion.id}`,
    }),
  },
  returnReason: {
    transform: (returnReason: HttpTypes.AdminReturnReason) => ({
      id: returnReason.id,
      title: returnReason.label,
      subtitle: returnReason.value,
      to: `/settings/return-reasons/${returnReason.id}/edit`,
      value: `returnReason:${returnReason.id}`,
    }),
  },
  salesChannel: {
    transform: (salesChannel: HttpTypes.AdminSalesChannel) => ({
      id: salesChannel.id,
      title: salesChannel.name,
      to: `/settings/sales-channels/${salesChannel.id}`,
      value: `salesChannel:${salesChannel.id}`,
    }),
  },
  productType: {
    transform: (productType: HttpTypes.AdminProductType) => ({
      id: productType.id,
      title: productType.value,
      to: `/settings/product-types/${productType.id}`,
      value: `productType:${productType.id}`,
    }),
  },
  productTag: {
    transform: (productTag: HttpTypes.AdminProductTag) => ({
      id: productTag.id,
      title: productTag.value,
      to: `/settings/product-tags/${productTag.id}`,
      value: `productTag:${productTag.id}`,
    }),
  },
  location: {
    transform: (location: HttpTypes.AdminStockLocation) => ({
      id: location.id,
      title: location.name,
      to: `/settings/locations/${location.id}`,
      value: `location:${location.id}`,
    }),
  },
  shippingProfile: {
    transform: (shippingProfile: HttpTypes.AdminShippingProfile) => ({
      id: shippingProfile.id,
      title: shippingProfile.name,
      to: `/settings/locations/shipping-profiles/${shippingProfile.id}`,
      value: `shippingProfile:${shippingProfile.id}`,
    }),
  },
  publishableApiKey: {
    transform: (apiKey: HttpTypes.AdminApiKeyResponse["api_key"]) => ({
      id: apiKey.id,
      title: apiKey.title,
      subtitle: apiKey.redacted,
      to: `/settings/publishable-api-keys/${apiKey.id}`,
      value: `publishableApiKey:${apiKey.id}`,
    }),
  },
  secretApiKey: {
    transform: (apiKey: HttpTypes.AdminApiKeyResponse["api_key"]) => ({
      id: apiKey.id,
      title: apiKey.title,
      subtitle: apiKey.redacted,
      to: `/settings/secret-api-keys/${apiKey.id}`,
      value: `secretApiKey:${apiKey.id}`,
    }),
  },
}
