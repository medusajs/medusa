---
description: 'Learn what the price selection strategy is in the Medusa backend. The price selection strategy retrieves the best price for a product variant for a specific context.'
---

# Price Selection Strategy

In this document, you’ll learn what a price selection strategy is.

:::note

If you’re interested to learn how to override the price selection strategy, check out [this documentation](./backend/override-price-selection-strategy.md) instead.

:::

## What's a Price Selection Strategy

Medusa provides many features and different ways to control the price of a product variant. This includes price lists and their different conditions, products’ original prices, and taxes.

Medusa uses the `PriceSelectionStrategy` class to retrieve the best price for a product variant for a specific context. This strategy is used whenever products and line items are retrieved or manipulated on the storefront.

---

## PriceSelectionStrategy Overview

The `PriceSelectionStrategy` class extends the `AbstractPriceSelectionStrategy` class. Its main method is the `calculateVariantPrice` which is used to retrieve a product variant’s price in a given context.

### calculateVariantPrice Method

Medusa uses this method to retrieve a product variant’s price when a product variant or line item is retrieved or manipulated. This includes when other entities that product variants and line items belong to are retrieved, such as products and carts respectively.

This method accepts two parameters:

1. The ID of the variant.
2. A [context](#context-object) object.

The method retrieves all the available prices of the variant based on the conditions in the context object.

It returns an object with the following properties:

1. `originalPrice`: The original price of the variant which depends on the selected region or currency code in the context object. If both region ID and currency code are available in the context object, the region has higher precedence.
2. `originalPriceIncludesTax`: A boolean value indicating whether the original price includes taxes or not. This is only available for [Tax-Inclusive Pricing](../taxes/inclusive-pricing.md).
3. `calculatedPrice`: The lowest price among the prices of the product variant retrieved using the context object.
4. `calculatedPriceIncludesTax`: A boolean value indicating whether the calculated price includes taxes or not. This is only available for [Tax-Inclusive Pricing](../taxes/inclusive-pricing.md).
5. `calculatedPriceType`: Either `default` if the `calculatedPrice` is the original price, or the type of the price list applied.
6. `prices`: an array of all the prices of the variant retrieved using the context object. It can include its original price and its price lists if there are any.

:::info

You can learn more about price lists and how they’re used in [this documentation](./price-lists.md).

:::

### Context Object

The context that is passed to the `calculateVariantPrice` method is an object that has the following optional properties:

- `cart_id`: The ID of the customer’s cart. This is used when the prices are being retrieved for the variant of a line item, as it is used to determine the current region and currency code of the context.
- `customer_id`: The ID of the customer. This is used to filter out price lists for a customer group that this customer doesn’t belong to.
- `quantity`: The quantity of the item in the cart. This is used to filter out price lists that have `min_quantity` or `max_quantity` conditions set.
- `region_id`: The ID of the region the customer is using.
- `currency_code`: The currency code the customer is using.
- `include_discount_prices`: A boolean value indicating whether price list prices should be retrieved or not.
- `tax_rates`: The tax rates to be applied. This is only used for [Tax-Inclusive Pricing](../taxes/inclusive-pricing.md).

---

## See Also

- [Override the Price Selection Strategy](./backend/override-price-selection-strategy.md)