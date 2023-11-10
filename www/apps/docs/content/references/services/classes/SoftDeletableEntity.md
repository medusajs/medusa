# SoftDeletableEntity

Base abstract entity for all entities

## Hierarchy

- [`BaseEntity`](BaseEntity.md)

  ↳ **`SoftDeletableEntity`**

  ↳↳ [`AnalyticsConfig`](AnalyticsConfig.md)

  ↳↳ [`BatchJob`](BatchJob.md)

  ↳↳ [`Cart`](Cart.md)

  ↳↳ [`Address`](Address.md)

  ↳↳ [`SalesChannel`](SalesChannel.md)

  ↳↳ [`Customer`](Customer.md)

  ↳↳ [`CustomShippingOption`](CustomShippingOption.md)

  ↳↳ [`ClaimOrder`](ClaimOrder.md)

  ↳↳ [`ClaimItem`](ClaimItem.md)

  ↳↳ [`ClaimTag`](ClaimTag.md)

  ↳↳ [`ClaimImage`](ClaimImage.md)

  ↳↳ [`CustomerGroup`](CustomerGroup.md)

  ↳↳ [`Discount`](Discount.md)

  ↳↳ [`DiscountRule`](DiscountRule.md)

  ↳↳ [`GiftCard`](GiftCard.md)

  ↳↳ [`DiscountCondition`](DiscountCondition.md)

  ↳↳ [`TrackingLink`](TrackingLink.md)

  ↳↳ [`ShippingOption`](ShippingOption.md)

  ↳↳ [`Region`](Region.md)

  ↳↳ [`Note`](Note.md)

  ↳↳ [`OrderItemChange`](OrderItemChange.md)

  ↳↳ [`PaymentCollection`](PaymentCollection.md)

  ↳↳ [`PriceList`](PriceList.md)

  ↳↳ [`MoneyAmount`](MoneyAmount.md)

  ↳↳ [`ProductVariant`](ProductVariant.md)

  ↳↳ [`Product`](Product.md)

  ↳↳ [`ProductOption`](ProductOption.md)

  ↳↳ [`ProductType`](ProductType.md)

  ↳↳ [`ProductTag`](ProductTag.md)

  ↳↳ [`Image`](Image.md)

  ↳↳ [`ProductCollection`](ProductCollection.md)

  ↳↳ [`ProductOptionValue`](ProductOptionValue.md)

  ↳↳ [`ProductVariantInventoryItem`](ProductVariantInventoryItem.md)

  ↳↳ [`ReturnReason`](ReturnReason.md)

  ↳↳ [`ShippingProfile`](ShippingProfile.md)

  ↳↳ [`Swap`](Swap.md)

  ↳↳ [`User`](User.md)

  ↳↳ [`SalesChannelLocation`](SalesChannelLocation.md)

## Constructors

### constructor

**new SoftDeletableEntity**()

#### Inherited from

[BaseEntity](BaseEntity.md).[constructor](BaseEntity.md#constructor)

## Properties

### created\_at

 **created\_at**: `Date`

#### Inherited from

[BaseEntity](BaseEntity.md).[created_at](BaseEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### deleted\_at

 **deleted\_at**: ``null`` \| `Date`

#### Defined in

[packages/medusa/src/interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### id

 **id**: `string`

#### Inherited from

[BaseEntity](BaseEntity.md).[id](BaseEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### updated\_at

 **updated\_at**: `Date`

#### Inherited from

[BaseEntity](BaseEntity.md).[updated_at](BaseEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L19)
