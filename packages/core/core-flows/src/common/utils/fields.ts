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
