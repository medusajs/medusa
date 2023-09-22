# Namespace: internal

## Classes

- [Discount](../classes/internal-35.Discount.md)
- [GiftCard](../classes/internal-35.GiftCard.md)
- [Item](../classes/internal-35.Item.md)
- [StorePostCartReq](../classes/internal-35.StorePostCartReq.md)
- [StorePostCartsCartPaymentSessionReq](../classes/internal-35.StorePostCartsCartPaymentSessionReq.md)
- [StorePostCartsCartPaymentSessionUpdateReq](../classes/internal-35.StorePostCartsCartPaymentSessionUpdateReq.md)
- [StorePostCartsCartReq](../classes/internal-35.StorePostCartsCartReq.md)
- [StorePostCartsCartShippingMethodReq](../classes/internal-35.StorePostCartsCartShippingMethodReq.md)

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
