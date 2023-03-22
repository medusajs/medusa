# Class: SystemPaymentProviderService

## Hierarchy

- `TransactionBaseService`

  ↳ **`SystemPaymentProviderService`**

## Constructors

### constructor

• **new SystemPaymentProviderService**(`_`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | `any` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/system-payment-provider.ts:10](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/system-payment-provider.ts#L10)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:11](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L11)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/system-payment-provider.ts:5](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/system-payment-provider.ts#L5)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/system-payment-provider.ts:6](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/system-payment-provider.ts#L6)

___

### identifier

▪ `Static` **identifier**: `string` = `"system"`

#### Defined in

[packages/medusa/src/services/system-payment-provider.ts:8](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/system-payment-provider.ts#L8)

## Methods

### atomicPhase\_

▸ `Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

Wraps some work within a transactional block. If the service already has
a transaction manager attached this will be reused, otherwise a new
transaction manager is created.

#### Type parameters

| Name |
| :------ |
| `TResult` |
| `TError` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

the result of the transactional work

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

___

### authorizePayment

▸ **authorizePayment**(`_`): `Promise`<`Record`<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | `any` |

#### Returns

`Promise`<`Record`<`string`, `unknown`\>\>

#### Defined in

[packages/medusa/src/services/system-payment-provider.ts:26](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/system-payment-provider.ts#L26)

___

### cancelPayment

▸ **cancelPayment**(`_`): `Promise`<`Record`<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | `any` |

#### Returns

`Promise`<`Record`<`string`, `unknown`\>\>

#### Defined in

[packages/medusa/src/services/system-payment-provider.ts:50](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/system-payment-provider.ts#L50)

___

### capturePayment

▸ **capturePayment**(`_`): `Promise`<`Record`<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | `any` |

#### Returns

`Promise`<`Record`<`string`, `unknown`\>\>

#### Defined in

[packages/medusa/src/services/system-payment-provider.ts:42](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/system-payment-provider.ts#L42)

___

### createPayment

▸ **createPayment**(`_`): `Promise`<`Record`<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | `any` |

#### Returns

`Promise`<`Record`<`string`, `unknown`\>\>

#### Defined in

[packages/medusa/src/services/system-payment-provider.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/system-payment-provider.ts#L14)

___

### deletePayment

▸ **deletePayment**(`_`): `Promise`<`Record`<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | `any` |

#### Returns

`Promise`<`Record`<`string`, `unknown`\>\>

#### Defined in

[packages/medusa/src/services/system-payment-provider.ts:38](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/system-payment-provider.ts#L38)

___

### getPaymentData

▸ **getPaymentData**(`_`): `Promise`<`Record`<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | `any` |

#### Returns

`Promise`<`Record`<`string`, `unknown`\>\>

#### Defined in

[packages/medusa/src/services/system-payment-provider.ts:22](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/system-payment-provider.ts#L22)

___

### getStatus

▸ **getStatus**(`_`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | `any` |

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/medusa/src/services/system-payment-provider.ts:18](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/system-payment-provider.ts#L18)

___

### refundPayment

▸ **refundPayment**(`_`): `Promise`<`Record`<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | `any` |

#### Returns

`Promise`<`Record`<`string`, `unknown`\>\>

#### Defined in

[packages/medusa/src/services/system-payment-provider.ts:46](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/system-payment-provider.ts#L46)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:31](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L31)

___

### updatePayment

▸ **updatePayment**(`_`): `Promise`<`Record`<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | `any` |

#### Returns

`Promise`<`Record`<`string`, `unknown`\>\>

#### Defined in

[packages/medusa/src/services/system-payment-provider.ts:34](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/system-payment-provider.ts#L34)

___

### updatePaymentData

▸ **updatePaymentData**(`_`): `Promise`<`Record`<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | `any` |

#### Returns

`Promise`<`Record`<`string`, `unknown`\>\>

#### Defined in

[packages/medusa/src/services/system-payment-provider.ts:30](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/system-payment-provider.ts#L30)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`SystemPaymentProviderService`](SystemPaymentProviderService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`SystemPaymentProviderService`](SystemPaymentProviderService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)
