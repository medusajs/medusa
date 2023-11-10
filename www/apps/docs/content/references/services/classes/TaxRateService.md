# TaxRateService

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`TaxRateService`**

## Constructors

### constructor

**new TaxRateService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | `Object` |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/tax-rate.ts:30](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-rate.ts#L30)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__configModule__](TransactionBaseService.md#__configmodule__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__container__](TransactionBaseService.md#__container__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__moduleDeclaration__](TransactionBaseService.md#__moduledeclaration__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### productService\_

 `Protected` `Readonly` **productService\_**: [`ProductService`](ProductService.md)

#### Defined in

[packages/medusa/src/services/tax-rate.ts:25](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-rate.ts#L25)

___

### productTypeService\_

 `Protected` `Readonly` **productTypeService\_**: [`ProductTypeService`](ProductTypeService.md)

#### Defined in

[packages/medusa/src/services/tax-rate.ts:26](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-rate.ts#L26)

___

### shippingOptionService\_

 `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](ShippingOptionService.md)

#### Defined in

[packages/medusa/src/services/tax-rate.ts:27](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-rate.ts#L27)

___

### taxRateRepository\_

 `Protected` `Readonly` **taxRateRepository\_**: [`Repository`](Repository.md)<[`TaxRate`](TaxRate.md)\> & { `addToProduct`: Method addToProduct ; `addToProductType`: Method addToProductType ; `addToShippingOption`: Method addToShippingOption ; `applyResolutionsToQueryBuilder`: Method applyResolutionsToQueryBuilder ; `findAndCountWithResolution`: Method findAndCountWithResolution ; `findOneWithResolution`: Method findOneWithResolution ; `findWithResolution`: Method findWithResolution ; `getFindQueryBuilder`: Method getFindQueryBuilder ; `listByProduct`: Method listByProduct ; `listByShippingOption`: Method listByShippingOption ; `removeFromProduct`: Method removeFromProduct ; `removeFromProductType`: Method removeFromProductType ; `removeFromShippingOption`: Method removeFromShippingOption  }

#### Defined in

[packages/medusa/src/services/tax-rate.ts:28](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-rate.ts#L28)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): [`EntityManager`](EntityManager.md)

#### Returns

[`EntityManager`](EntityManager.md)

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

### addToProduct

**addToProduct**(`id`, `productIds`, `replace?`): `Promise`<[`ProductTaxRate`](ProductTaxRate.md) \| [`ProductTaxRate`](ProductTaxRate.md)[]\>

#### Parameters

| Name | Default value |
| :------ | :------ |
| `id` | `string` |
| `productIds` | `string` \| `string`[] |
| `replace` | `boolean` | false |

#### Returns

`Promise`<[`ProductTaxRate`](ProductTaxRate.md) \| [`ProductTaxRate`](ProductTaxRate.md)[]\>

-`Promise`: 
	-`ProductTaxRate \| ProductTaxRate[]`: (optional) 

#### Defined in

[packages/medusa/src/services/tax-rate.ts:191](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-rate.ts#L191)

___

### addToProductType

**addToProductType**(`id`, `productTypeIds`, `replace?`): `Promise`<[`ProductTypeTaxRate`](ProductTypeTaxRate.md)[]\>

#### Parameters

| Name | Default value |
| :------ | :------ |
| `id` | `string` |
| `productTypeIds` | `string` \| `string`[] |
| `replace` | `boolean` | false |

#### Returns

`Promise`<[`ProductTypeTaxRate`](ProductTypeTaxRate.md)[]\>

-`Promise`: 
	-`ProductTypeTaxRate[]`: 
		-`ProductTypeTaxRate`: 

#### Defined in

[packages/medusa/src/services/tax-rate.ts:227](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-rate.ts#L227)

___

### addToShippingOption

**addToShippingOption**(`id`, `optionIds`, `replace?`): `Promise`<[`ShippingTaxRate`](ShippingTaxRate.md)[]\>

#### Parameters

| Name | Default value |
| :------ | :------ |
| `id` | `string` |
| `optionIds` | `string` \| `string`[] |
| `replace` | `boolean` | false |

#### Returns

`Promise`<[`ShippingTaxRate`](ShippingTaxRate.md)[]\>

-`Promise`: 
	-`ShippingTaxRate[]`: 
		-`ShippingTaxRate`: 

#### Defined in

[packages/medusa/src/services/tax-rate.ts:267](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-rate.ts#L267)

___

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
| `isolationOrErrorHandler?` | [`IsolationLevel`](../index.md#isolationlevel) \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[atomicPhase_](TransactionBaseService.md#atomicphase_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### create

**create**(`data`): `Promise`<[`TaxRate`](TaxRate.md)\>

#### Parameters

| Name |
| :------ |
| `data` | [`CreateTaxRateInput`](../index.md#createtaxrateinput) |

#### Returns

`Promise`<[`TaxRate`](TaxRate.md)\>

-`Promise`: 
	-`TaxRate`: 

#### Defined in

[packages/medusa/src/services/tax-rate.ts:94](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-rate.ts#L94)

___

### delete

**delete**(`id`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `id` | `string` \| `string`[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/tax-rate.ts:125](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-rate.ts#L125)

___

### list

**list**(`selector`, `config?`): `Promise`<[`TaxRate`](TaxRate.md)[]\>

#### Parameters

| Name |
| :------ |
| `selector` | [`FilterableTaxRateProps`](../index.md#filterabletaxrateprops) |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`TaxRate`](TaxRate.md)\> |

#### Returns

`Promise`<[`TaxRate`](TaxRate.md)[]\>

-`Promise`: 
	-`TaxRate[]`: 
		-`TaxRate`: 

#### Defined in

[packages/medusa/src/services/tax-rate.ts:45](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-rate.ts#L45)

___

### listAndCount

**listAndCount**(`selector`, `config?`): `Promise`<[[`TaxRate`](TaxRate.md)[], `number`]\>

#### Parameters

| Name |
| :------ |
| `selector` | [`FilterableTaxRateProps`](../index.md#filterabletaxrateprops) |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`TaxRate`](TaxRate.md)\> |

#### Returns

`Promise`<[[`TaxRate`](TaxRate.md)[], `number`]\>

-`Promise`: 
	-`TaxRate[]`: 
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/tax-rate.ts:56](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-rate.ts#L56)

___

### listByProduct

**listByProduct**(`productId`, `config`): `Promise`<[`TaxRate`](TaxRate.md)[]\>

#### Parameters

| Name |
| :------ |
| `productId` | `string` |
| `config` | [`TaxRateListByConfig`](../index.md#taxratelistbyconfig) |

#### Returns

`Promise`<[`TaxRate`](TaxRate.md)[]\>

-`Promise`: 
	-`TaxRate[]`: 
		-`TaxRate`: 

#### Defined in

[packages/medusa/src/services/tax-rate.ts:315](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-rate.ts#L315)

___

### listByShippingOption

**listByShippingOption**(`shippingOptionId`): `Promise`<[`TaxRate`](TaxRate.md)[]\>

#### Parameters

| Name |
| :------ |
| `shippingOptionId` | `string` |

#### Returns

`Promise`<[`TaxRate`](TaxRate.md)[]\>

-`Promise`: 
	-`TaxRate[]`: 
		-`TaxRate`: 

#### Defined in

[packages/medusa/src/services/tax-rate.ts:326](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-rate.ts#L326)

___

### removeFromProduct

**removeFromProduct**(`id`, `productIds`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `id` | `string` |
| `productIds` | `string` \| `string`[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/tax-rate.ts:137](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-rate.ts#L137)

___

### removeFromProductType

**removeFromProductType**(`id`, `typeIds`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `id` | `string` |
| `typeIds` | `string` \| `string`[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/tax-rate.ts:155](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-rate.ts#L155)

___

### removeFromShippingOption

**removeFromShippingOption**(`id`, `optionIds`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `id` | `string` |
| `optionIds` | `string` \| `string`[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/tax-rate.ts:173](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-rate.ts#L173)

___

### retrieve

**retrieve**(`taxRateId`, `config?`): `Promise`<[`TaxRate`](TaxRate.md)\>

#### Parameters

| Name |
| :------ |
| `taxRateId` | `string` |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`TaxRate`](TaxRate.md)\> |

#### Returns

`Promise`<[`TaxRate`](TaxRate.md)\>

-`Promise`: 
	-`TaxRate`: 

#### Defined in

[packages/medusa/src/services/tax-rate.ts:67](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-rate.ts#L67)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

**update**(`id`, `data`): `Promise`<[`TaxRate`](TaxRate.md)\>

#### Parameters

| Name |
| :------ |
| `id` | `string` |
| `data` | [`UpdateTaxRateInput`](../index.md#updatetaxrateinput) |

#### Returns

`Promise`<[`TaxRate`](TaxRate.md)\>

-`Promise`: 
	-`TaxRate`: 

#### Defined in

[packages/medusa/src/services/tax-rate.ts:110](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-rate.ts#L110)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`TaxRateService`](TaxRateService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`TaxRateService`](TaxRateService.md)

-`TaxRateService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
