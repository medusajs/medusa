import { HttpTypes } from "@medusajs/types"
import { TFunction } from "i18next"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useAdminSearch } from "../../hooks/api"
import { Shortcut, ShortcutType } from "../../providers/keybind-provider"
import { useGlobalShortcuts } from "../../providers/keybind-provider/hooks"
import { DynamicSearchResult, SearchArea } from "./types"

type UseSearchProps = {
  q?: string
  limit: number
  area?: SearchArea
}

/**
 * Entity names accepted by `/admin/search` for dynamic (data) results.
 * Excludes static areas (`all`, `command`, `navigation`).
 */
const DYNAMIC_SEARCH_ENTITIES = [
  "order",
  "product",
  "productVariant",
  "category",
  "collection",
  "customer",
  "customerGroup",
  "inventory",
  "promotion",
  "campaign",
  "priceList",
  "user",
  "region",
  "taxRegion",
  "returnReason",
  "salesChannel",
  "productType",
  "productTag",
  "location",
  "shippingProfile",
  "publishableApiKey",
  "secretApiKey",
] as const satisfies readonly SearchArea[]

type DynamicSearchEntity = (typeof DYNAMIC_SEARCH_ENTITIES)[number]

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

  const entity = useMemo(() => {
    if (currentArea === "all") {
      return undefined
    }

    if (isDynamicSearchEntity(currentArea)) {
      return [currentArea]
    }

    return undefined
  }, [currentArea])

  const isDynamicArea =
    currentArea === "all" || isDynamicSearchEntity(currentArea)

  const { results, isFetching } = useAdminSearch(
    {
      q: debouncedSearch,
      limit,
      entity,
    },
    {
      enabled: Boolean(debouncedSearch) && isDynamicArea,
    }
  )

  const dynamicResults = useMemo(() => {
    if (!q || !results?.length) {
      return []
    }

    return results
      .map((group) => transformSearchResultGroup(group, limit, t))
      .filter(
        (group): group is DynamicSearchResult =>
          !!group && group.items.length > 0
      )
  }, [q, results, limit, t])

  return {
    dynamicResults,
    isFetching: Boolean(debouncedSearch) && isDynamicArea && isFetching,
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

function isDynamicSearchEntity(area: SearchArea): area is DynamicSearchEntity {
  return (DYNAMIC_SEARCH_ENTITIES as readonly string[]).includes(area)
}

type TransformMap = {
  [K in DynamicSearchEntity]: {
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

function transformSearchResultGroup(
  group: HttpTypes.AdminSearchResultGroup,
  limit: number,
  t: TFunction
): DynamicSearchResult | undefined {
  if (!isDynamicSearchEntity(group.entity as SearchArea)) {
    return undefined
  }

  const area = group.entity as DynamicSearchEntity
  const transform = transformMap[area]?.transform

  if (!transform || !Array.isArray(group.data)) {
    return undefined
  }

  return {
    title: t(`app.search.groups.${area}`),
    area,
    hasMore: group.count > limit,
    count: group.count,
    items: group.data.map(transform),
  }
}
