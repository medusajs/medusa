---
description: 'Learn what tax-inclusive pricing is and how it works in Medusa. Tax-inclusive pricing allows merchants to set the final prices for products and shipping options regardless of what tax rate is applicable for the customer.'
---

# Tax Inclusive Pricing

In this document, you’ll learn how tax-inclusive pricing works in Medusa.

:::note

Tax Inclusive Pricing is currently in beta mode and guarded by a feature flag. To use Tax-Inclusive Pricing either:

1. Enable the `MEDUSA_FF_TAX_INCLUSIVE_PRICING` environment variable;
2. Or enable the `tax_inclusive_pricing` key in the Medusa backend's settings.

You can learn more about enabling it in the [feature flags](../../development/feature-flags/toggle.md) documentation.

:::

## Introduction

Tax Inclusive pricing allows you to set the final prices for products and shipping options regardless of the customer's applicable tax rates. When tax-inclusive prices are used, Medusa automatically calculates the tax amount for a given price.

This can be useful when some countries have the same currency but have different tax rates. If you want your prices to be the same across these countries, you have to manage two price lists to account for the tax differences. Using tax-inclusive pricing you only have to specify the price once.

Then, Medusa handles calculating the tax amount using the tax rate and the tax-inclusive price. This is managed in the backend and relayed to accounting and analytics tools.

---

## How is Tax Inclusivity Defined

Tax inclusivity can be toggled for regions, currencies, price lists, and shipping options either during creation or while editing. This is represented by the boolean attribute `includes_tax` available in the entities `Region`, `Currency`, `PriceList`, and `ShippingOption`. By default, this attribute is set to `false`.

If you want to enable or disable this attribute for any of these entities, you can use the create or update endpoints related to these entities as shown in the [Admin API reference](/api/admin/).

The value set for these entities can affect whether line items and shipping methods are tax inclusive or not.

### How is Tax Inclusivity Defined for Line Items

:::info

When a product is added to the cart, a line item is created to represent that product in the cart.

:::

The `LineItem` entity also has the `includes_tax` attribute. The value of this flag is set to `true` if:

- The region of the line item has the `includes_tax` attribute set to `true`;
- Or the currency of the line item has the `includes_tax` attribute set to `true`;
- Or a price list that includes the product variant associated with the line item has the `includes_tax` attribute set to `true`, and the tax-inclusive amount of one of the variant’s prices in the price list is less than the original price of the variant;
- Or one of the variant’s prices in the price list uses a currency or region that has the `includes_tax` attribute set to `true`, and the tax-inclusive amount of the price is less than the original price of the variant.

### How is Tax Inclusivity Defined for Shipping Methods

:::info

When a shipping option is selected, a shipping method is created based on that shipping option. You can learn more about this in the [Shipping Architecture documentation](../carts-and-checkout/shipping.md).

:::

The `ShippingMethod` entity also has the `includes_tax` attribute. Its value is the same as the value of `includes_tax` of the shipping option the method is associated with.

---

## Tax Amount Calculation Formula

When a price is tax-inclusive, the tax amount is calculated using the following formula:

```jsx noReport
const taxAmount = (taxRate * taxInclusivePrice) / (1 + taxRate)
```

Where `taxRate` is the tax rate to be applied to the price, and `taxInclusivePrice` is the price entered by the store operator.

For example, if the tax rate is `0.25` and the price of a product is `100`, the resulting tax amount calculated by Medusa will be `0.25 * 100 / 1.25 = 20`.

---

## Retrieving Tax Amounts

This section covers at which point tax amounts are calculated for different entities, how they are calculated when the price is tax inclusive, and what fields can be returned in the endpoints relative to each of the entities.

:::note

If you have disabled the automatic calculation of taxes in a region, you must [manually calculate the taxes of the line items and the cart](./storefront/manual-calculation.md). Otherwise, taxes will not be calculated or retrieved during checkout for each entity mentioned here.

:::

### Products

Taxes are calculated for each product variant either when a [single product is retrieved](/api/store/#tag/Product/operation/GetProductsProduct) or a [list of products is retrieved](/api/store/#tag/Product/operation/GetProducts).

Among the pricing fields retrieved for each variant, the following fields are relevant to taxes:

- `original_price`: The original price of the variant.
- `calculated_price`: The calculated price, which can be based on prices defined in a price list.
- `original_tax`: The tax amount applied to the original price.
- `calculated_tax`: The tax amount applied to the calculated price.
- `original_price_incl_tax`: The price after applying the tax amount on the original price.
- `calculated_price_incl_tax`: The price after applying the tax amount on the calculated price
- `original_price_includes_tax`: a boolean value indicating whether the amount in `original_price` includes the tax amount by default or not.
- `calculated_price_includes_tax`: a boolean value indicating whether the amount in `calculated_price` includes the tax amount by default or not.

If tax inclusivity is enabled for the current region or currency (based on whether the default price is specified for the region or currency, with region taking a higher precedence):

- `original_price` will include the tax amount by default.
- `original_price_includes_tax` will be set to `true`.
- `original_price_incl_tax` will have the same amount as `original_price`.
- `original_tax` is automatically calculated by Medusa.

Also, for each of the product variant’s prices in a price list, if tax inclusivity is enabled (either if the price list itself has the `includes_tax` attribute set to `true`, or the variant’s price in the price list uses a currency or region that has the `includes_tax` attribute set to `true`), and the amount of the price is less than the original price of the variant:

- `calculated_tax` will include the tax amount by default.
- `calculated_price_includes_tax` will be set to `true`.
- `calculated_price_incl_tax` will have the same amount as `calculated_price`.

:::info

Price lists include a list of prices that can be used to override the original price of a product’s variants.

Each variant’s price in the price list is compared to the variant’s original price using the following condition:

```jsx noReport
amount < (1 + taxRate) * calculatedPrice
```

Where `amount` is the amount of the variant’s price in the price list, `taxRate` is the applied rate, and `calculatedPrice` is the original price of the variant.

:::

Here is an example of these fields when tax inclusivity is enabled for both the currency and the price list:

<!-- eslint-skip -->

```js noReport
{
  original_price: 110,
  calculated_price: 100,
  calculated_price_type: "sale",
  original_price_includes_tax: true,
  calculated_price_includes_tax: true,
  calculated_price_incl_tax: 100,
  calculated_tax: 20,
  original_price_incl_tax: 110,
  original_tax: 22,
}
```

### Line Item

The taxes of line items are calculated and retrieved whenever the [cart is retrieved or updated](/api/store/#tag/Cart).

Each line item returned in any of the cart’s requests has total fields related to the price of the line item and its taxes. Among those fields, the following are relevant to tax-inclusive pricing:

- `unit_price`: The original price of the variant associated with the line item.
- `tax_total`: The total tax amount applied on the original price taking into account any applied discounts as well.
- `original_tax_total`: The total tax amount applied on the original price without taking into account any applied discounts.
- `subtotal`: The total of the line item’s price subtracting the amount in `original_tax_total`.
- `origial_total`: The `subtotal` including the `original_tax_total` amount.

If tax inclusivity is enabled for the line item, `unit_price` will include the tax amount. The tax amount, which will also be the value of `tax_total`, is calculated using [Medusa’s formula for tax inclusive pricing](#tax-amount-calculation-formula) based on the line item’s tax rates. The calculation takes into account any discounts applied on the item, which means the discount amount is deducted from the original price.

Then, the `subtotal` is calculated by subtracting the `tax_total` from the total of the line item’s price. `original_total` has the same value as `subtotal`.

:::info

The total of the line item’s price is the variant’s `unit_price` multiplied by its quantity in the cart.

:::

Finally, `original_tax_total` undergoes the same `tax_total` calculation, however, any discounts applied on the line item are not taken into account. This means the discount amount is not deducted from the original price.

### Shipping Options

Taxes for Shipping Options are calculated and retrieved when the [list of shipping options is retrieved](/api/store/#tag/Shipping-Option).

Among the returned fields for each shipping option, the following are relevant to each of their pricing and taxes:

- `amount`: The original price of the shipping option.
- `price_incl_tax`: The price of the shipping option with tax included.
- `tax_amount`: The tax amount applied to the shipping option.

If tax inclusivity is enabled for the shipping option, `amount` and `price_incl_tax` have the same value. Also, the value of `tax_amount` is calculated using [Medusa’s formula for tax inclusive pricing](#tax-amount-calculation-formula).

### Carts and Orders

Carts and Orders have the same total fields relevant for taxes.

A cart’s totals, including its taxes, are calculated and retrieved whenever the cart is [updated or retrieved](/api/store/#tag/Cart).

An order’s totals, including its taxes, are calculated and retrieved whenever the order is retrieved both on the [storefront](/api/store/#tag/Order) and on the [admin](/api/admin/#tag/Order).

The relevant fields are:

- `shipping_total`: The total tax-exclusive price of the shipping methods used in the cart or order without any applied taxes.
- `tax_total`: The total of the taxes applied on the cart or order, including taxes applied on line items and shipping methods.
- `subtotal`: The subtotal of line items including taxes, but without shipping total.
- `total`: The total of the cart or order, including the subtotal, shipping total, and taxes applied.

During the calculation of the totals of different components of the cart or order, such as shipping or line items, if tax inclusivity is enabled on that component, a process similar to those explained above will be applied to retrieve the total.

---

## See Also

- [Calculate taxes manually](./storefront/manual-calculation.md)
