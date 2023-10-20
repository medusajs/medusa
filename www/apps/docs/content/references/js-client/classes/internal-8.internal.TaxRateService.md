---
displayed_sidebar: jsClientSidebar
---

# Class: TaxRateService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).TaxRateService

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`TaxRateService`**

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__configModule__](internal-8.internal.TransactionBaseService.md#__configmodule__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:5

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__container__](internal-8.internal.TransactionBaseService.md#__container__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:4

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__moduleDeclaration__](internal-8.internal.TransactionBaseService.md#__moduledeclaration__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:6

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### productService\_

• `Protected` `Readonly` **productService\_**: [`ProductService`](internal-8.internal.ProductService.md)

#### Defined in

packages/medusa/dist/services/tax-rate.d.ts:10

___

### productTypeService\_

• `Protected` `Readonly` **productTypeService\_**: [`ProductTypeService`](internal-8.internal.ProductTypeService.md)

#### Defined in

packages/medusa/dist/services/tax-rate.d.ts:11

___

### shippingOptionService\_

• `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](internal-8.internal.ShippingOptionService.md)

#### Defined in

packages/medusa/dist/services/tax-rate.d.ts:12

___

### taxRateRepository\_

• `Protected` `Readonly` **taxRateRepository\_**: `Repository`<[`TaxRate`](internal-3.TaxRate.md)\> & { `addToProduct`: (`id`: `string`, `productIds`: `string`[], `overrideExisting?`: `boolean`) => `Promise`<[`ProductTaxRate`](internal-8.internal.ProductTaxRate.md)[]\> ; `addToProductType`: (`id`: `string`, `productTypeIds`: `string`[], `overrideExisting?`: `boolean`) => `Promise`<[`ProductTypeTaxRate`](internal-8.internal.ProductTypeTaxRate.md)[]\> ; `addToShippingOption`: (`id`: `string`, `optionIds`: `string`[], `overrideExisting?`: `boolean`) => `Promise`<[`ShippingTaxRate`](internal-8.internal.ShippingTaxRate.md)[]\> ; `applyResolutionsToQueryBuilder`: (`qb`: `SelectQueryBuilder`<[`TaxRate`](internal-3.TaxRate.md)\>, `resolverFields`: `string`[]) => `SelectQueryBuilder`<[`TaxRate`](internal-3.TaxRate.md)\> ; `findAndCountWithResolution`: (`findOptions`: `FindManyOptions`<[`TaxRate`](internal-3.TaxRate.md)\>) => `Promise`<[[`TaxRate`](internal-3.TaxRate.md)[], `number`]\> ; `findOneWithResolution`: (`findOptions`: `FindManyOptions`<[`TaxRate`](internal-3.TaxRate.md)\>) => `Promise`<``null`` \| [`TaxRate`](internal-3.TaxRate.md)\> ; `findWithResolution`: (`findOptions`: `FindManyOptions`<[`TaxRate`](internal-3.TaxRate.md)\>) => `Promise`<[`TaxRate`](internal-3.TaxRate.md)[]\> ; `getFindQueryBuilder`: (`findOptions`: `FindManyOptions`<[`TaxRate`](internal-3.TaxRate.md)\>) => `SelectQueryBuilder`<[`TaxRate`](internal-3.TaxRate.md)\> ; `listByProduct`: (`productId`: `string`, `config`: [`TaxRateListByConfig`](../modules/internal-8.md#taxratelistbyconfig)) => `Promise`<[`TaxRate`](internal-3.TaxRate.md)[]\> ; `listByShippingOption`: (`optionId`: `string`) => `Promise`<[`TaxRate`](internal-3.TaxRate.md)[]\> ; `removeFromProduct`: (`id`: `string`, `productIds`: `string`[]) => `Promise`<`DeleteResult`\> ; `removeFromProductType`: (`id`: `string`, `productTypeIds`: `string`[]) => `Promise`<`DeleteResult`\> ; `removeFromShippingOption`: (`id`: `string`, `optionIds`: `string`[]) => `Promise`<`DeleteResult`\>  }

#### Defined in

packages/medusa/dist/services/tax-rate.d.ts:13

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:9

## Methods

### addToProduct

▸ **addToProduct**(`id`, `productIds`, `replace?`): `Promise`<[`ProductTaxRate`](internal-8.internal.ProductTaxRate.md) \| [`ProductTaxRate`](internal-8.internal.ProductTaxRate.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `productIds` | `string` \| `string`[] |
| `replace?` | `boolean` |

#### Returns

`Promise`<[`ProductTaxRate`](internal-8.internal.ProductTaxRate.md) \| [`ProductTaxRate`](internal-8.internal.ProductTaxRate.md)[]\>

#### Defined in

packages/medusa/dist/services/tax-rate.d.ts:29

___

### addToProductType

▸ **addToProductType**(`id`, `productTypeIds`, `replace?`): `Promise`<[`ProductTypeTaxRate`](internal-8.internal.ProductTypeTaxRate.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `productTypeIds` | `string` \| `string`[] |
| `replace?` | `boolean` |

#### Returns

`Promise`<[`ProductTypeTaxRate`](internal-8.internal.ProductTypeTaxRate.md)[]\>

#### Defined in

packages/medusa/dist/services/tax-rate.d.ts:30

___

### addToShippingOption

▸ **addToShippingOption**(`id`, `optionIds`, `replace?`): `Promise`<[`ShippingTaxRate`](internal-8.internal.ShippingTaxRate.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `optionIds` | `string` \| `string`[] |
| `replace?` | `boolean` |

#### Returns

`Promise`<[`ShippingTaxRate`](internal-8.internal.ShippingTaxRate.md)[]\>

#### Defined in

packages/medusa/dist/services/tax-rate.d.ts:31

___

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

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[atomicPhase_](internal-8.internal.TransactionBaseService.md#atomicphase_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:24

___

### create

▸ **create**(`data`): `Promise`<[`TaxRate`](internal-3.TaxRate.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`CreateTaxRateInput`](../modules/internal-8.md#createtaxrateinput) |

#### Returns

`Promise`<[`TaxRate`](internal-3.TaxRate.md)\>

#### Defined in

packages/medusa/dist/services/tax-rate.d.ts:23

___

### delete

▸ **delete**(`id`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` \| `string`[] |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/tax-rate.d.ts:25

___

### list

▸ **list**(`selector`, `config?`): `Promise`<[`TaxRate`](internal-3.TaxRate.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | [`FilterableTaxRateProps`](../modules/internal-8.md#filterabletaxrateprops) |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`TaxRate`](internal-3.TaxRate.md)\> |

#### Returns

`Promise`<[`TaxRate`](internal-3.TaxRate.md)[]\>

#### Defined in

packages/medusa/dist/services/tax-rate.d.ts:20

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[[`TaxRate`](internal-3.TaxRate.md)[], `number`]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | [`FilterableTaxRateProps`](../modules/internal-8.md#filterabletaxrateprops) |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`TaxRate`](internal-3.TaxRate.md)\> |

#### Returns

`Promise`<[[`TaxRate`](internal-3.TaxRate.md)[], `number`]\>

#### Defined in

packages/medusa/dist/services/tax-rate.d.ts:21

___

### listByProduct

▸ **listByProduct**(`productId`, `config`): `Promise`<[`TaxRate`](internal-3.TaxRate.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `productId` | `string` |
| `config` | [`TaxRateListByConfig`](../modules/internal-8.md#taxratelistbyconfig) |

#### Returns

`Promise`<[`TaxRate`](internal-3.TaxRate.md)[]\>

#### Defined in

packages/medusa/dist/services/tax-rate.d.ts:32

___

### listByShippingOption

▸ **listByShippingOption**(`shippingOptionId`): `Promise`<[`TaxRate`](internal-3.TaxRate.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `shippingOptionId` | `string` |

#### Returns

`Promise`<[`TaxRate`](internal-3.TaxRate.md)[]\>

#### Defined in

packages/medusa/dist/services/tax-rate.d.ts:33

___

### removeFromProduct

▸ **removeFromProduct**(`id`, `productIds`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `productIds` | `string` \| `string`[] |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/tax-rate.d.ts:26

___

### removeFromProductType

▸ **removeFromProductType**(`id`, `typeIds`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `typeIds` | `string` \| `string`[] |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/tax-rate.d.ts:27

___

### removeFromShippingOption

▸ **removeFromShippingOption**(`id`, `optionIds`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `optionIds` | `string` \| `string`[] |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/tax-rate.d.ts:28

___

### retrieve

▸ **retrieve**(`taxRateId`, `config?`): `Promise`<[`TaxRate`](internal-3.TaxRate.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `taxRateId` | `string` |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`TaxRate`](internal-3.TaxRate.md)\> |

#### Returns

`Promise`<[`TaxRate`](internal-3.TaxRate.md)\>

#### Defined in

packages/medusa/dist/services/tax-rate.d.ts:22

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[shouldRetryTransaction_](internal-8.internal.TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:12

___

### update

▸ **update**(`id`, `data`): `Promise`<[`TaxRate`](internal-3.TaxRate.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `data` | [`UpdateTaxRateInput`](../modules/internal-8.md#updatetaxrateinput) |

#### Returns

`Promise`<[`TaxRate`](internal-3.TaxRate.md)\>

#### Defined in

packages/medusa/dist/services/tax-rate.d.ts:24

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`TaxRateService`](internal-8.internal.TaxRateService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`TaxRateService`](internal-8.internal.TaxRateService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
