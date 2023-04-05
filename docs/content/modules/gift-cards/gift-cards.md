---
description: 'Learn what gift cards are and how they work in the Medusa backend. Learn about the relations between Gift Cards and other entities.'
---

# Gift Cards

In this document, you’ll learn about Gift Cards and how they work in Medusa.

## Introduction

Gift cards are products that customers can purchase and redeem in their future orders. Gift cards can have different amounts or denominations that a customer can choose from.

When a customer purchases a gift card, they should receive the code for the gift card by email or other type of notification. Then, they can use the code in their future purchases.

---

## Gift Cards as Products

Before a gift card is purchased, it’s essentially a `Product` entity. A store can have only one gift card with unlimited denominations.

The gift card product has an attribute `is_giftcard` set to `true`. Its `options` property includes only one option, which is Denomination. The different denomination values are stored as `variants`.

Once the customer purchases a gift card product, it is transformed into a usable gift card represented by the [GiftCard entity](#giftcard-entity-overview).

---

## Custom Gift Cards

Aside from the gift card product, merchants can create usable gift cards and send directly to customers. These can be used as a reward sent to the customer or another form of discount.

As custom gift cards can be used once they’re created, they’re also represented by the [GiftCard entity](#giftcard-entity-overview).

---

## GiftCard Entity Overview

Some of the [GiftCard](../../references/entities/classes/GiftCard.md) entity’s attributes are:

- `code`: a unique string of random characters. This is the code that the customer can use during their checkout to redeem the gift card.
- `value`: The amount of the gift card. This is the amount the customer purchased, or was gifted in the case of custom gift cards.
- `balance`: The remaining amount of the gift card. If the customer uses the gift card on an order, and the order’s total does not exceed the amount available in the gift card, the remaining balance would be stored in this attribute. When the gift card is first created, `balance` and `value` have the same value.
- `is_disabled`: A boolean value indicating whether a gift card is disabled or not.
- `ends_at`: The expiry date and time of the gift card.
- `tax_rate`: The tax rate applied when calculating the totals of an order. The tax rate’s value is determined based on the following conditions:
  - If the value of `region.gift_cards_taxable` is `false`, the `tax_rate` is `null`;
  - Otherwise, if the merchant or admin user has manually set the value of the tax rate, it is applied;
  - Otherwise, if the region has a tax rate, it’s applied on the gift card. If not, the value of the tax rate is `null`.

---

## Relations to Other Entities

### Region

A gift card must belong to a region. When a customer purchases the gift card, the region they use to purchase the order is associated with the gift card.

For custom gift cards, the merchant specifies the region manually.

The ID of the region is stored in the attribute `region_id`. You can access the region by expanding the `region` relation and accessing `gift_card.region`.

### Order

If the gift card was created because the customer purchased it, it is associated with the placed order.

The ID of the order is stored in the attribute `order_id`. You can access the order by expanding the `order` relation and accessing `gift_card.order`.

You can also access the gift cards used in an order by expanding the `gift_cards` relation on the order and accessing `order.gift_cards`.

---

## See Also

- [Manage gift cards using admin APIs](./admin/manage-gift-cards.mdx)
- [Use gift cards in the storefront](./storefront/use-gift-cards.mdx)
- [Send the customer a gift card](./backend/send-gift-card-to-customer.md)
