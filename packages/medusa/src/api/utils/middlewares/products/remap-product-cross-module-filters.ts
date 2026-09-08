import { isPresent } from "@medusajs/framework/utils"

/**
 * Rewrites product list filter params that target linked modules into nested
 * relation filters that `query.graph` push down via cross-module joins.
 */
export function remapProductCrossModuleFilters(
  filters: Record<string, any>
): void {
  if (isPresent(filters.sales_channel_id)) {
    const salesChannelIds = filters.sales_channel_id

    filters.sales_channels ??= {}
    filters.sales_channels.id = salesChannelIds

    delete filters.sales_channel_id
  }

  if (isPresent(filters.price_list_id)) {
    const priceListIds = filters.price_list_id

    filters.variants ??= {}
    filters.variants.prices ??= {}
    filters.variants.prices.price_list_id = priceListIds

    delete filters.price_list_id
  }
}
