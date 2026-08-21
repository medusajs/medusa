/**
 * Cache tags for what the caching module cannot compute from a query resolving a sales
 * channel's stock locations and their fulfillment sets. Must be passed with
 * `computeAutomaticTags: true`, which covers `StockLocation`, `StockLocationAddress` and
 * `FulfillmentSet` - all exposed with their ids in the response.
 *
 * Both hops are link tables, and attaching or detaching a link row emits only that
 * link's events, so no entity tag fires for it.
 *
 * `SalesChannel` stays here rather than being left to computation: it is the queried
 * row rather than a nested one, so whether it exists at all is part of the result, and
 * a channel with no linked locations has no link row to fire on deletion.
 */
export const salesChannelStockLocationCacheTags = [
  "SalesChannel:list:*",
  "LinkSalesChannelStockLocation:list:*",
  "LinkLocationFulfillmentSet:list:*",
]

/**
 * Common fields required for pricing context calculations across different entities
 *
 * @since 2.13.7
 */
export const fieldsForPricingContext = [
  "id",
  "sales_channel_id",
  "currency_code",
  "region_id",
  "shipping_address.city",
  "shipping_address.country_code",
  "shipping_address.province",
  "shipping_address.postal_code",
  "item_total",
  "total",
  "locale",
  "customer.id",
  "email",
  "customer.groups.id",
]
