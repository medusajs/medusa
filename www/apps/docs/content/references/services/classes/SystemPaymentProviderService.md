# SystemPaymentProviderService

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`SystemPaymentProviderService`**

## Constructors

### constructor

**new SystemPaymentProviderService**(`_`)

#### Parameters

| Name |
| :------ |
| `_` | `any` |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/system-payment-provider.ts:6](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/system-payment-provider.ts#L6)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__configModule__](TransactionBaseService.md#__configmodule__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__container__](TransactionBaseService.md#__container__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__moduleDeclaration__](TransactionBaseService.md#__moduledeclaration__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### identifier

 `Static` **identifier**: `string` = `"system"`

#### Defined in

[packages/medusa/src/services/system-payment-provider.ts:4](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/system-payment-provider.ts#L4)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): [`EntityManager`](EntityManager.md)

#### Returns

[`EntityManager`](EntityManager.md)

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

### atomicPhase\_

`Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

Wraps some work within a transactional block. If the service already has
a transaction manager attached this will be reused, otherwise a new
transaction manager is created.

| Name |
| :------ |
| `TResult` | `object` |
| `TError` | `object` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `work` | (`transactionManager`: [`EntityManager`](EntityManager.md)) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | [`IsolationLevel`](../types/IsolationLevel.md) \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[atomicPhase_](TransactionBaseService.md#atomicphase_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### authorizePayment

**authorizePayment**(`_`): `Promise`<Record<`string`, `unknown`\>\>

#### Parameters

| Name |
| :------ |
| `_` | `any` |

#### Returns

`Promise`<Record<`string`, `unknown`\>\>

-`Promise`: 
	-`Record`: 
		-`string`: (optional) 
		-`unknown`: (optional) 

#### Defined in

[packages/medusa/src/services/system-payment-provider.ts:22](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/system-payment-provider.ts#L22)

___

### cancelPayment

**cancelPayment**(`_`): `Promise`<Record<`string`, `unknown`\>\>

#### Parameters

| Name |
| :------ |
| `_` | `any` |

#### Returns

`Promise`<Record<`string`, `unknown`\>\>

-`Promise`: 
	-`Record`: 
		-`string`: (optional) 
		-`unknown`: (optional) 

#### Defined in

[packages/medusa/src/services/system-payment-provider.ts:46](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/system-payment-provider.ts#L46)

___

### capturePayment

**capturePayment**(`_`): `Promise`<Record<`string`, `unknown`\>\>

#### Parameters

| Name |
| :------ |
| `_` | `any` |

#### Returns

`Promise`<Record<`string`, `unknown`\>\>

-`Promise`: 
	-`Record`: 
		-`string`: (optional) 
		-`unknown`: (optional) 

#### Defined in

[packages/medusa/src/services/system-payment-provider.ts:38](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/system-payment-provider.ts#L38)

___

### createPayment

**createPayment**(`_`): `Promise`<Record<`string`, `unknown`\>\>

#### Parameters

| Name |
| :------ |
| `_` | `any` |

#### Returns

`Promise`<Record<`string`, `unknown`\>\>

-`Promise`: 
	-`Record`: 
		-`string`: (optional) 
		-`unknown`: (optional) 

#### Defined in

[packages/medusa/src/services/system-payment-provider.ts:10](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/system-payment-provider.ts#L10)

___

### deletePayment

**deletePayment**(`_`): `Promise`<Record<`string`, `unknown`\>\>

#### Parameters

| Name |
| :------ |
| `_` | `any` |

#### Returns

`Promise`<Record<`string`, `unknown`\>\>

-`Promise`: 
	-`Record`: 
		-`string`: (optional) 
		-`unknown`: (optional) 

#### Defined in

[packages/medusa/src/services/system-payment-provider.ts:34](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/system-payment-provider.ts#L34)

___

### getPaymentData

**getPaymentData**(`_`): `Promise`<Record<`string`, `unknown`\>\>

#### Parameters

| Name |
| :------ |
| `_` | `any` |

#### Returns

`Promise`<Record<`string`, `unknown`\>\>

-`Promise`: 
	-`Record`: 
		-`string`: (optional) 
		-`unknown`: (optional) 

#### Defined in

[packages/medusa/src/services/system-payment-provider.ts:18](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/system-payment-provider.ts#L18)

___

### getStatus

**getStatus**(`_`): `Promise`<`string`\>

#### Parameters

| Name |
| :------ |
| `_` | `any` |

#### Returns

`Promise`<`string`\>

-`Promise`: 
	-`string`: (optional) 

#### Defined in

[packages/medusa/src/services/system-payment-provider.ts:14](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/system-payment-provider.ts#L14)

___

### refundPayment

**refundPayment**(`_`): `Promise`<Record<`string`, `unknown`\>\>

#### Parameters

| Name |
| :------ |
| `_` | `any` |

#### Returns

`Promise`<Record<`string`, `unknown`\>\>

-`Promise`: 
	-`Record`: 
		-`string`: (optional) 
		-`unknown`: (optional) 

#### Defined in

[packages/medusa/src/services/system-payment-provider.ts:42](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/system-payment-provider.ts#L42)

___

### shouldRetryTransaction\_

`Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name |
| :------ |
| `err` | Record<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[shouldRetryTransaction_](TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### updatePayment

**updatePayment**(`_`): `Promise`<Record<`string`, `unknown`\>\>

#### Parameters

| Name |
| :------ |
| `_` | `any` |

#### Returns

`Promise`<Record<`string`, `unknown`\>\>

-`Promise`: 
	-`Record`: 
		-`string`: (optional) 
		-`unknown`: (optional) 

#### Defined in

[packages/medusa/src/services/system-payment-provider.ts:30](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/system-payment-provider.ts#L30)

___

### updatePaymentData

**updatePaymentData**(`_`): `Promise`<Record<`string`, `unknown`\>\>

#### Parameters

| Name |
| :------ |
| `_` | `any` |

#### Returns

`Promise`<Record<`string`, `unknown`\>\>

-`Promise`: 
	-`Record`: 
		-`string`: (optional) 
		-`unknown`: (optional) 

#### Defined in

[packages/medusa/src/services/system-payment-provider.ts:26](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/system-payment-provider.ts#L26)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`SystemPaymentProviderService`](SystemPaymentProviderService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`SystemPaymentProviderService`](SystemPaymentProviderService.md)

-`SystemProviderService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
