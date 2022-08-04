# Namespace: internal

## Classes

- [Discount](../classes/internal-30.Discount.md)
- [GiftCard](../classes/internal-30.GiftCard.md)
- [Item](../classes/internal-30.Item.md)
- [StorePostCartReq](../classes/internal-30.StorePostCartReq.md)
- [StorePostCartsCartPaymentSessionReq](../classes/internal-30.StorePostCartsCartPaymentSessionReq.md)
- [StorePostCartsCartPaymentSessionUpdateReq](../classes/internal-30.StorePostCartsCartPaymentSessionUpdateReq.md)
- [StorePostCartsCartReq](../classes/internal-30.StorePostCartsCartReq.md)
- [StorePostCartsCartShippingMethodReq](../classes/internal-30.StorePostCartsCartShippingMethodReq.md)

## Type Aliases

### StoreCartsRes

Ƭ **StoreCartsRes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cart` | `Omit`<[`Cart`](../classes/internal.Cart.md), ``"refundable_amount"`` \| ``"refunded_total"``\> |

#### Defined in

medusa/dist/api/routes/store/carts/index.d.ts:8

___

### StoreCompleteCartRes

Ƭ **StoreCompleteCartRes**: { `data`: [`Cart`](../classes/internal.Cart.md) ; `type`: ``"cart"``  } \| { `data`: [`Order`](../classes/internal.Order.md) ; `type`: ``"order"``  } \| { `data`: [`Swap`](../classes/internal.Swap.md) ; `type`: ``"swap"``  }

#### Defined in

medusa/dist/api/routes/store/carts/index.d.ts:11
