---
description: 'Learn about the Currency entity and its relation to other entities. Currencies are used to define the price of products, services, and other monetary details in a commerce system.'
---

# Currency Architecture

In this document, you’ll learn about the Currency entity and its relation to other entities.

## Introduction

Currencies are used to define the price of products, services, and other monetary details in a commerce system.

Medusa supports multi-currency within your commerce store. You can specify prices per currency, and even per region. This means that you can serve customers globally without limitations related to pricing.

---

## Currency Entity Overview

The `Currency` entity has the following attributes:

- `code`: A string indicating the [3 character ISO code](https://en.wikipedia.org/wiki/ISO_4217#Active_codes) for the currency. This attribute also acts as a unique and primary column of the entity.
- `symbol`: A string indicating the display symbol of the currency. This would typically be the symbol you would show to the customer or admin users when displaying a price.
- `symbol_native`: A string indicating the native symbol of the currency.
- `name`: A string indicating the name of the currency.

---

## How Currencies are Created

Currencies are defined in the core of your Medusa backend under `utils/currencies.js` (or `packages/medusa/src/utils/currencies.ts` if you’re using the Medusa mono-repository). They’re defined in an object in that file.

When you run the `migration` or `seed` command the first time on your Medusa server, a migration uses this object to insert all its properties (the currencies) into the database.

So, if you want to add more currencies, you can create a migration that inserts your currencies into the database.

:::tip

You can learn more about Migrations in [this guide](../../development/entities/migrations/overview.mdx).

:::

---

## Relation to Other Entities

### Store

A store has a default currency and can have many currencies. These currencies are then used in other relations, such as when associating a region with a currency.

There are two relations available on the `Store` entity related to the `Currency` entity:

- You can expand the `default_currency` relation on a store and access the default currency with `store.default_currency`. You can also use the `default_currency_code` attribute on the store to access the code of the default currency.
- You can expand the `currencies` relation on a store and access the currencies with `store.currencies`.

### Region

Each region is associated with a currency. A currency can be used in more than one region, but a region can have only one currency.

The relation is available on a region by expanding the `region.currency` relation and accessing `region.currency`. You can also access the currency code through the attribute `currency_code` on the region.

### MoneyAmount

The `MoneyAmount` entity is used to store the price of different entities within your commerce store.

The relation is available on the `MoneyAmount` entity by expanding the `currency` relation and accessing `money_amount.currency`. You can also access the currency code through the attribute `currency_code` on the money amount.

### Order

The `Order` entity includes a relation to the currency, as it is the currency that the order was placed in.

The relation is available on the `Order` entity by expanding the `currency` relation and accessing `order.currency`. You can also access the currency code through the attribute `currency_code` on the order.

### Payment

The `Payment` entity is used to represent a payment of any kind, such as for orders. Each payment is associated with a currency.

The relation is available on the `Payment` entity by expanding the `currency` relation and accessing `payment.currency`. You can also access the currency code through the attribute `currency_code` on the payment.

### PaymentCollection

The `PaymentCollection` entity is used to represent a collection of payments. Each payment collection is associated with a currency.

The relation is available on the `PaymentCollection` entity by expanding the `currency` relation and accessing `payment_collection.currency`. You can also access the currency code through the attribute `currency_code` on the payment collection.

---

## See Also

- [Price Selection Strategy](../../references/price_selection/classes/price_selection.AbstractPriceSelectionStrategy.mdx)
- [Tax-Inclusive Pricing](../taxes/inclusive-pricing.md)
