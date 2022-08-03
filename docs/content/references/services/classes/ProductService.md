# Class: ProductService

## Hierarchy

- `TransactionBaseService`<[`ProductService`](ProductService.md)\>

  ↳ **`ProductService`**

## Constructors

### constructor

• **new ProductService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService&lt;ProductService\&gt;.constructor

#### Defined in

[services/product.ts:62](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L62)

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

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[services/product.ts:53](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L53)

___

### imageRepository\_

• `Protected` `Readonly` **imageRepository\_**: typeof `ImageRepository`

#### Defined in

[services/product.ts:50](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L50)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[services/product.ts:42](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L42)

___

### productOptionRepository\_

• `Protected` `Readonly` **productOptionRepository\_**: typeof `ProductOptionRepository`

#### Defined in

[services/product.ts:45](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L45)

___

### productRepository\_

• `Protected` `Readonly` **productRepository\_**: typeof `ProductRepository`

#### Defined in

[services/product.ts:46](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L46)

___

### productTagRepository\_

• `Protected` `Readonly` **productTagRepository\_**: typeof `ProductTagRepository`

#### Defined in

[services/product.ts:49](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L49)

___

### productTypeRepository\_

• `Protected` `Readonly` **productTypeRepository\_**: typeof `ProductTypeRepository`

#### Defined in

[services/product.ts:48](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L48)

___

### productVariantRepository\_

• `Protected` `Readonly` **productVariantRepository\_**: typeof `ProductVariantRepository`

#### Defined in

[services/product.ts:47](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L47)

___

### productVariantService\_

• `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[services/product.ts:51](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L51)

___

### searchService\_

• `Protected` `Readonly` **searchService\_**: [`SearchService`](SearchService.md)

#### Defined in

[services/product.ts:52](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L52)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/product.ts:43](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L43)

___

### Events

▪ `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `DELETED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[services/product.ts:56](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L56)

___

### IndexName

▪ `Static` `Readonly` **IndexName**: ``"products"``

#### Defined in

[services/product.ts:55](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L55)

## Methods

### addOption

▸ **addOption**(`productId`, `optionTitle`): `Promise`<`Product`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` |  |
| `optionTitle` | `string` |  |

#### Returns

`Promise`<`Product`\>

#### Defined in

[services/product.ts:552](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L552)

___

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

### count

▸ **count**(`selector?`): `Promise`<`number`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`Product`\> |  |

#### Returns

`Promise`<`number`\>

#### Defined in

[services/product.ts:175](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L175)

___

### create

▸ **create**(`productObject`): `Promise`<`Product`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productObject` | `CreateProductInput` |  |

#### Returns

`Promise`<`Product`\>

#### Defined in

[services/product.ts:324](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L324)

___

### delete

▸ **delete**(`productId`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/product.ts:518](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L518)

___

### deleteOption

▸ **deleteOption**(`productId`, `optionId`): `Promise`<`void` \| `Product`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` |  |
| `optionId` | `string` |  |

#### Returns

`Promise`<`void` \| `Product`\>

#### Defined in

[services/product.ts:693](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L693)

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<`Product`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`Product`\> \| `FilterableProductProps` |  |
| `config` | `FindProductConfig` |  |

#### Returns

`Promise`<`Product`[]\>

#### Defined in

[services/product.ts:107](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L107)

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[`Product`[], `number`]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`Product`\> \| `FilterableProductProps` |  |
| `config` | `FindProductConfig` |  |

#### Returns

`Promise`<[`Product`[], `number`]\>

#### Defined in

[services/product.ts:144](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L144)

___

### listTagsByUsage

▸ **listTagsByUsage**(`count?`): `Promise`<`ProductTag`[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `count` | `number` | `10` |

#### Returns

`Promise`<`ProductTag`[]\>

#### Defined in

[services/product.ts:309](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L309)

___

### listTypes

▸ **listTypes**(): `Promise`<`ProductType`[]\>

#### Returns

`Promise`<`ProductType`[]\>

#### Defined in

[services/product.ts:299](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L299)

___

### prepareListQuery\_

▸ `Protected` **prepareListQuery_**(`selector`, `config`): `Object`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`Product`\> \| `FilterableProductProps` |  |
| `config` | `FindProductConfig` |  |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `q` | `string` |
| `query` | `FindWithoutRelationsOptions` |
| `relations` | keyof `Product`[] |

#### Defined in

[services/product.ts:759](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L759)

___

### reorderVariants

▸ **reorderVariants**(`productId`, `variantOrder`): `Promise`<`Product`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `productId` | `string` |
| `variantOrder` | `string`[] |

#### Returns

`Promise`<`Product`\>

#### Defined in

[services/product.ts:591](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L591)

___

### retrieve

▸ **retrieve**(`productId`, `config?`): `Promise`<`Product`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` |  |
| `config` | `FindProductConfig` |  |

#### Returns

`Promise`<`Product`\>

#### Defined in

[services/product.ts:191](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L191)

___

### retrieveByExternalId

▸ **retrieveByExternalId**(`externalId`, `config?`): `Promise`<`Product`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `externalId` | `string` |  |
| `config` | `FindProductConfig` |  |

#### Returns

`Promise`<`Product`\>

#### Defined in

[services/product.ts:225](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L225)

___

### retrieveByHandle

▸ **retrieveByHandle**(`productHandle`, `config?`): `Promise`<`Product`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productHandle` | `string` |  |
| `config` | `FindProductConfig` |  |

#### Returns

`Promise`<`Product`\>

#### Defined in

[services/product.ts:209](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L209)

___

### retrieveVariants

▸ **retrieveVariants**(`productId`, `config?`): `Promise`<`ProductVariant`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` |  |
| `config` | `FindProductConfig` |  |

#### Returns

`Promise`<`ProductVariant`[]\>

#### Defined in

[services/product.ts:279](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L279)

___

### retrieve\_

▸ **retrieve_**(`selector`, `config?`): `Promise`<`Product`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`Product`\> |  |
| `config` | `FindProductConfig` |  |

#### Returns

`Promise`<`Product`\>

#### Defined in

[services/product.ts:242](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L242)

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

▸ **update**(`productId`, `update`): `Promise`<`Product`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` |  |
| `update` | `UpdateProductInput` |  |

#### Returns

`Promise`<`Product`\>

#### Defined in

[services/product.ts:399](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L399)

___

### updateOption

▸ **updateOption**(`productId`, `optionId`, `data`): `Promise`<`Product`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` |  |
| `optionId` | `string` |  |
| `data` | `ProductOptionInput` |  |

#### Returns

`Promise`<`Product`\>

#### Defined in

[services/product.ts:637](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product.ts#L637)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`ProductService`](ProductService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ProductService`](ProductService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
