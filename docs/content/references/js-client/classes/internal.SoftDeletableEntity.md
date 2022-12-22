---
displayed_sidebar: jsClientSidebar
---

# Class: SoftDeletableEntity

[internal](../modules/internal.md).SoftDeletableEntity

Base abstract entity for all entities

## Hierarchy

- [`BaseEntity`](internal.BaseEntity.md)

  ↳ **`SoftDeletableEntity`**

  ↳↳ [`Customer`](internal.Customer.md)

  ↳↳ [`Address`](internal.Address.md)

  ↳↳ [`CustomerGroup`](internal.CustomerGroup.md)

  ↳↳ [`Cart`](internal.Cart.md)

  ↳↳ [`Region`](internal.Region.md)

  ↳↳ [`Discount`](internal.Discount.md)

  ↳↳ [`GiftCard`](internal.GiftCard.md)

  ↳↳ [`ClaimOrder`](internal.ClaimOrder.md)

  ↳↳ [`Swap`](internal.Swap.md)

  ↳↳ [`SalesChannel`](internal.SalesChannel.md)

  ↳↳ [`PriceList`](internal.PriceList.md)

  ↳↳ [`DiscountRule`](internal.DiscountRule.md)

  ↳↳ [`ShippingOption`](internal.ShippingOption.md)

  ↳↳ [`TrackingLink`](internal.TrackingLink.md)

  ↳↳ [`ClaimItem`](internal.ClaimItem.md)

  ↳↳ [`OrderItemChange`](internal.OrderItemChange.md)

  ↳↳ [`PaymentCollection`](internal.PaymentCollection.md)

  ↳↳ [`ProductVariant`](internal.ProductVariant.md)

  ↳↳ [`MoneyAmount`](internal.MoneyAmount.md)

  ↳↳ [`Product`](internal.Product.md)

  ↳↳ [`ProductType`](internal.ProductType.md)

  ↳↳ [`DiscountCondition`](internal.DiscountCondition.md)

  ↳↳ [`ShippingProfile`](internal.ShippingProfile.md)

  ↳↳ [`ReturnReason`](internal.ReturnReason.md)

  ↳↳ [`ClaimImage`](internal.ClaimImage.md)

  ↳↳ [`ClaimTag`](internal.ClaimTag.md)

  ↳↳ [`ProductOptionValue`](internal.ProductOptionValue.md)

  ↳↳ [`Image`](internal.Image.md)

  ↳↳ [`ProductOption`](internal.ProductOption.md)

  ↳↳ [`ProductCollection`](internal.ProductCollection.md)

  ↳↳ [`ProductTag`](internal.ProductTag.md)

  ↳↳ [`User`](internal-1.User.md)

  ↳↳ [`BatchJob`](internal-2.BatchJob.md)

  ↳↳ [`Invite`](internal-10.Invite.md)

  ↳↳ [`Note`](internal-11.Note.md)

## Properties

### created\_at

• **created\_at**: `Date`

#### Inherited from

[BaseEntity](internal.BaseEntity.md).[created_at](internal.BaseEntity.md#created_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:6

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Defined in

medusa/dist/interfaces/models/soft-deletable-entity.d.ts:3

___

### id

• **id**: `string`

#### Inherited from

[BaseEntity](internal.BaseEntity.md).[id](internal.BaseEntity.md#id)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:5

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[BaseEntity](internal.BaseEntity.md).[updated_at](internal.BaseEntity.md#updated_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:7
