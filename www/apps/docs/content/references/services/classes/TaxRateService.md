# Class: TaxRateService

## Hierarchy

- `TransactionBaseService`

  ↳ **`TaxRateService`**

## Constructors

### constructor

• **new TaxRateService**(`«destructured»`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/tax-rate.ts:29](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/tax-rate.ts#L29)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### productService\_

• `Protected` `Readonly` **productService\_**: [`ProductService`](ProductService.md)

#### Defined in

[medusa/src/services/tax-rate.ts:24](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/tax-rate.ts#L24)

___

### productTypeService\_

• `Protected` `Readonly` **productTypeService\_**: [`ProductTypeService`](ProductTypeService.md)

#### Defined in

[medusa/src/services/tax-rate.ts:25](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/tax-rate.ts#L25)

___

### shippingOptionService\_

• `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](ShippingOptionService.md)

#### Defined in

[medusa/src/services/tax-rate.ts:26](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/tax-rate.ts#L26)

___

### taxRateRepository\_

• `Protected` `Readonly` **taxRateRepository\_**: `Repository`<`TaxRate`\> & { `addToProduct`: (`id`: `string`, `productIds`: `string`[], `overrideExisting`: `boolean`) => `Promise`<`ProductTaxRate`[]\> ; `addToProductType`: (`id`: `string`, `productTypeIds`: `string`[], `overrideExisting`: `boolean`) => `Promise`<`ProductTypeTaxRate`[]\> ; `addToShippingOption`: (`id`: `string`, `optionIds`: `string`[], `overrideExisting`: `boolean`) => `Promise`<`ShippingTaxRate`[]\> ; `applyResolutionsToQueryBuilder`: (`qb`: `SelectQueryBuilder`<`TaxRate`\>, `resolverFields`: `string`[]) => `SelectQueryBuilder`<`TaxRate`\> ; `findAndCountWithResolution`: (`findOptions`: `FindManyOptions`<`TaxRate`\>) => `Promise`<[`TaxRate`[], `number`]\> ; `findOneWithResolution`: (`findOptions`: `FindManyOptions`<`TaxRate`\>) => `Promise`<``null`` \| `TaxRate`\> ; `findWithResolution`: (`findOptions`: `FindManyOptions`<`TaxRate`\>) => `Promise`<`TaxRate`[]\> ; `getFindQueryBuilder`: (`findOptions`: `FindManyOptions`<`TaxRate`\>) => `SelectQueryBuilder`<`TaxRate`\> ; `listByProduct`: (`productId`: `string`, `config`: `TaxRateListByConfig`) => `Promise`<`TaxRate`[]\> ; `listByShippingOption`: (`optionId`: `string`) => `Promise`<`TaxRate`[]\> ; `removeFromProduct`: (`id`: `string`, `productIds`: `string`[]) => `Promise`<`DeleteResult`\> ; `removeFromProductType`: (`id`: `string`, `productTypeIds`: `string`[]) => `Promise`<`DeleteResult`\> ; `removeFromShippingOption`: (`id`: `string`, `optionIds`: `string`[]) => `Promise`<`DeleteResult`\>  }

#### Defined in

[medusa/src/services/tax-rate.ts:27](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/tax-rate.ts#L27)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

### addToProduct

▸ **addToProduct**(`id`, `productIds`, `replace?`): `Promise`<`ProductTaxRate` \| `ProductTaxRate`[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `id` | `string` | `undefined` |
| `productIds` | `string` \| `string`[] | `undefined` |
| `replace` | `boolean` | `false` |

#### Returns

`Promise`<`ProductTaxRate` \| `ProductTaxRate`[]\>

#### Defined in

[medusa/src/services/tax-rate.ts:190](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/tax-rate.ts#L190)

___

### addToProductType

▸ **addToProductType**(`id`, `productTypeIds`, `replace?`): `Promise`<`ProductTypeTaxRate`[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `id` | `string` | `undefined` |
| `productTypeIds` | `string` \| `string`[] | `undefined` |
| `replace` | `boolean` | `false` |

#### Returns

`Promise`<`ProductTypeTaxRate`[]\>

#### Defined in

[medusa/src/services/tax-rate.ts:226](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/tax-rate.ts#L226)

___

### addToShippingOption

▸ **addToShippingOption**(`id`, `optionIds`, `replace?`): `Promise`<`ShippingTaxRate`[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `id` | `string` | `undefined` |
| `optionIds` | `string` \| `string`[] | `undefined` |
| `replace` | `boolean` | `false` |

#### Returns

`Promise`<`ShippingTaxRate`[]\>

#### Defined in

[medusa/src/services/tax-rate.ts:266](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/tax-rate.ts#L266)

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

TransactionBaseService.atomicPhase\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### create

▸ **create**(`data`): `Promise`<`TaxRate`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `CreateTaxRateInput` |

#### Returns

`Promise`<`TaxRate`\>

#### Defined in

[medusa/src/services/tax-rate.ts:93](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/tax-rate.ts#L93)

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

[medusa/src/services/tax-rate.ts:124](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/tax-rate.ts#L124)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`TaxRate`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | `FilterableTaxRateProps` |
| `config` | `FindConfig`<`TaxRate`\> |

#### Returns

`Promise`<`TaxRate`[]\>

#### Defined in

[medusa/src/services/tax-rate.ts:44](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/tax-rate.ts#L44)

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[`TaxRate`[], `number`]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | `FilterableTaxRateProps` |
| `config` | `FindConfig`<`TaxRate`\> |

#### Returns

`Promise`<[`TaxRate`[], `number`]\>

#### Defined in

[medusa/src/services/tax-rate.ts:55](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/tax-rate.ts#L55)

___

### listByProduct

▸ **listByProduct**(`productId`, `config`): `Promise`<`TaxRate`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `productId` | `string` |
| `config` | `TaxRateListByConfig` |

#### Returns

`Promise`<`TaxRate`[]\>

#### Defined in

[medusa/src/services/tax-rate.ts:314](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/tax-rate.ts#L314)

___

### listByShippingOption

▸ **listByShippingOption**(`shippingOptionId`): `Promise`<`TaxRate`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `shippingOptionId` | `string` |

#### Returns

`Promise`<`TaxRate`[]\>

#### Defined in

[medusa/src/services/tax-rate.ts:325](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/tax-rate.ts#L325)

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

[medusa/src/services/tax-rate.ts:136](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/tax-rate.ts#L136)

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

[medusa/src/services/tax-rate.ts:154](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/tax-rate.ts#L154)

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

[medusa/src/services/tax-rate.ts:172](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/tax-rate.ts#L172)

___

### retrieve

▸ **retrieve**(`taxRateId`, `config?`): `Promise`<`TaxRate`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `taxRateId` | `string` |
| `config` | `FindConfig`<`TaxRate`\> |

#### Returns

`Promise`<`TaxRate`\>

#### Defined in

[medusa/src/services/tax-rate.ts:66](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/tax-rate.ts#L66)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

▸ **update**(`id`, `data`): `Promise`<`TaxRate`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `data` | `UpdateTaxRateInput` |

#### Returns

`Promise`<`TaxRate`\>

#### Defined in

[medusa/src/services/tax-rate.ts:109](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/tax-rate.ts#L109)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`TaxRateService`](TaxRateService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`TaxRateService`](TaxRateService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
