import { isValidElement, ReactNode, useMemo } from "react"
import { Helmet } from "react-helmet-async"
import { UIMatch, useMatches } from "react-router-dom"

const DEFAULT_TITLE = "Medusa"

type RouteHandle = {
  breadcrumb?: (match?: UIMatch) => string | ReactNode
}

/**
 * Attempts to extract a display title from route loader data.
 *
 * The property paths below (e.g. `product.title`, `order.display_id`,
 * `tax_region.country_code`) are coupled to the shape returned by each
 * route's loader. If a loader's data shape changes, this function silently
 * falls back to a generic title rather than throwing — keep this in sync
 * when adding new entity types or renaming loader fields.
 */
export function getTitleFromRouteData(data: unknown): string | null {
  if (!data || typeof data !== "object") {
    return null
  }

  const record = data as Record<string, unknown>

  // Product: { product: { title: string } }
  if (record.product && typeof record.product === "object") {
    const product = record.product as Record<string, unknown>
    if (typeof product.title === "string") {
      return product.title
    }
  }

  // Order: { order: { display_id: number } }
  if (record.order && typeof record.order === "object") {
    const order = record.order as Record<string, unknown>
    if (typeof order.display_id === "number") {
      return `#${order.display_id}`
    }
  }

  // Customer: { customer: { email: string, first_name?: string, last_name?: string } }
  if (record.customer && typeof record.customer === "object") {
    const customer = record.customer as Record<string, unknown>
    if (customer.first_name || customer.last_name) {
      return [customer.first_name, customer.last_name].filter(Boolean).join(" ")
    }
    if (typeof customer.email === "string") {
      return customer.email
    }
  }

  // Collection: { collection: { title: string } }
  if (record.collection && typeof record.collection === "object") {
    const collection = record.collection as Record<string, unknown>
    if (typeof collection.title === "string") {
      return collection.title
    }
  }

  // Category: { product_category: { name: string } }
  if (record.product_category && typeof record.product_category === "object") {
    const category = record.product_category as Record<string, unknown>
    if (typeof category.name === "string") {
      return category.name
    }
  }

  // Promotion: { promotion: { code: string } }
  if (record.promotion && typeof record.promotion === "object") {
    const promotion = record.promotion as Record<string, unknown>
    if (typeof promotion.code === "string") {
      return promotion.code
    }
  }

  // Campaign: { campaign: { name: string } }
  if (record.campaign && typeof record.campaign === "object") {
    const campaign = record.campaign as Record<string, unknown>
    if (typeof campaign.name === "string") {
      return campaign.name
    }
  }

  // Price List: { price_list: { title: string } }
  if (record.price_list && typeof record.price_list === "object") {
    const priceList = record.price_list as Record<string, unknown>
    if (typeof priceList.title === "string") {
      return priceList.title
    }
  }

  // Customer Group: { customer_group: { name: string } }
  if (record.customer_group && typeof record.customer_group === "object") {
    const group = record.customer_group as Record<string, unknown>
    if (typeof group.name === "string") {
      return group.name
    }
  }

  // Region: { region: { name: string } }
  if (record.region && typeof record.region === "object") {
    const region = record.region as Record<string, unknown>
    if (typeof region.name === "string") {
      return region.name
    }
  }

  // Sales Channel: { sales_channel: { name: string } }
  if (record.sales_channel && typeof record.sales_channel === "object") {
    const channel = record.sales_channel as Record<string, unknown>
    if (typeof channel.name === "string") {
      return channel.name
    }
  }

  // Stock Location: { stock_location: { name: string } }
  if (record.stock_location && typeof record.stock_location === "object") {
    const location = record.stock_location as Record<string, unknown>
    if (typeof location.name === "string") {
      return location.name
    }
  }

  // Inventory Item: { inventory_item: { title?: string, sku?: string } }
  if (record.inventory_item && typeof record.inventory_item === "object") {
    const item = record.inventory_item as Record<string, unknown>
    if (typeof item.title === "string") {
      return item.title
    }
    if (typeof item.sku === "string") {
      return item.sku
    }
  }

  // Reservation: { reservation: { id: string } }
  if (record.reservation && typeof record.reservation === "object") {
    const reservation = record.reservation as Record<string, unknown>
    if (typeof reservation.id === "string") {
      return reservation.id
    }
  }

  // API Key: { api_key: { title: string } }
  if (record.api_key && typeof record.api_key === "object") {
    const apiKey = record.api_key as Record<string, unknown>
    if (typeof apiKey.title === "string") {
      return apiKey.title
    }
  }

  // Tax Region: { tax_region: { country_code?: string, province_code?: string } }
  if (record.tax_region && typeof record.tax_region === "object") {
    const taxRegion = record.tax_region as Record<string, unknown>
    if (typeof taxRegion.province_code === "string") {
      return taxRegion.province_code.toUpperCase()
    }
    if (typeof taxRegion.country_code === "string") {
      return taxRegion.country_code.toUpperCase()
    }
  }

  // User: { user: { email: string, first_name?: string, last_name?: string } }
  if (record.user && typeof record.user === "object") {
    const user = record.user as Record<string, unknown>
    if (user.first_name || user.last_name) {
      return [user.first_name, user.last_name].filter(Boolean).join(" ")
    }
    if (typeof user.email === "string") {
      return user.email
    }
  }

  // Product Type: { product_type: { value: string } }
  if (record.product_type && typeof record.product_type === "object") {
    const type = record.product_type as Record<string, unknown>
    if (typeof type.value === "string") {
      return type.value
    }
  }

  // Product Tag: { product_tag: { value: string } }
  if (record.product_tag && typeof record.product_tag === "object") {
    const tag = record.product_tag as Record<string, unknown>
    if (typeof tag.value === "string") {
      return tag.value
    }
  }

  // Workflow Execution: { workflow_execution: { workflow_id: string } }
  if (record.workflow_execution && typeof record.workflow_execution === "object") {
    const execution = record.workflow_execution as Record<string, unknown>
    if (typeof execution.workflow_id === "string") {
      return execution.workflow_id
    }
  }

  // Variant: { variant: { title: string } }
  if (record.variant && typeof record.variant === "object") {
    const variant = record.variant as Record<string, unknown>
    if (typeof variant.title === "string") {
      return variant.title
    }
  }

  // Shipping Profile: { shipping_profile: { name: string } }
  if (record.shipping_profile && typeof record.shipping_profile === "object") {
    const profile = record.shipping_profile as Record<string, unknown>
    if (typeof profile.name === "string") {
      return profile.name
    }
  }

  return null
}

/**
 * Gets the title from a route's breadcrumb function.
 * Returns the string if the breadcrumb returns a string directly.
 */
export function getTitleFromBreadcrumb(
  handle: RouteHandle | undefined,
  match: UIMatch
): string | null {
  if (!handle?.breadcrumb) {
    return null
  }

  try {
    const result = handle.breadcrumb(match)

    // If the breadcrumb returns a string directly, use it
    if (typeof result === "string") {
      return result
    }

    // If it's a React element, we can't extract text from it directly
    // But we can try to get the title from the route data
    if (isValidElement(result)) {
      return getTitleFromRouteData(match.data)
    }

    return null
  } catch {
    return null
  }
}

/**
 * Hook that returns the document title based on the current route.
 *
 * It extracts titles from route handles using:
 * 1. The breadcrumb function result (if it returns a string)
 * 2. The route loader data (for detail pages with React component breadcrumbs)
 *
 * The title format is: "Page Title - Medusa"
 */
export function useDocumentTitle() {
  const matches = useMatches() as UIMatch<unknown, RouteHandle>[]

  const title = useMemo(() => {
    // Get titles from all matched routes (from root to leaf)
    const titles = matches
      .map((match) => getTitleFromBreadcrumb(match.handle, match))
      .filter((t): t is string => t !== null)

    if (titles.length === 0) {
      return DEFAULT_TITLE
    }

    // Use the last (most specific) title
    const pageTitle = titles[titles.length - 1]

    return `${pageTitle} - Medusa`
  }, [matches])

  return title
}

/**
 * Component that renders the document title using react-helmet-async.
 * Should be used within a HelmetProvider.
 */
export function DocumentTitle() {
  const title = useDocumentTitle()

  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  )
}
