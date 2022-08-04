# Class: CustomShippingOptionService

## Hierarchy

- `TransactionBaseService`<[`CustomShippingOptionService`](CustomShippingOptionService.md)\>

  ↳ **`CustomShippingOptionService`**

## Constructors

### constructor

• **new CustomShippingOptionService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService&lt;CustomShippingOptionService\&gt;.constructor

#### Defined in

[services/custom-shipping-option.ts:19](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/custom-shipping-option.ts#L19)

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

### customShippingOptionRepository\_

• `Protected` **customShippingOptionRepository\_**: typeof `CustomShippingOptionRepository`

#### Defined in

[services/custom-shipping-option.ts:17](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/custom-shipping-option.ts#L17)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[services/custom-shipping-option.ts:15](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/custom-shipping-option.ts#L15)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/custom-shipping-option.ts:16](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/custom-shipping-option.ts#L16)

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

▸ **create**(`data`): `Promise`<`CustomShippingOption`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `CreateCustomShippingOptionInput` |  |

#### Returns

`Promise`<`CustomShippingOption`\>

#### Defined in

[services/custom-shipping-option.ts:90](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/custom-shipping-option.ts#L90)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`CustomShippingOption`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`CustomShippingOption`\> |  |
| `config` | `FindConfig`<`CustomShippingOption`\> |  |

#### Returns

`Promise`<`CustomShippingOption`[]\>

#### Defined in

[services/custom-shipping-option.ts:65](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/custom-shipping-option.ts#L65)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`CustomShippingOption`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |
| `config` | `FindConfig`<`CustomShippingOption`\> |  |

#### Returns

`Promise`<`CustomShippingOption`\>

#### Defined in

[services/custom-shipping-option.ts:36](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/custom-shipping-option.ts#L36)

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

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`CustomShippingOptionService`](CustomShippingOptionService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`CustomShippingOptionService`](CustomShippingOptionService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
