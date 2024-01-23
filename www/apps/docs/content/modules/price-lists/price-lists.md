---
description: 'Learn what price lists are and how they work in a Medusa backend. Price Lists can be used to override product prices based on different conditions.'
---

# Price Lists

In this document, you’ll learn what price lists are and how they work.

## What are Price Lists

Price lists can be used to override products’ prices based on different conditions. Each price list you create can have its own options and conditions. A price list must override at least one product variant’s prices.

### Example Use Cases

Price lists can be used for a variety of use cases including:

- Setting different prices for VIP customers.
- Creating sales that run through a specific period of time.
- Implement Buy X for Price Y sale model. In other words, buy X quantity of a product at the price of Y.

### Price List Entity Overview

A price list is stored in the database as a [PriceList](../../references/entities/classes/entities.PriceList.mdx) entity. Some of its important attributes are:

- `type`: The price list's type. Can be either a `sale` or an `override`.
- `status`: The status of the price list. Can be `active` or `draft`. If a price list is a `draft`, its prices won't be applied even if its conditions are met.
- `starts_at`: The date to start applying the price list.
- `ends_at`: The date to stop applying the price list.

---

## Price List Conditions

You can control when a price list is applied using a set of conditions. Only when these conditions are met can the price list be applied.

You can use any of the following conditions:

- **Start and/or expiry date**: You can set a start date, an end date, or both to define when the prices in the list should be applied.
- **Customer group:** You can choose a customer group to apply the prices for. Customers that belong to this group will see the prices you set in the list, which customers that don’t belong to the group can’t see.
- **Minimum and/or maximum quantity:** You can specify the minimum quantity, the maximum quantity, or both minimum and maximum quantities of a product variant required to be in the customer’s cart to apply a price in a price list.
- **Region:** You can specify a specific region where a price in the price list is available in. Only customers accessing your store from that region can see these prices.
- **Currency Code:** You can specify a currency code where a price in the price list is available in. Only customers accessing your store from regions that use this currency can see these prices.

---

## How are Price Lists Applied

When a product or a line item is retrieved or manipulated on the storefront, Medusa determines its price using a Price Selection Strategy. The price selection strategy determines the best price to apply in a given context. Part of determining the price depends on the price list.

:::info

This section explains how the [price selection strategy](../../references/price_selection/interfaces/price_selection.IPriceSelectionStrategy.mdx) uses price lists when it determines the price of a product variant. If you want full details on how the price selection strategy works, check out [this documentation](../../references/price_selection/interfaces/price_selection.IPriceSelectionStrategy.mdx) instead.

:::

### Product Variants

When the strategy calculates the prices of a product variant, it retrieves both the original and the calculated prices of the variant.

The original price depends on the selected region or currency code in the current context, where the region has higher precedence.

The calculated price is the lowest price among all retrieved prices. Retrieved prices can include the original price and the price lists that can be applied. Prices are retrieved based on the provided context, such as region ID or currency code.

In the [Get Product](https://docs.medusajs.com/api/store#products_getproductsproduct) and [List Product](https://docs.medusajs.com/api/store#products_getproducts) API Routes, you must pass either the `region_id` or `currency_code` to retrieve the correct prices, as they are part of the price selection strategy context.

Each variant in the response has the following properties:

- `original_price`: The price based on the region or currency selected. You can also retrieve the original price with tax from the `original_price_incl_tax` property.
- `calculated_price`: The price retrieved from a price list, if there are any. If no price list matches the current context, `calculated_price` will have the same value as `original_price`. You can also retrieve the calculated price with tax from the `calculated_price_incl_tax` property.

If both the `region_id` and `currency_code` aren’t passed to the request, the values of these properties will be `null`.

### Line Items

The total of a line item depends on the price of a product variant. When the line item is created, the price of its underlying product variant is retrieved using the same process detailed in the previous section.

Then, the `unit_price` of the line item is set to the `calculated_price` property of the product variant.

When creating, retrieving, or updating the line item using the API Routes, the line item’s totals are calculated. The following properties are returned as part of the API Routes' responses:

- `unit_price`: The product variant’s calculated price.
- `subtotal`: The `unit_price` multiplied by the quantity of the line item.

Since the line item belongs to a cart, there’s no need to pass the `region_id` or `currency_code` to the requests. The cart’s region and currency are used to determine the context of the price selection.

---

## See Also

- [Price Selection Strategy](../../references/price_selection/classes/price_selection.AbstractPriceSelectionStrategy.mdx)
- [Manage price lists using the admin APIs](./admin/manage-price-lists.mdx)
