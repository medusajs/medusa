# Class: DraftOrderService

## Hierarchy

- `TransactionBaseService`<[`DraftOrderService`](DraftOrderService.md)\>

  ↳ **`DraftOrderService`**

## Constructors

### constructor

• **new DraftOrderService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService&lt;DraftOrderService\&gt;.constructor

#### Defined in

[services/draft-order.ts:51](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/draft-order.ts#L51)

## Properties

### cartService\_

• `Protected` `Readonly` **cartService\_**: [`CartService`](CartService.md)

#### Defined in

[services/draft-order.ts:46](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/draft-order.ts#L46)

___

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

### draftOrderRepository\_

• `Protected` `Readonly` **draftOrderRepository\_**: typeof `DraftOrderRepository`

#### Defined in

[services/draft-order.ts:42](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/draft-order.ts#L42)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[services/draft-order.ts:45](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/draft-order.ts#L45)

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[services/draft-order.ts:47](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/draft-order.ts#L47)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[services/draft-order.ts:39](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/draft-order.ts#L39)

___

### orderRepository\_

• `Protected` `Readonly` **orderRepository\_**: typeof `OrderRepository`

#### Defined in

[services/draft-order.ts:44](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/draft-order.ts#L44)

___

### paymentRepository\_

• `Protected` `Readonly` **paymentRepository\_**: typeof `PaymentRepository`

#### Defined in

[services/draft-order.ts:43](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/draft-order.ts#L43)

___

### productVariantService\_

• `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[services/draft-order.ts:48](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/draft-order.ts#L48)

___

### shippingOptionService\_

• `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](ShippingOptionService.md)

#### Defined in

[services/draft-order.ts:49](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/draft-order.ts#L49)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/draft-order.ts:40](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/draft-order.ts#L40)

___

### Events

▪ `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[services/draft-order.ts:34](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/draft-order.ts#L34)

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

▸ **create**(`data`): `Promise`<`DraftOrder`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `AdminPostDraftOrdersReq` |  |

#### Returns

`Promise`<`DraftOrder`\>

#### Defined in

[services/draft-order.ts:257](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/draft-order.ts#L257)

___

### delete

▸ **delete**(`draftOrderId`): `Promise`<`undefined` \| `DraftOrder`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `draftOrderId` | `string` |  |

#### Returns

`Promise`<`undefined` \| `DraftOrder`\>

#### Defined in

[services/draft-order.ts:150](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/draft-order.ts#L150)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`DraftOrder`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` |  |
| `config` | `FindConfig`<`DraftOrder`\> |  |

#### Returns

`Promise`<`DraftOrder`[]\>

#### Defined in

[services/draft-order.ts:231](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/draft-order.ts#L231)

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[`DraftOrder`[], `number`]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` |  |
| `config` | `FindConfig`<`DraftOrder`\> |  |

#### Returns

`Promise`<[`DraftOrder`[], `number`]\>

#### Defined in

[services/draft-order.ts:174](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/draft-order.ts#L174)

___

### registerCartCompletion

▸ **registerCartCompletion**(`draftOrderId`, `orderId`): `Promise`<`UpdateResult`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `draftOrderId` | `string` |  |
| `orderId` | `string` |  |

#### Returns

`Promise`<`UpdateResult`\>

#### Defined in

[services/draft-order.ts:363](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/draft-order.ts#L363)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`DraftOrder`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |
| `config` | `FindConfig`<`DraftOrder`\> |  |

#### Returns

`Promise`<`DraftOrder`\>

#### Defined in

[services/draft-order.ts:91](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/draft-order.ts#L91)

___

### retrieveByCartId

▸ **retrieveByCartId**(`cartId`, `config?`): `Promise`<`DraftOrder`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` |  |
| `config` | `FindConfig`<`DraftOrder`\> |  |

#### Returns

`Promise`<`DraftOrder`\>

#### Defined in

[services/draft-order.ts:121](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/draft-order.ts#L121)

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

▸ **update**(`id`, `data`): `Promise`<`DraftOrder`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |
| `data` | `Object` |  |
| `data.no_notification_order` | `boolean` | - |

#### Returns

`Promise`<`DraftOrder`\>

#### Defined in

[services/draft-order.ts:392](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/draft-order.ts#L392)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`DraftOrderService`](DraftOrderService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`DraftOrderService`](DraftOrderService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
