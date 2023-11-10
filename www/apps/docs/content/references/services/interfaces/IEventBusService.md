# IEventBusService

## Hierarchy

- [`ITransactionBaseService`](ITransactionBaseService.md)

  ↳ **`IEventBusService`**

## Implemented by

- [`EventBusService`](../classes/EventBusService.md)

## Methods

### emit

**emit**<`T`\>(`event`, `data`, `options?`): `Promise`<`unknown`\>

| Name |
| :------ |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `event` | `string` |
| `data` | `T` |
| `options?` | `unknown` |

#### Returns

`Promise`<`unknown`\>

-`Promise`: 
	-`unknown`: (optional) 

#### Defined in

packages/types/dist/event-bus/event-bus.d.ts:6

___

### subscribe

**subscribe**(`eventName`, `subscriber`, `context?`): [`IEventBusService`](IEventBusService.md)

#### Parameters

| Name |
| :------ |
| `eventName` | `string` \| `symbol` |
| `subscriber` | [`Subscriber`](../types/Subscriber.md) |
| `context?` | [`SubscriberContext`](../types/SubscriberContext.md) |

#### Returns

[`IEventBusService`](IEventBusService.md)

-`IEventBusService`: 

#### Defined in

packages/types/dist/event-bus/event-bus.d.ts:4

___

### unsubscribe

**unsubscribe**(`eventName`, `subscriber`, `context?`): [`IEventBusService`](IEventBusService.md)

#### Parameters

| Name |
| :------ |
| `eventName` | `string` \| `symbol` |
| `subscriber` | [`Subscriber`](../types/Subscriber.md) |
| `context?` | [`SubscriberContext`](../types/SubscriberContext.md) |

#### Returns

[`IEventBusService`](IEventBusService.md)

-`IEventBusService`: 

#### Defined in

packages/types/dist/event-bus/event-bus.d.ts:5

___

### withTransaction

**withTransaction**(`transactionManager?`): [`IEventBusService`](IEventBusService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](../classes/EntityManager.md) |

#### Returns

[`IEventBusService`](IEventBusService.md)

-`IEventBusService`: 

#### Inherited from

[ITransactionBaseService](ITransactionBaseService.md).[withTransaction](ITransactionBaseService.md#withtransaction)

#### Defined in

packages/types/dist/transaction-base/transaction-base.d.ts:3
