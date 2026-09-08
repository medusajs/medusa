import { HttpTypes } from "@medusajs/types"
import type { SearchEntityDefinition } from "./search-entities"

/**
 * Built-in admin search entities, including their "Jump to" shortcuts. The
 * registry in `./search-entities` seeds itself from this map when it is
 * evaluated, which always happens before any app or plugin
 * `search-entities.tsx` file runs — registering an entity requires importing
 * the registry module first. That makes overrides safe in every bundling order
 * without any registration-time bookkeeping.
 */
export const DEFAULT_SEARCH_ENTITIES: Record<string, SearchEntityDefinition> = {
  order: {
    shortcut: {
      keys: { Mac: ["G", "O"] },
      label: (t) => t("app.keyboardShortcuts.navigation.goToOrders"),
      to: "/orders",
    },
    transform: (order: HttpTypes.AdminOrder) => ({
      id: order.id,
      title: `#${order.display_id}`,
      subtitle: order.email ?? undefined,
      to: `/orders/${order.id}`,
      value: `order:${order.id}`,
    }),
  },
  product: {
    shortcut: {
      keys: { Mac: ["G", "P"] },
      label: (t) => t("app.keyboardShortcuts.navigation.goToProducts"),
      to: "/products",
    },
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
    shortcut: {
      keys: { Mac: ["G", "A"] },
      label: (t) => t("app.keyboardShortcuts.navigation.goToCategories"),
      to: "/categories",
    },
    transform: (category: HttpTypes.AdminProductCategory) => ({
      id: category.id,
      title: category.name,
      to: `/categories/${category.id}`,
      value: `category:${category.id}`,
    }),
  },
  inventory: {
    shortcut: {
      keys: { Mac: ["G", "I"] },
      label: (t) => t("app.keyboardShortcuts.navigation.goToInventory"),
      to: "/inventory",
    },
    transform: (inventory: HttpTypes.AdminInventoryItem) => ({
      id: inventory.id,
      title: inventory.title ?? "",
      subtitle: inventory.sku ?? undefined,
      to: `/inventory/${inventory.id}`,
      value: `inventory:${inventory.id}`,
    }),
  },
  customer: {
    shortcut: {
      keys: { Mac: ["G", "U"] },
      label: (t) => t("app.keyboardShortcuts.navigation.goToCustomers"),
      to: "/customers",
    },
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
    shortcut: {
      keys: { Mac: ["G", "G"] },
      label: (t) => t("app.keyboardShortcuts.navigation.goToCustomerGroups"),
      to: "/customer-groups",
    },
    transform: (customerGroup: HttpTypes.AdminCustomerGroup) => ({
      id: customerGroup.id,
      title: customerGroup.name!,
      to: `/customer-groups/${customerGroup.id}`,
      value: `customerGroup:${customerGroup.id}`,
    }),
  },
  collection: {
    shortcut: {
      keys: { Mac: ["G", "C"] },
      label: (t) => t("app.keyboardShortcuts.navigation.goToCollections"),
      to: "/collections",
    },
    transform: (collection: HttpTypes.AdminCollection) => ({
      id: collection.id,
      title: collection.title,
      to: `/collections/${collection.id}`,
      value: `collection:${collection.id}`,
    }),
  },
  promotion: {
    shortcut: {
      keys: { Mac: ["G", "M"] },
      label: (t) => t("app.keyboardShortcuts.navigation.goToPromotions"),
      to: "/promotions",
    },
    transform: (promotion: HttpTypes.AdminPromotion) => ({
      id: promotion.id,
      title: promotion.code!,
      to: `/promotions/${promotion.id}`,
      value: `promotion:${promotion.id}`,
    }),
  },
  campaign: {
    shortcut: {
      keys: { Mac: ["G", "K"] },
      label: (t) => t("app.keyboardShortcuts.navigation.goToCampaigns"),
      to: "/campaigns",
    },
    transform: (campaign: HttpTypes.AdminCampaign) => ({
      id: campaign.id,
      title: campaign.name,
      to: `/campaigns/${campaign.id}`,
      value: `campaign:${campaign.id}`,
    }),
  },
  priceList: {
    shortcut: {
      keys: { Mac: ["G", "L"] },
      label: (t) => t("app.keyboardShortcuts.navigation.goToPriceLists"),
      to: "/price-lists",
    },
    transform: (priceList: HttpTypes.AdminPriceList) => ({
      id: priceList.id,
      title: priceList.title,
      to: `/price-lists/${priceList.id}`,
      value: `priceList:${priceList.id}`,
    }),
  },
  // Navigable, but a reservation is a quantity against an inventory item and a
  // location, with nothing readable to match on — so no `transform`.
  reservation: {
    shortcut: {
      keys: { Mac: ["G", "R"] },
      label: (t) => t("app.keyboardShortcuts.navigation.goToReservations"),
      to: "/reservations",
    },
  },
  user: {
    shortcut: {
      keys: { Mac: ["G", ",", "U"] },
      label: (t) => t("app.keyboardShortcuts.settings.goToUsers"),
      type: "settingShortcut",
      to: "/settings/users",
    },
    transform: (user: HttpTypes.AdminUser) => ({
      id: user.id,
      title: `${user.first_name} ${user.last_name}`,
      subtitle: user.email,
      to: `/settings/users/${user.id}`,
      value: `user:${user.id}`,
    }),
  },
  region: {
    shortcut: {
      keys: { Mac: ["G", ",", "R"] },
      label: (t) => t("app.keyboardShortcuts.settings.goToRegions"),
      type: "settingShortcut",
      to: "/settings/regions",
    },
    transform: (region: HttpTypes.AdminRegion) => ({
      id: region.id,
      title: region.name,
      to: `/settings/regions/${region.id}`,
      value: `region:${region.id}`,
    }),
  },
  taxRegion: {
    shortcut: {
      keys: { Mac: ["G", ",", "T"] },
      label: (t) => t("app.keyboardShortcuts.settings.goToTaxRegions"),
      type: "settingShortcut",
      to: "/settings/tax-regions",
    },
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
    shortcut: {
      keys: { Mac: ["G", ",", "M"] },
      label: (t) => t("app.keyboardShortcuts.settings.goToReturnReasons"),
      type: "settingShortcut",
      to: "/settings/return-reasons",
    },
    transform: (returnReason: HttpTypes.AdminReturnReason) => ({
      id: returnReason.id,
      title: returnReason.label,
      subtitle: returnReason.value,
      to: `/settings/return-reasons/${returnReason.id}/edit`,
      value: `returnReason:${returnReason.id}`,
    }),
  },
  salesChannel: {
    shortcut: {
      keys: { Mac: ["G", ",", "A"] },
      label: (t) => t("app.keyboardShortcuts.settings.goToSalesChannels"),
      type: "settingShortcut",
      to: "/settings/sales-channels",
    },
    transform: (salesChannel: HttpTypes.AdminSalesChannel) => ({
      id: salesChannel.id,
      title: salesChannel.name,
      to: `/settings/sales-channels/${salesChannel.id}`,
      value: `salesChannel:${salesChannel.id}`,
    }),
  },
  productType: {
    shortcut: {
      keys: { Mac: ["G", ",", "P"] },
      label: (t) => t("app.keyboardShortcuts.settings.goToProductTypes"),
      type: "settingShortcut",
      to: "/settings/product-types",
    },
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
    shortcut: {
      keys: { Mac: ["G", ",", "L"] },
      label: (t) => t("app.keyboardShortcuts.settings.goToLocations"),
      type: "settingShortcut",
      to: "/settings/locations",
    },
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
    shortcut: {
      keys: { Mac: ["G", ",", "J"] },
      label: (t) => t("app.keyboardShortcuts.settings.goToPublishableApiKeys"),
      type: "settingShortcut",
      to: "/settings/publishable-api-keys",
    },
    transform: (apiKey: HttpTypes.AdminApiKeyResponse["api_key"]) => ({
      id: apiKey.id,
      title: apiKey.title,
      subtitle: apiKey.redacted,
      to: `/settings/publishable-api-keys/${apiKey.id}`,
      value: `publishableApiKey:${apiKey.id}`,
    }),
  },
  secretApiKey: {
    shortcut: {
      keys: { Mac: ["G", ",", "K"] },
      label: (t) => t("app.keyboardShortcuts.settings.goToSecretApiKeys"),
      type: "settingShortcut",
      to: "/settings/secret-api-keys",
    },
    transform: (apiKey: HttpTypes.AdminApiKeyResponse["api_key"]) => ({
      id: apiKey.id,
      title: apiKey.title,
      subtitle: apiKey.redacted,
      to: `/settings/secret-api-keys/${apiKey.id}`,
      value: `secretApiKey:${apiKey.id}`,
    }),
  },
}
