# Class: TaxRateService

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`TaxRateService`**

## Constructors

### constructor

• **new TaxRateService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

BaseService.constructor

#### Defined in

[packages/medusa/src/services/tax-rate.ts:27](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/tax-rate.ts#L27)

## Properties

### manager\_

• `Private` **manager\_**: `EntityManager`

#### Defined in

[packages/medusa/src/services/tax-rate.ts:21](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/tax-rate.ts#L21)

___

### productService\_

• `Private` **productService\_**: [`ProductService`](ProductService.md)

#### Defined in

[packages/medusa/src/services/tax-rate.ts:22](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/tax-rate.ts#L22)

___

### productTypeService\_

• `Private` **productTypeService\_**: [`ProductTypeService`](ProductTypeService.md)

#### Defined in

[packages/medusa/src/services/tax-rate.ts:23](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/tax-rate.ts#L23)

___

### shippingOptionService\_

• `Private` **shippingOptionService\_**: [`ShippingOptionService`](ShippingOptionService.md)

#### Defined in

[packages/medusa/src/services/tax-rate.ts:24](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/tax-rate.ts#L24)

___

### taxRateRepository\_

• `Private` **taxRateRepository\_**: typeof `TaxRateRepository`

#### Defined in

[packages/medusa/src/services/tax-rate.ts:25](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/tax-rate.ts#L25)

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

[packages/medusa/src/services/tax-rate.ts:196](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/tax-rate.ts#L196)

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

[packages/medusa/src/services/tax-rate.ts:232](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/tax-rate.ts#L232)

___

### addToShippingOption

▸ **addToShippingOption**(`id`, `optionIds`, `replace?`): `Promise`<`ShippingTaxRate`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `id` | `string` | `undefined` |
| `optionIds` | `string` \| `string`[] | `undefined` |
| `replace` | `boolean` | `false` |

#### Returns

`Promise`<`ShippingTaxRate`\>

#### Defined in

[packages/medusa/src/services/tax-rate.ts:272](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/tax-rate.ts#L272)

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

[packages/medusa/src/services/tax-rate.ts:103](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/tax-rate.ts#L103)

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

[packages/medusa/src/services/tax-rate.ts:134](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/tax-rate.ts#L134)

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

[packages/medusa/src/services/tax-rate.ts:62](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/tax-rate.ts#L62)

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

[packages/medusa/src/services/tax-rate.ts:73](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/tax-rate.ts#L73)

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

[packages/medusa/src/services/tax-rate.ts:320](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/tax-rate.ts#L320)

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

[packages/medusa/src/services/tax-rate.ts:330](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/tax-rate.ts#L330)

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

[packages/medusa/src/services/tax-rate.ts:142](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/tax-rate.ts#L142)

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

[packages/medusa/src/services/tax-rate.ts:160](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/tax-rate.ts#L160)

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

[packages/medusa/src/services/tax-rate.ts:178](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/tax-rate.ts#L178)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`TaxRate`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `config` | `FindConfig`<`TaxRate`\> |

#### Returns

`Promise`<`TaxRate`\>

#### Defined in

[packages/medusa/src/services/tax-rate.ts:84](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/tax-rate.ts#L84)

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

[packages/medusa/src/services/tax-rate.ts:119](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/tax-rate.ts#L119)

___

### withTransaction

▸ **withTransaction**(`transactionManager`): [`TaxRateService`](TaxRateService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager` | `EntityManager` |

#### Returns

[`TaxRateService`](TaxRateService.md)

#### Defined in

[packages/medusa/src/services/tax-rate.ts:43](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/tax-rate.ts#L43)
