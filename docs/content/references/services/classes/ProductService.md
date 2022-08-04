# Class: ProductService

## Hierarchy

- `TransactionBaseService`<[`ProductService`](ProductService.md), `InjectedDependencies`\>

  ↳ **`ProductService`**

## Constructors

### constructor

• **new ProductService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService&lt;
  ProductService,
  InjectedDependencies
\&gt;.constructor

#### Defined in

[services/product.ts:75](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L75)

## Properties

### configModule

• `Protected` `Optional` `Readonly` **configModule**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.configModule

___

### container

• `Protected` `Readonly` **container**: `InjectedDependencies`

#### Inherited from

TransactionBaseService.container

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[services/product.ts:65](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L65)

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[services/product.ts:66](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L66)

___

### imageRepository\_

• `Protected` `Readonly` **imageRepository\_**: typeof `ImageRepository`

#### Defined in

[services/product.ts:62](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L62)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[services/product.ts:54](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L54)

___

### productOptionRepository\_

• `Protected` `Readonly` **productOptionRepository\_**: typeof `ProductOptionRepository`

#### Defined in

[services/product.ts:57](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L57)

___

### productRepository\_

• `Protected` `Readonly` **productRepository\_**: typeof `ProductRepository`

#### Defined in

[services/product.ts:58](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L58)

___

### productTagRepository\_

• `Protected` `Readonly` **productTagRepository\_**: typeof `ProductTagRepository`

#### Defined in

[services/product.ts:61](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L61)

___

### productTypeRepository\_

• `Protected` `Readonly` **productTypeRepository\_**: typeof `ProductTypeRepository`

#### Defined in

[services/product.ts:60](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L60)

___

### productVariantRepository\_

• `Protected` `Readonly` **productVariantRepository\_**: typeof `ProductVariantRepository`

#### Defined in

[services/product.ts:59](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L59)

___

### productVariantService\_

• `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[services/product.ts:63](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L63)

___

### searchService\_

• `Protected` `Readonly` **searchService\_**: [`SearchService`](SearchService.md)

#### Defined in

[services/product.ts:64](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L64)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/product.ts:55](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L55)

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

[services/product.ts:69](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L69)

___

### IndexName

▪ `Static` `Readonly` **IndexName**: ``"products"``

#### Defined in

[services/product.ts:68](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L68)

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

[services/product.ts:637](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L637)

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

[interfaces/transaction-base-service.ts:53](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L53)

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

[services/product.ts:178](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L178)

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

[services/product.ts:346](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L346)

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

[services/product.ts:603](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L603)

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

[services/product.ts:778](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L778)

___

### filterProductsBySalesChannel

▸ **filterProductsBySalesChannel**(`productIds`, `salesChannelId`, `config?`): `Promise`<`Product`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `productIds` | `string`[] |
| `salesChannelId` | `string` |
| `config` | `FindProductConfig` |

#### Returns

`Promise`<`Product`[]\>

#### Defined in

[services/product.ts:292](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L292)

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

[services/product.ts:112](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L112)

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

[services/product.ts:148](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L148)

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

[services/product.ts:332](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L332)

___

### listTypes

▸ **listTypes**(): `Promise`<`ProductType`[]\>

#### Returns

`Promise`<`ProductType`[]\>

#### Defined in

[services/product.ts:323](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L323)

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

[services/product.ts:844](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L844)

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

[services/product.ts:676](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L676)

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

[services/product.ts:193](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L193)

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

[services/product.ts:223](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L223)

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

[services/product.ts:209](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L209)

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

[services/product.ts:274](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L274)

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

[services/product.ts:238](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L238)

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

[interfaces/transaction-base-service.ts:34](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L34)

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

[services/product.ts:445](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L445)

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

[services/product.ts:722](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/product.ts#L722)

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

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
