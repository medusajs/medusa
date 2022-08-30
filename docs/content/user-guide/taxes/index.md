# Taxes Overview

In this document, you’ll get an overview of taxes in Medusa and learn about their importance in your ecommerce store.

## Overview

Taxes in Medusas are directly associated with [Regions](../regions/index.md). As regions and countries often have different tax rates and rules, Medusa supports specifying the tax rate for each region.

Taxes are calculated for products and shipping methods on checkout. Medusa provides a default tax provider to calculate the taxes, and merchants and developers can also integrate custom tax providers for advanced calculation of taxes.

![A look at the Taxes page](https://i.imgur.com/JxwB8tu.png)

## How are Taxes Created?

Once a region is created, a default tax rate is created for that region. You can specify the rate and code of the tax rate during the creation of the region.

This also means that tax rates are deleted when a region is deleted.

## Customizing Tax Rates

A region’s default tax rate is applied for all products and shipping options. You can also have more customized tax rates. 

Adding tax rates alongside the default one allows you to override the prices of specific products, product types, or shipping options. This further increase the customization capabilities of your ecommerce store.

![A look at tax rate overrides](https://i.imgur.com/KEDcYQT.png)

## What More Can you Do with Taxes?

In the Medusa admin, you can manage taxes and their settings, and apply further customizations to tax rates. You can learn more in [this guide](./manage.mdx).
