---
description: 'Learn about taxes in Medusa. This includes learning about the usage of taxes in regions, tax rates, tax providers, and more.'
---

# Taxes Architecture Overview

In this document, you’ll learn about taxes in Medusa.

## Overview

Taxes are fees applied on items and shipping options when making a purchase. Taxes are typically different for each region around the world, both in amount and calculation logic.

In Medusa, there are different ways you can customize taxes, allowing you to implement what works for your setup or the regions your commerce store operates in. You can:

- Create a tax provider that defines the tax lines applied to line items and shipping methods.
- Customize the tax calculation strategy to change how taxes are calculated.
- Override tax rates for specific products, product types, or shipping options in a region using API Routes or services.

---

## Taxes in Regions

Since taxes are different for each country or region, taxes are configured per region.

In the `Region` entity, the following attributes are related to taxes:

- `tax_rate`: a number indicating the default tax rate to be applied in the region.
- `tax_code`: a string indicating the tax code of the region. This can be useful to external systems for accounting purposes.
- `gift_card_taxable`: a boolean value indicating whether gift cards in this region are taxable or not. By default, it’s `true`.
- `automatic_taxes`: a boolean value indicating if taxes should be calculated automatically during checkout in that region. By default, it’s `true`.
- `tax_provider_id`: the ID of the tax provider used in the region. By default, the `system` tax provider is used. The tax provider can also be accessed by expanding the `tax_provider` relation and accessing `region.tax_provider`.
- `includes_tax`: a boolean value indicating if tax-inclusive pricing is enabled in the region. You can learn about tax-inclusive pricing [here](./inclusive-pricing.md).

### Tax Rates

A region has a default tax rate, defined in the `tax_rate` attribute. However, you can override this tax rate for specific products, product types, or shipping options in that region.

This is represented by the `TaxRate` entity. A region can have many tax rates, and the taxes rates can be accessed by expanding the `tax_rates` relation and accessing `region.tax_rates`.

Since a tax rate can be used to override taxes for specific conditions, the `TaxRate` entity has the following relations:

- `products`: an array of products that this tax rate applies to. You can access them by expanding the `products` relation and accessing `tax_rate.products`.
- `product_types`: an array of product types that this tax rate applies to. You can access them by expanding the `product_types` relation and accessing `tax_rate.product_types`.
- `shipping_options`: an array of shipping options that this tax rate applies to. You can access them by expanding the `shipping_options` relation and accessing `tax_rate.shipping_options`.

The `TaxRate` entity’s attributes include:

- `rate`: a number indicating the tax rate to apply for the specified conditions.
- `code`: a string indicating the tax code of this rate.
- `name`: a string indicating the name of the tax rate.
- `region_id`: a string indicating the ID of the region this tax rate applies to. You can also access the region by expanding the `region` relation and accessing `tax_rate.region`.

### Tax Provider

Tax providers are used to return the tax line items for a set of line items and shipping methods during checkout. The Medusa backend has a `system` tax provider. It returns the line items as-is, without making any changes. You can also create your own tax provider that matches your use case.

Each region can use a different tax provider. By default, regions use the `system` tax provider.

For example, the tax provider allows you to use the shipping address of the cart to create tax lines.

---

## Tax Lines

During checkout, taxes are applied to line items and shipping methods as tax lines. The taxes applied to line items are represented by the `LineItemTaxLine` entity, and those applied to shipping methods are represented by the `ShippingMethodTaxLine` entity. Both entities extend the `TaxLine` class, which defines the following attributes:

- `rate`: a number indicating the applied tax rate.
- `name`: a string indicating the name of the tax rate.
- `code`: a string indicating the tax code.

In addition to these attributes, the `LineItemTaxLine` entity has an `item_id` attribute, which is a string indicating the ID of the line item this tax line is applied to. You can also access the line item by expanding the `item` relation and accessing `line_item_tax_line.item`.

On the other hand, the `ShippingMethodTaxLine` has the attributes of `TaxLine` along with the `shipping_method_id` attribute, which is a string indicating the ID of the shipping method this tax line is applied to. You can also access the shipping method by expanding the `shipping_method` relation and accessing `shipping_method_tax_line.shipping_method`.

---

## Tax Calculation Strategy

The tax calculation strategy is used to calculate taxes based on a set of line items, tax lines, and a context during checkout. The strategy is used throughout the Medusa backend, such as when calculating the totals of a cart.

Medusa defines a default tax calculation strategy. It calculates the taxes of line items and shipping methods, and returns the total of the two.

You can override the tax calculation strategy to define a calculation strategy that works for your use case.

---

## See Also

- [Tax Inclusive Pricing](./inclusive-pricing.md)
- [How to calculate taxes manually during checkout](./storefront/manual-calculation.md)
