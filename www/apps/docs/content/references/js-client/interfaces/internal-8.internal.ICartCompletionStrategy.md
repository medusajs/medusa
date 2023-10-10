---
displayed_sidebar: jsClientSidebar
---

# Interface: ICartCompletionStrategy

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).ICartCompletionStrategy

## Implemented by

- [`AbstractCartCompletionStrategy`](../classes/internal-8.internal.AbstractCartCompletionStrategy.md)

## Methods

### complete

▸ **complete**(`cartId`, `idempotencyKey`, `context`): `Promise`<[`CartCompletionResponse`](../modules/internal-8.internal.md#cartcompletionresponse)\>

Takes a cart id and completes the cart. This for example takes place when
creating an order or confirming a swap.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | the id of the Cart to complete. |
| `idempotencyKey` | [`IdempotencyKey`](../classes/internal-8.internal.IdempotencyKey.md) | the idempotency key for the request |
| `context` | [`RequestContext`](../modules/internal-8.md#requestcontext) | the request context for the completion request |

#### Returns

`Promise`<[`CartCompletionResponse`](../modules/internal-8.internal.md#cartcompletionresponse)\>

the response for the completion request

#### Defined in

packages/medusa/dist/interfaces/cart-completion-strategy.d.ts:19
