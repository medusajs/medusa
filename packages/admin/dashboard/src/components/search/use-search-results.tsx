import { HttpTypes } from "@medusajs/types"
import { keepPreviousData } from "@tanstack/react-query"
import { TFunction } from "i18next"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  useApiKeys,
  useCampaigns,
  useCollections,
  useCustomerGroups,
  useCustomers,
  useInventoryItems,
  useOrders,
  usePriceLists,
  useProductCategories,
  useProducts,
  useProductTags,
  useProductTypes,
  usePromotions,
  useRegions,
  useSalesChannels,
  useShippingProfiles,
  useStockLocations,
  useTaxRegions,
  useUsers,
  useVariants,
} from "../../hooks/api"
import { useReturnReasons } from "../../hooks/api/return-reasons"
import { Shortcut, ShortcutType } from "../../providers/keybind-provider"
import { useGlobalShortcuts } from "../../providers/keybind-provider/hooks"
import { DynamicSearchResult, SearchArea } from "./types"

type UseSearchProps = {
  q?: string
  limit: number
  area?: SearchArea
}

export const useSearchResults = ({
  q,
  limit,
  area = "all",
}: UseSearchProps) => {
  const staticResults = useStaticSearchResults(area)
  const { dynamicResults, isFetching } = useDynamicSearchResults(area, limit, q)

  return {
    staticResults,
    dynamicResults,
    isFetching,
  }
}

const useStaticSearchResults = (currentArea: SearchArea) => {
  const globalCommands = useGlobalShortcuts()

  const results = useMemo(() => {
    const groups = new Map<ShortcutType, Shortcut[]>()

    globalCommands.forEach((command) => {
      const group = groups.get(command.type) || []
      group.push(command)
      groups.set(command.type, group)
    })

    let filteredGroups: [ShortcutType, Shortcut[]][]

    switch (currentArea) {
      case "all":
        filteredGroups = Array.from(groups)
        break
      case "navigation":
        filteredGroups = Array.from(groups).filter(
          ([type]) => type === "pageShortcut" || type === "settingShortcut"
        )
        break
      case "command":
        filteredGroups = Array.from(groups).filter(
          ([type]) => type === "commandShortcut"
        )
        break
      default:
        filteredGroups = []
    }

    return filteredGroups.map(([title, items]) => ({
      title,
      items,
    }))
  }, [globalCommands, currentArea])

  return results
}

const useDynamicSearchResults = (
  currentArea: SearchArea,
  limit: number,
  q?: string
) => {
  const { t } = useTranslation()

  const debouncedSearch = useDebouncedSearch(q, 300)

  const orderResponse = useOrders(
    {
      q: debouncedSearch?.replace(/^#/, ""), // Since we display the ID with a # prefix, it's natural for the user to include it in the search. This will however cause no results to be returned, so we remove the # prefix from the search query.
      limit,
      fields: "id,display_id,email",
    },
    {
      enabled: isAreaEnabled(currentArea, "order"),
      placeholderData: keepPreviousData,
    }
  )

  const productResponse = useProducts(
    {
      q: debouncedSearch,
      limit,
      fields: "id,title,thumbnail",
    },
    {
      enabled: isAreaEnabled(currentArea, "product"),
      placeholderData: keepPreviousData,
    }
  )

  const productVariantResponse = useVariants(
    {
      q: debouncedSearch,
      limit,
      fields: "id,title,sku",
    },
    {
      enabled: isAreaEnabled(currentArea, "productVariant"),
      placeholderData: keepPreviousData,
    }
  )

  const categoryResponse = useProductCategories(
    {
      // TODO: Remove the OR condition once the list endpoint does not throw when q equals an empty string
      q: debouncedSearch || undefined,
      limit,
      fields: "id,name",
    },
    {
      enabled: isAreaEnabled(currentArea, "category"),
      placeholderData: keepPreviousData,
    }
  )

  const collectionResponse = useCollections(
    {
      q: debouncedSearch,
      limit,
      fields: "id,title",
    },
    {
      enabled: isAreaEnabled(currentArea, "collection"),
      placeholderData: keepPreviousData,
    }
  )

  const customerResponse = useCustomers(
    {
      q: debouncedSearch,
      limit,
      fields: "id,email,first_name,last_name",
    },
    {
      enabled: isAreaEnabled(currentArea, "customer"),
      placeholderData: keepPreviousData,
    }
  )

  const customerGroupResponse = useCustomerGroups(
    {
      q: debouncedSearch,
      limit,
      fields: "id,name",
    },
    {
      enabled: isAreaEnabled(currentArea, "customerGroup"),
      placeholderData: keepPreviousData,
    }
  )

  const inventoryResponse = useInventoryItems(
    {
      q: debouncedSearch,
      limit,
      fields: "id,title,sku",
    },
    {
      enabled: isAreaEnabled(currentArea, "inventory"),
      placeholderData: keepPreviousData,
    }
  )

  const promotionResponse = usePromotions(
    {
      q: debouncedSearch,
      limit,
      fields: "id,code",
    },
    {
      enabled: isAreaEnabled(currentArea, "promotion"),
      placeholderData: keepPreviousData,
    }
  )

  const campaignResponse = useCampaigns(
    {
      q: debouncedSearch,
      limit,
      fields: "id,name",
    },
    {
      enabled: isAreaEnabled(currentArea, "campaign"),
      placeholderData: keepPreviousData,
    }
  )

  const priceListResponse = usePriceLists(
    {
      q: debouncedSearch,
      limit,
      fields: "id,title",
    },
    {
      enabled: isAreaEnabled(currentArea, "priceList"),
      placeholderData: keepPreviousData,
    }
  )

  const userResponse = useUsers(
    {
      q: debouncedSearch,
      limit,
      fields: "id,email,first_name,last_name",
    },
    {
      enabled: isAreaEnabled(currentArea, "user"),
      placeholderData: keepPreviousData,
    }
  )

  const regionResponse = useRegions(
    {
      q: debouncedSearch,
      limit,
      fields: "id,name",
    },
    {
      enabled: isAreaEnabled(currentArea, "region"),
      placeholderData: keepPreviousData,
    }
  )

  const taxRegionResponse = useTaxRegions(
    {
      q: debouncedSearch,
      limit,
      fields: "id,country_code,province_code",
    },
    {
      enabled: isAreaEnabled(currentArea, "taxRegion"),
      placeholderData: keepPreviousData,
    }
  )

  const returnReasonResponse = useReturnReasons(
    {
      q: debouncedSearch,
      limit,
      fields: "id,label,value",
    },
    {
      enabled: isAreaEnabled(currentArea, "returnReason"),
      placeholderData: keepPreviousData,
    }
  )

  const salesChannelResponse = useSalesChannels(
    {
      q: debouncedSearch,
      limit,
      fields: "id,name",
    },
    {
      enabled: isAreaEnabled(currentArea, "salesChannel"),
      placeholderData: keepPreviousData,
    }
  )

  const productTypeResponse = useProductTypes(
    {
      q: debouncedSearch,
      limit,
      fields: "id,value",
    },
    {
      enabled: isAreaEnabled(currentArea, "productType"),
      placeholderData: keepPreviousData,
    }
  )

  const productTagResponse = useProductTags(
    {
      q: debouncedSearch,
      limit,
      fields: "id,value",
    },
    {
      enabled: isAreaEnabled(currentArea, "productTag"),
      placeholderData: keepPreviousData,
    }
  )

  const locationResponse = useStockLocations(
    {
      q: debouncedSearch,
      limit,
      fields: "id,name",
    },
    {
      enabled: isAreaEnabled(currentArea, "location"),
      placeholderData: keepPreviousData,
    }
  )

  const shippingProfileResponse = useShippingProfiles(
    {
      q: debouncedSearch,
      limit,
      fields: "id,name",
    },
    {
      enabled: isAreaEnabled(currentArea, "shippingProfile"),
      placeholderData: keepPreviousData,
    }
  )

  const publishableApiKeyResponse = useApiKeys(
    {
      q: debouncedSearch,
      limit,
      fields: "id,title,redacted",
      type: "publishable",
    },
    {
      enabled: isAreaEnabled(currentArea, "publishableApiKey"),
      placeholderData: keepPreviousData,
    }
  )

  const secretApiKeyResponse = useApiKeys(
    {
      q: debouncedSearch,
      limit,
      fields: "id,title,redacted",
      type: "secret",
    },
    {
      enabled: isAreaEnabled(currentArea, "secretApiKey"),
      placeholderData: keepPreviousData,
    }
  )

  const responseMap = useMemo(
    () => ({
      order: orderResponse,
      product: productResponse,
      productVariant: productVariantResponse,
      collection: collectionResponse,
      category: categoryResponse,
      inventory: inventoryResponse,
      customer: customerResponse,
      customerGroup: customerGroupResponse,
      promotion: promotionResponse,
      campaign: campaignResponse,
      priceList: priceListResponse,
      user: userResponse,
      region: regionResponse,
      taxRegion: taxRegionResponse,
      returnReason: returnReasonResponse,
      salesChannel: salesChannelResponse,
      productType: productTypeResponse,
      productTag: productTagResponse,
      location: locationResponse,
      shippingProfile: shippingProfileResponse,
      publishableApiKey: publishableApiKeyResponse,
      secretApiKey: secretApiKeyResponse,
    }),
    [
      orderResponse,
      productResponse,
      productVariantResponse,
      inventoryResponse,
      categoryResponse,
      collectionResponse,
      customerResponse,
      customerGroupResponse,
      promotionResponse,
      campaignResponse,
      priceListResponse,
      userResponse,
      regionResponse,
      taxRegionResponse,
      returnReasonResponse,
      salesChannelResponse,
      productTypeResponse,
      productTagResponse,
      locationResponse,
      shippingProfileResponse,
      publishableApiKeyResponse,
      secretApiKeyResponse,
    ]
  )

  const results = useMemo(() => {
    const groups = Object.entries(responseMap)
      .map(([key, response]) => {
        const area = key as SearchArea
        if (isAreaEnabled(currentArea, area) || currentArea === "all") {
          return transformDynamicSearchResults(area, limit, t, response)
        }
        return null
      })
      .filter(Boolean) // Remove null values

    return groups
  }, [responseMap, currentArea, limit, t])

  const isAreaFetching = useCallback(
    (area: SearchArea): boolean => {
      if (area === "all") {
        return Object.values(responseMap).some(
          (response) => response.isFetching
        )
      }

      return (
        isAreaEnabled(currentArea, area) &&
        responseMap[area as keyof typeof responseMap]?.isFetching
      )
    },
    [currentArea, responseMap]
  )

  const isFetching = useMemo(() => {
    return isAreaFetching(currentArea)
  }, [currentArea, isAreaFetching])

  const dynamicResults = q
    ? (results.filter(
        (group) => !!group && group.items.length > 0
      ) as DynamicSearchResult[])
    : []

  return {
    dynamicResults,
    isFetching,
  }
}

const useDebouncedSearch = (value: string | undefined, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

function isAreaEnabled(area: SearchArea, currentArea: SearchArea) {
  if (area === "all") {
    return true
  }
  if (area === currentArea) {
    return true
  }
  return false
}

type TransformMap = {
  [K in SearchArea]?: {
    dataKey: string
    transform: (item: any) => {
      id: string
      title: string
      subtitle?: string
      to: string
      value: string
      thumbnail?: string
    }
  }
}

const transformMap: TransformMap = {
  order: {
    dataKey: "orders",
    transform: (order: HttpTypes.AdminOrder) => ({
      id: order.id,
      title: `#${order.display_id}`,
      subtitle: order.email ?? undefined,
      to: `/orders/${order.id}`,
      value: `order:${order.id}`,
    }),
  },
  product: {
    dataKey: "products",
    transform: (product: HttpTypes.AdminProduct) => ({
      id: product.id,
      title: product.title,
      to: `/products/${product.id}`,
      thumbnail: product.thumbnail ?? undefined,
      value: `product:${product.id}`,
    }),
  },
  productVariant: {
    dataKey: "variants",
    transform: (variant: HttpTypes.AdminProductVariant) => ({
      id: variant.id,
      title: variant.title!,
      subtitle: variant.sku ?? undefined,
      to: `/products/${variant.product_id}/variants/${variant.id}`,
      value: `variant:${variant.id}`,
    }),
  },
  category: {
    dataKey: "product_categories",
    transform: (category: HttpTypes.AdminProductCategory) => ({
      id: category.id,
      title: category.name,
      to: `/categories/${category.id}`,
      value: `category:${category.id}`,
    }),
  },
  inventory: {
    dataKey: "inventory_items",
    transform: (inventory: HttpTypes.AdminInventoryItem) => ({
      id: inventory.id,
      title: inventory.title ?? "",
      subtitle: inventory.sku ?? undefined,
      to: `/inventory/${inventory.id}`,
      value: `inventory:${inventory.id}`,
    }),
  },
  customer: {
    dataKey: "customers",
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
    dataKey: "customer_groups",
    transform: (customerGroup: HttpTypes.AdminCustomerGroup) => ({
      id: customerGroup.id,
      title: customerGroup.name!,
      to: `/customer-groups/${customerGroup.id}`,
      value: `customerGroup:${customerGroup.id}`,
    }),
  },
  collection: {
    dataKey: "collections",
    transform: (collection: HttpTypes.AdminCollection) => ({
      id: collection.id,
      title: collection.title,
      to: `/collections/${collection.id}`,
      value: `collection:${collection.id}`,
    }),
  },
  promotion: {
    dataKey: "promotions",
    transform: (promotion: HttpTypes.AdminPromotion) => ({
      id: promotion.id,
      title: promotion.code!,
      to: `/promotions/${promotion.id}`,
      value: `promotion:${promotion.id}`,
    }),
  },
  campaign: {
    dataKey: "campaigns",
    transform: (campaign: HttpTypes.AdminCampaign) => ({
      id: campaign.id,
      title: campaign.name,
      to: `/campaigns/${campaign.id}`,
      value: `campaign:${campaign.id}`,
    }),
  },
  priceList: {
    dataKey: "price_lists",
    transform: (priceList: HttpTypes.AdminPriceList) => ({
      id: priceList.id,
      title: priceList.title,
      to: `/price-lists/${priceList.id}`,
      value: `priceList:${priceList.id}`,
    }),
  },
  user: {
    dataKey: "users",
    transform: (user: HttpTypes.AdminUser) => ({
      id: user.id,
      title: `${user.first_name} ${user.last_name}`,
      subtitle: user.email,
      to: `/users/${user.id}`,
      value: `user:${user.id}`,
    }),
  },
  region: {
    dataKey: "regions",
    transform: (region: HttpTypes.AdminRegion) => ({
      id: region.id,
      title: region.name,
      to: `/regions/${region.id}`,
      value: `region:${region.id}`,
    }),
  },
  taxRegion: {
    dataKey: "tax_regions",
    transform: (taxRegion: HttpTypes.AdminTaxRegion) => ({
      id: taxRegion.id,
      title:
        taxRegion.province_code?.toUpperCase() ??
        taxRegion.country_code!.toUpperCase(),
      subtitle: taxRegion.province_code ? taxRegion.country_code! : undefined,
      to: `/tax-regions/${taxRegion.id}`,
      value: `taxRegion:${taxRegion.id}`,
    }),
  },
  returnReason: {
    dataKey: "return_reasons",
    transform: (returnReason: HttpTypes.AdminReturnReason) => ({
      id: returnReason.id,
      title: returnReason.label,
      subtitle: returnReason.value,
      to: `/return-reasons/${returnReason.id}/edit`,
      value: `returnReason:${returnReason.id}`,
    }),
  },
  salesChannel: {
    dataKey: "sales_channels",
    transform: (salesChannel: HttpTypes.AdminSalesChannel) => ({
      id: salesChannel.id,
      title: salesChannel.name,
      to: `/sales-channels/${salesChannel.id}`,
      value: `salesChannel:${salesChannel.id}`,
    }),
  },
  productType: {
    dataKey: "product_types",
    transform: (productType: HttpTypes.AdminProductType) => ({
      id: productType.id,
      title: productType.value,
      to: `/product-types/${productType.id}`,
      value: `productType:${productType.id}`,
    }),
  },
  productTag: {
    dataKey: "product_tags",
    transform: (productTag: HttpTypes.AdminProductTag) => ({
      id: productTag.id,
      title: productTag.value,
      to: `/product-tags/${productTag.id}`,
      value: `productTag:${productTag.id}`,
    }),
  },
  location: {
    dataKey: "stock_locations",
    transform: (location: HttpTypes.AdminStockLocation) => ({
      id: location.id,
      title: location.name,
      to: `/locations/${location.id}`,
      value: `location:${location.id}`,
    }),
  },
  shippingProfile: {
    dataKey: "shipping_profiles",
    transform: (shippingProfile: HttpTypes.AdminShippingProfile) => ({
      id: shippingProfile.id,
      title: shippingProfile.name,
      to: `/shipping-profiles/${shippingProfile.id}`,
      value: `shippingProfile:${shippingProfile.id}`,
    }),
  },
  publishableApiKey: {
    dataKey: "api_keys",
    transform: (apiKey: HttpTypes.AdminApiKeyResponse["api_key"]) => ({
      id: apiKey.id,
      title: apiKey.title,
      subtitle: apiKey.redacted,
      to: `/publishable-api-keys/${apiKey.id}`,
      value: `publishableApiKey:${apiKey.id}`,
    }),
  },
  secretApiKey: {
    dataKey: "api_keys",
    transform: (apiKey: HttpTypes.AdminApiKeyResponse["api_key"]) => ({
      id: apiKey.id,
      title: apiKey.title,
      subtitle: apiKey.redacted,
      to: `/secret-api-keys/${apiKey.id}`,
      value: `secretApiKey:${apiKey.id}`,
    }),
  },
}

function transformDynamicSearchResults<T extends { count: number }>(
  type: SearchArea,
  limit: number,
  t: TFunction,
  response?: T
): DynamicSearchResult | undefined {
  if (!response || !transformMap[type]) {
    return undefined
  }

  const { dataKey, transform } = transformMap[type]!
  const data = response[dataKey as keyof T]

  if (!data || !Array.isArray(data)) {
    return undefined
  }

  return {
    title: t(`app.search.groups.${type}`),
    area: type,
    hasMore: response.count > limit,
    count: response.count,
    items: data.map(transform),
  }
}
