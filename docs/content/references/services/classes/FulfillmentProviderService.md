# Class: FulfillmentProviderService

Helps retrive fulfillment providers

## Hierarchy

- `TransactionBaseService`

  ↳ **`FulfillmentProviderService`**

## Constructors

### constructor

• **new FulfillmentProviderService**(`container`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `container` | `FulfillmentProviderContainer` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:47](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/fulfillment-provider.ts#L47)

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

### container\_

• `Protected` `Readonly` **container\_**: `FulfillmentProviderContainer`

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:43](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/fulfillment-provider.ts#L43)

___

### fulfillmentProviderRepository\_

• `Protected` `Readonly` **fulfillmentProviderRepository\_**: typeof `FulfillmentProviderRepository`

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:45](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/fulfillment-provider.ts#L45)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:40](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/fulfillment-provider.ts#L40)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:41](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/fulfillment-provider.ts#L41)

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

### calculatePrice

▸ **calculatePrice**(`option`, `data`, `cart?`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `option` | `ShippingOption` |
| `data` | `Record`<`string`, `unknown`\> |
| `cart?` | `Cart` \| `Order` |

#### Returns

`Promise`<`number`\>

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:151](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/fulfillment-provider.ts#L151)

___

### canCalculate

▸ **canCalculate**(`option`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `option` | `CalculateOptionPriceInput` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:126](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/fulfillment-provider.ts#L126)

___

### cancelFulfillment

▸ **cancelFulfillment**(`fulfillment`): `Promise`<`Fulfillment`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fulfillment` | `Fulfillment` |

#### Returns

`Promise`<`Fulfillment`\>

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:144](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/fulfillment-provider.ts#L144)

___

### createFulfillment

▸ **createFulfillment**(`method`, `items`, `order`, `fulfillment`): `Promise`<`Record`<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `ShippingMethod` |
| `items` | `LineItem`[] |
| `order` | `CreateFulfillmentOrder` |
| `fulfillment` | `Omit`<`Fulfillment`, ``"beforeInsert"``\> |

#### Returns

`Promise`<`Record`<`string`, `unknown`\>\>

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:111](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/fulfillment-provider.ts#L111)

___

### createReturn

▸ **createReturn**(`returnOrder`): `Promise`<`Record`<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `returnOrder` | `CreateReturnType` |

#### Returns

`Promise`<`Record`<`string`, `unknown`\>\>

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:169](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/fulfillment-provider.ts#L169)

___

### list

▸ **list**(): `Promise`<`FulfillmentProvider`[]\>

#### Returns

`Promise`<`FulfillmentProvider`[]\>

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:71](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/fulfillment-provider.ts#L71)

___

### listFulfillmentOptions

▸ **listFulfillmentOptions**(`providerIds`): `Promise`<`FulfillmentOptions`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `providerIds` | `string`[] |

#### Returns

`Promise`<`FulfillmentOptions`[]\>

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:79](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/fulfillment-provider.ts#L79)

___

### registerInstalledProviders

▸ **registerInstalledProviders**(`providers`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `providers` | `string`[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:57](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/fulfillment-provider.ts#L57)

___

### retrieveDocuments

▸ **retrieveDocuments**(`providerId`, `fulfillmentData`, `documentType`): `Promise`<`any`\>

Fetches documents from the fulfillment provider

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `providerId` | `string` | the id of the provider |
| `fulfillmentData` | `Record`<`string`, `unknown`\> | the data relating to the fulfillment |
| `documentType` | ``"label"`` \| ``"invoice"`` | the typ of |

#### Returns

`Promise`<`any`\>

document to fetch

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:188](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/fulfillment-provider.ts#L188)

___

### retrieveProvider

▸ **retrieveProvider**(`providerId`): `any`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `providerId` | `string` | the provider id |

#### Returns

`any`

the payment fulfillment provider

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:100](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/fulfillment-provider.ts#L100)

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

### validateFulfillmentData

▸ **validateFulfillmentData**(`option`, `data`, `cart`): `Promise`<`Record`<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `option` | `ShippingOption` |
| `data` | `Record`<`string`, `unknown`\> |
| `cart` | `Record`<`string`, `unknown`\> \| `Cart` |

#### Returns

`Promise`<`Record`<`string`, `unknown`\>\>

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:131](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/fulfillment-provider.ts#L131)

___

### validateOption

▸ **validateOption**(`option`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `option` | `ShippingOption` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/medusa/src/services/fulfillment-provider.ts:164](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/fulfillment-provider.ts#L164)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`FulfillmentProviderService`](FulfillmentProviderService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`FulfillmentProviderService`](FulfillmentProviderService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)
