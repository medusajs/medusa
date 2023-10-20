---
displayed_sidebar: jsClientSidebar
---

# Class: SoftDeletableEntity

[internal](../modules/internal-1.md).SoftDeletableEntity

Base abstract entity for all entities

## Hierarchy

- [`BaseEntity`](internal-1.BaseEntity.md)

  ↳ **`SoftDeletableEntity`**

  ↳↳ [`User`](internal-1.User.md)

  ↳↳ [`BatchJob`](internal-2.BatchJob.md)

  ↳↳ [`ProductCollection`](internal-3.ProductCollection.md)

  ↳↳ [`Product`](internal-3.Product.md)

  ↳↳ [`Image`](internal-3.Image.md)

  ↳↳ [`ProductOption`](internal-3.ProductOption.md)

  ↳↳ [`ProductVariant`](internal-3.ProductVariant.md)

  ↳↳ [`ShippingProfile`](internal-3.ShippingProfile.md)

  ↳↳ [`ProductType`](internal-3.ProductType.md)

  ↳↳ [`ProductTag`](internal-3.ProductTag.md)

  ↳↳ [`SalesChannel`](internal-3.SalesChannel.md)

  ↳↳ [`ProductOptionValue`](internal-3.ProductOptionValue.md)

  ↳↳ [`MoneyAmount`](internal-3.MoneyAmount.md)

  ↳↳ [`ProductVariantInventoryItem`](internal-3.ProductVariantInventoryItem.md)

  ↳↳ [`ShippingOption`](internal-3.ShippingOption.md)

  ↳↳ [`SalesChannelLocation`](internal-3.SalesChannelLocation.md)

  ↳↳ [`PriceList`](internal-3.PriceList.md)

  ↳↳ [`Region`](internal-3.Region.md)

  ↳↳ [`CustomerGroup`](internal-3.CustomerGroup.md)

  ↳↳ [`Customer`](internal-3.Customer.md)

  ↳↳ [`Address`](internal-3.Address.md)

  ↳↳ [`Cart`](internal-3.Cart.md)

  ↳↳ [`Discount`](internal-3.Discount.md)

  ↳↳ [`GiftCard`](internal-3.GiftCard.md)

  ↳↳ [`ClaimOrder`](internal-3.ClaimOrder.md)

  ↳↳ [`Swap`](internal-3.Swap.md)

  ↳↳ [`DiscountRule`](internal-3.DiscountRule.md)

  ↳↳ [`TrackingLink`](internal-3.TrackingLink.md)

  ↳↳ [`ClaimItem`](internal-3.ClaimItem.md)

  ↳↳ [`OrderItemChange`](internal-3.OrderItemChange.md)

  ↳↳ [`PaymentCollection`](internal-3.PaymentCollection.md)

  ↳↳ [`DiscountCondition`](internal-3.DiscountCondition.md)

  ↳↳ [`ReturnReason`](internal-3.ReturnReason.md)

  ↳↳ [`ClaimImage`](internal-3.ClaimImage.md)

  ↳↳ [`ClaimTag`](internal-3.ClaimTag.md)

  ↳↳ [`AnalyticsConfig`](internal-8.internal.AnalyticsConfig.md)

  ↳↳ [`CustomShippingOption`](internal-8.internal.CustomShippingOption.md)

  ↳↳ [`Invite`](internal-8.internal.Invite.md)

  ↳↳ [`Note`](internal-8.internal.Note.md)

  ↳↳ [`ProductVariantMoneyAmount`](internal-8.internal.ProductVariantMoneyAmount.md)

## Properties

### created\_at

• **created\_at**: `Date`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[created_at](internal-1.BaseEntity.md#created_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:6

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Defined in

packages/medusa/dist/interfaces/models/soft-deletable-entity.d.ts:3

___

### id

• **id**: `string`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[id](internal-1.BaseEntity.md#id)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:5

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[updated_at](internal-1.BaseEntity.md#updated_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:7
