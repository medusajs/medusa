# Class: RegionService

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`RegionService`**

## Constructors

### constructor

• **new RegionService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

BaseService.constructor

#### Defined in

[services/region.js:16](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/region.js#L16)

## Properties

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `DELETED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[services/region.js:10](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/region.js#L10)

## Methods

### addCountry

▸ **addCountry**(`regionId`, `code`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `regionId` | `string` |  |
| `code` | `string` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/region.js:462](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/region.js#L462)

___

### addFulfillmentProvider

▸ **addFulfillmentProvider**(`regionId`, `providerId`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `regionId` | `string` |  |
| `providerId` | `string` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/region.js:582](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/region.js#L582)

___

### addPaymentProvider

▸ **addPaymentProvider**(`regionId`, `providerId`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `regionId` | `string` |  |
| `providerId` | `string` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/region.js:535](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/region.js#L535)

___

### create

▸ **create**(`regionObject`): `Region`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `regionObject` | `Region` |  |

#### Returns

`Region`

#### Defined in

[services/region.js:95](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/region.js#L95)

___

### delete

▸ **delete**(`regionId`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `regionId` | `string` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/region.js:432](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/region.js#L432)

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` |  |
| `config` | `any` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/region.js:420](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/region.js#L420)

___

### removeCountry

▸ **removeCountry**(`regionId`, `code`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `regionId` | `string` |  |
| `code` | `string` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/region.js:499](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/region.js#L499)

___

### removeFulfillmentProvider

▸ **removeFulfillmentProvider**(`regionId`, `providerId`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `regionId` | `string` |  |
| `providerId` | `string` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/region.js:660](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/region.js#L660)

___

### removePaymentProvider

▸ **removePaymentProvider**(`regionId`, `providerId`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `regionId` | `string` |  |
| `providerId` | `string` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/region.js:626](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/region.js#L626)

___

### retrieve

▸ **retrieve**(`regionId`, `config?`): `Region`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `regionId` | `string` |  |
| `config` | `any` |  |

#### Returns

`Region`

#### Defined in

[services/region.js:396](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/region.js#L396)

___

### retrieveByCountryCode

▸ **retrieveByCountryCode**(`code`, `config?`): `Promise`<`Region`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `any` |
| `config` | `Object` |

#### Returns

`Promise`<`Region`\>

#### Defined in

[services/region.js:362](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/region.js#L362)

___

### update

▸ **update**(`regionId`, `update`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `regionId` | `string` |  |
| `update` | `any` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/region.js:153](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/region.js#L153)

___

### validateCountry\_

▸ **validateCountry_**(`code`, `regionId`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` |  |
| `regionId` | `string` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/region.js:323](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/region.js#L323)

___

### validateCurrency\_

▸ **validateCurrency_**(`currencyCode`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `currencyCode` | `string` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/region.js:302](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/region.js#L302)

___

### validateFields\_

▸ **validateFields_**(`region`, `id?`): `any`

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `region` | `any` | `undefined` |  |
| `id` | ``null`` \| `string` | `undefined` |  |

#### Returns

`any`

#### Defined in

[services/region.js:213](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/region.js#L213)

___

### validateTaxRate\_

▸ **validateTaxRate_**(`taxRate`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `taxRate` | `number` |  |

#### Returns

`void`

#### Defined in

[services/region.js:289](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/region.js#L289)

___

### withTransaction

▸ **withTransaction**(`transactionManager`): [`RegionService`](RegionService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager` | `any` |

#### Returns

[`RegionService`](RegionService.md)

#### Defined in

[services/region.js:65](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/region.js#L65)
