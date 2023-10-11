---
displayed_sidebar: jsClientSidebar
---

# Interface: IEventBusService

[internal](../modules/internal-8.md).IEventBusService

## Hierarchy

- [`ITransactionBaseService`](internal-8.ITransactionBaseService.md)

  ↳ **`IEventBusService`**

## Implemented by

- [`EventBusService`](../classes/internal-8.internal.EventBusService.md)

## Methods

### emit

▸ **emit**<`T`\>(`event`, `data`, `options?`): `Promise`<`unknown`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `data` | `T` |
| `options?` | `unknown` |

#### Returns

`Promise`<`unknown`\>

#### Defined in

packages/types/dist/event-bus/event-bus.d.ts:6

___

### subscribe

▸ **subscribe**(`eventName`, `subscriber`, `context?`): [`IEventBusService`](internal-8.IEventBusService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `subscriber` | [`Subscriber`](../modules/internal-8.md#subscriber) |
| `context?` | [`SubscriberContext`](../modules/internal-8.md#subscribercontext) |

#### Returns

[`IEventBusService`](internal-8.IEventBusService.md)

#### Defined in

packages/types/dist/event-bus/event-bus.d.ts:4

___

### unsubscribe

▸ **unsubscribe**(`eventName`, `subscriber`, `context?`): [`IEventBusService`](internal-8.IEventBusService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `subscriber` | [`Subscriber`](../modules/internal-8.md#subscriber) |
| `context?` | [`SubscriberContext`](../modules/internal-8.md#subscribercontext) |

#### Returns

[`IEventBusService`](internal-8.IEventBusService.md)

#### Defined in

packages/types/dist/event-bus/event-bus.d.ts:5

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`IEventBusService`](internal-8.IEventBusService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`IEventBusService`](internal-8.IEventBusService.md)

#### Inherited from

[ITransactionBaseService](internal-8.ITransactionBaseService.md).[withTransaction](internal-8.ITransactionBaseService.md#withtransaction)

#### Defined in

packages/types/dist/transaction-base/transaction-base.d.ts:3
