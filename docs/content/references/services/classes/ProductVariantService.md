# Class: ProductVariantService

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`ProductVariantService`**

## Constructors

### constructor

• **new ProductVariantService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

BaseService.constructor

#### Defined in

[services/product-variant.ts:52](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-variant.ts#L52)

## Properties

### cartRepository\_

• `Private` **cartRepository\_**: typeof `CartRepository`

#### Defined in

[services/product-variant.ts:50](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-variant.ts#L50)

___

### eventBus\_

• `Private` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[services/product-variant.ts:45](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-variant.ts#L45)

___

### manager\_

• `Private` **manager\_**: `EntityManager`

#### Defined in

[services/product-variant.ts:42](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-variant.ts#L42)

___

### moneyAmountRepository\_

• `Private` **moneyAmountRepository\_**: typeof `MoneyAmountRepository`

#### Defined in

[services/product-variant.ts:48](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-variant.ts#L48)

___

### priceSelectionStrategy\_

• `Private` **priceSelectionStrategy\_**: `IPriceSelectionStrategy`

#### Defined in

[services/product-variant.ts:47](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-variant.ts#L47)

___

### productOptionValueRepository\_

• `Private` **productOptionValueRepository\_**: typeof `ProductOptionValueRepository`

#### Defined in

[services/product-variant.ts:49](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-variant.ts#L49)

___

### productRepository\_

• `Private` **productRepository\_**: typeof `ProductRepository`

#### Defined in

[services/product-variant.ts:44](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-variant.ts#L44)

___

### productVariantRepository\_

• `Private` **productVariantRepository\_**: typeof `ProductVariantRepository`

#### Defined in

[services/product-variant.ts:43](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-variant.ts#L43)

___

### regionService\_

• `Private` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[services/product-variant.ts:46](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-variant.ts#L46)

___

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `DELETED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[services/product-variant.ts:36](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-variant.ts#L36)

## Methods

### addOptionValue

▸ **addOptionValue**(`variantId`, `optionId`, `optionValue`): `Promise`<`ProductOptionValue`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` |  |
| `optionId` | `string` |  |
| `optionValue` | `string` |  |

#### Returns

`Promise`<`ProductOptionValue`\>

#### Defined in

[services/product-variant.ts:529](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-variant.ts#L529)

___

### create

▸ **create**(`productOrProductId`, `variant`): `Promise`<`ProductVariant`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productOrProductId` | `string` \| `Product` |  |
| `variant` | `CreateProductVariantInput` |  |

#### Returns

`Promise`<`ProductVariant`\>

#### Defined in

[services/product-variant.ts:183](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-variant.ts#L183)

___

### delete

▸ **delete**(`variantId`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/product-variant.ts:682](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-variant.ts#L682)

___

### deleteOptionValue

▸ **deleteOptionValue**(`variantId`, `optionId`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` |  |
| `optionId` | `string` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/product-variant.ts:556](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-variant.ts#L556)

___

### getFreeTextQueryBuilder\_

▸ **getFreeTextQueryBuilder_**(`variantRepo`, `query`, `q?`): `SelectQueryBuilder`<`ProductVariant`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantRepo` | `ProductVariantRepository` |  |
| `query` | `FindWithRelationsOptions` |  |
| `q?` | `string` |  |

#### Returns

`SelectQueryBuilder`<`ProductVariant`\>

#### Defined in

[services/product-variant.ts:788](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-variant.ts#L788)

___

### getRegionPrice

▸ **getRegionPrice**(`variantId`, `context`): `Promise`<`number`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` |  |
| `context` | `GetRegionPriceContext` |  |

#### Returns

`Promise`<`number`\>

#### Defined in

[services/product-variant.ts:404](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-variant.ts#L404)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`ProductVariant`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterableProductVariantProps` |  |
| `config` | `FindConfig`<`ProductVariant`\> & `PriceSelectionContext` |  |

#### Returns

`Promise`<`ProductVariant`[]\>

#### Defined in

[services/product-variant.ts:624](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-variant.ts#L624)

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[`ProductVariant`[], `number`]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterableProductVariantProps` |  |
| `config` | `FindConfig`<`ProductVariant`\> & `PriceSelectionContext` |  |

#### Returns

`Promise`<[`ProductVariant`[], `number`]\>

#### Defined in

[services/product-variant.ts:583](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-variant.ts#L583)

___

### prepareListQuery\_

▸ **prepareListQuery_**(`selector`, `config`): `Object`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterableProductVariantProps` |  |
| `config` | `FindConfig`<`ProductVariant`\> |  |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `q?` | `string` |
| `query` | `FindWithRelationsOptions` |
| `relations` | `string`[] |

#### Defined in

[services/product-variant.ts:749](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-variant.ts#L749)

___

### retrieve

▸ **retrieve**(`variantId`, `config?`): `Promise`<`ProductVariant`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` |  |
| `config` | `FindConfig`<`ProductVariant`\> & `PriceSelectionContext` |  |

#### Returns

`Promise`<`ProductVariant`\>

#### Defined in

[services/product-variant.ts:117](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-variant.ts#L117)

___

### retrieveBySKU

▸ **retrieveBySKU**(`sku`, `config?`): `Promise`<`ProductVariant`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sku` | `string` |  |
| `config` | `FindConfig`<`ProductVariant`\> & `PriceSelectionContext` |  |

#### Returns

`Promise`<`ProductVariant`\>

#### Defined in

[services/product-variant.ts:147](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-variant.ts#L147)

___

### setCurrencyPrice

▸ **setCurrencyPrice**(`variantId`, `price`): `Promise`<`MoneyAmount`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` |  |
| `price` | `ProductVariantPrice` |  |

#### Returns

`Promise`<`MoneyAmount`\>

#### Defined in

[services/product-variant.ts:470](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-variant.ts#L470)

___

### setMetadata\_

▸ **setMetadata_**(`variant`, `metadata`): `Record`<`string`, `unknown`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variant` | `ProductVariant` |  |
| `metadata` | `object` |  |

#### Returns

`Record`<`string`, `unknown`\>

#### Defined in

[services/product-variant.ts:717](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-variant.ts#L717)

___

### setRegionPrice

▸ **setRegionPrice**(`variantId`, `price`): `Promise`<`MoneyAmount`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` |  |
| `price` | `ProductVariantPrice` |  |

#### Returns

`Promise`<`MoneyAmount`\>

#### Defined in

[services/product-variant.ts:433](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-variant.ts#L433)

___

### update

▸ **update**(`variantOrVariantId`, `update`): `Promise`<`ProductVariant`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantOrVariantId` | `string` \| `Partial`<`ProductVariant`\> |  |
| `update` | `UpdateProductVariantInput` |  |

#### Returns

`Promise`<`ProductVariant`\>

#### Defined in

[services/product-variant.ts:288](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-variant.ts#L288)

___

### updateOptionValue

▸ **updateOptionValue**(`variantId`, `optionId`, `optionValue`): `Promise`<`ProductOptionValue`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` |  |
| `optionId` | `string` |  |
| `optionValue` | `string` |  |

#### Returns

`Promise`<`ProductOptionValue`\>

#### Defined in

[services/product-variant.ts:491](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-variant.ts#L491)

___

### updateVariantPrices

▸ **updateVariantPrices**(`variantId`, `prices`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` |  |
| `prices` | `ProductVariantPrice`[] |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/product-variant.ts:366](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-variant.ts#L366)

___

### withTransaction

▸ **withTransaction**(`transactionManager`): [`ProductVariantService`](ProductVariantService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager` | `EntityManager` |

#### Returns

[`ProductVariantService`](ProductVariantService.md)

#### Defined in

[services/product-variant.ts:89](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-variant.ts#L89)
