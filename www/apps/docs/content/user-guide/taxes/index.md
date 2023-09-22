---
sidebar_position: 1
description: 'Medusa admin allows merchants to manage their taxes. Merchants can specify and configure taxes per region.'
---

# Taxes Overview

In this document, you’ll get an overview of taxes in Medusa and learn about their importance in your ecommerce store.

## Overview

Taxes in Medusas are directly associated with [Regions](../regions/index.md). As regions and countries often have different tax rates and rules, Medusa supports specifying the tax rate for each region.

Taxes are calculated for products and shipping methods on checkout. Medusa provides a default tax provider to calculate the taxes, and merchants and developers can also integrate custom tax providers for advanced calculation of taxes.

---

## How are Taxes Created

Once a region is created, a default tax rate is created for that region. You can specify the rate and code of the tax rate during the creation of the region.

This also means that tax rates are deleted when a region is deleted.

---

## Customizing Tax Rates

A region’s default tax rate is applied for all products and shipping options. You can also have more customized tax rates. 

Adding tax rates alongside the default one allows you to override the prices of specific products, product types, or shipping options. This further increase the customization capabilities of your ecommerce store.

---

## Learn More About Taxes

- [Manage Taxes](./manage.md)
- [Manage Tax Rates](./tax-rates.mdx)
- [Manage Tax Overrides](./tax-overrides.mdx)
- [Tax Inclusive Pricing Overview](./tax-inclusive.mdx)
