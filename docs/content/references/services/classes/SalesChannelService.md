# Class: SalesChannelService

## Hierarchy

- `TransactionBaseService`<[`SalesChannelService`](SalesChannelService.md)\>

  ↳ **`SalesChannelService`**

## Constructors

### constructor

• **new SalesChannelService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService&lt;SalesChannelService\&gt;.constructor

#### Defined in

[services/sales-channel.ts:37](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/sales-channel.ts#L37)

## Properties

### configModule

• `Protected` `Optional` `Readonly` **configModule**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.configModule

___

### container

• `Protected` `Readonly` **container**: `unknown`

#### Inherited from

TransactionBaseService.container

___

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[services/sales-channel.ts:34](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/sales-channel.ts#L34)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[services/sales-channel.ts:30](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/sales-channel.ts#L30)

___

### salesChannelRepository\_

• `Protected` `Readonly` **salesChannelRepository\_**: typeof `SalesChannelRepository`

#### Defined in

[services/sales-channel.ts:33](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/sales-channel.ts#L33)

___

### storeService\_

• `Protected` `Readonly` **storeService\_**: [`StoreService`](StoreService.md)

#### Defined in

[services/sales-channel.ts:35](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/sales-channel.ts#L35)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/sales-channel.ts:31](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/sales-channel.ts#L31)

___

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `DELETED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[services/sales-channel.ts:24](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/sales-channel.ts#L24)

## Methods

### atomicPhase\_

▸ `Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

#### Type parameters

| Name |
| :------ |
| `TResult` |
| `TError` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> |  |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |

#### Returns

`Promise`<`TResult`\>

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[interfaces/transaction-base-service.ts:53](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L53)

___

### create

▸ **create**(`data`): `Promise`<`SalesChannel`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `CreateSalesChannelInput` |

#### Returns

`Promise`<`SalesChannel`\>

#### Defined in

[services/sales-channel.ts:102](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/sales-channel.ts#L102)

___

### createDefault

▸ **createDefault**(): `Promise`<`SalesChannel`\>

#### Returns

`Promise`<`SalesChannel`\>

#### Defined in

[services/sales-channel.ts:182](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/sales-channel.ts#L182)

___

### delete

▸ **delete**(`salesChannelId`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `salesChannelId` | `string` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/sales-channel.ts:154](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/sales-channel.ts#L154)

___

### listAndCount

▸ **listAndCount**(`selector?`, `config?`): `Promise`<[`SalesChannel`[], `number`]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | `QuerySelector`<`any`\> |
| `config` | `FindConfig`<`any`\> |

#### Returns

`Promise`<[`SalesChannel`[], `number`]\>

#### Defined in

[services/sales-channel.ts:88](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/sales-channel.ts#L88)

___

### retrieve

▸ **retrieve**(`salesChannelId`, `config?`): `Promise`<`SalesChannel`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `salesChannelId` | `string` |
| `config` | `FindConfig`<`SalesChannel`\> |

#### Returns

`Promise`<`SalesChannel`\>

#### Defined in

[services/sales-channel.ts:59](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/sales-channel.ts#L59)

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Record`<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Inherited from

TransactionBaseService.shouldRetryTransaction\_

#### Defined in

[interfaces/transaction-base-service.ts:34](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L34)

___

### update

▸ **update**(`salesChannelId`, `data`): `Promise`<`SalesChannel`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `salesChannelId` | `string` |
| `data` | `Partial`<`CreateSalesChannelInput`\> |

#### Returns

`Promise`<`SalesChannel`\>

#### Defined in

[services/sales-channel.ts:119](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/sales-channel.ts#L119)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`SalesChannelService`](SalesChannelService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`SalesChannelService`](SalesChannelService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
