# Class: FulfillmentProviderService

## Constructors

### constructor

• **new FulfillmentProviderService**(`container`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `container` | `any` |

#### Defined in

[services/fulfillment-provider.js:7](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/fulfillment-provider.js#L7)

## Methods

### calculatePrice

▸ **calculatePrice**(`option`, `data`, `cart`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `option` | `any` |
| `data` | `any` |
| `cart` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/fulfillment-provider.js:79](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/fulfillment-provider.js#L79)

___

### canCalculate

▸ **canCalculate**(`option`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `option` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/fulfillment-provider.js:64](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/fulfillment-provider.js#L64)

___

### cancelFulfillment

▸ **cancelFulfillment**(`fulfillment`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fulfillment` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/fulfillment-provider.js:74](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/fulfillment-provider.js#L74)

___

### createFulfillment

▸ **createFulfillment**(`method`, `items`, `order`, `fulfillment`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `any` |
| `items` | `any` |
| `order` | `any` |
| `fulfillment` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/fulfillment-provider.js:59](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/fulfillment-provider.js#L59)

___

### createReturn

▸ **createReturn**(`returnOrder`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `returnOrder` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/fulfillment-provider.js:89](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/fulfillment-provider.js#L89)

___

### list

▸ **list**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Defined in

[services/fulfillment-provider.js:23](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/fulfillment-provider.js#L23)

___

### listFulfillmentOptions

▸ **listFulfillmentOptions**(`providers`): `Promise`<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `providers` | `any` |

#### Returns

`Promise`<`any`[]\>

#### Defined in

[services/fulfillment-provider.js:30](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/fulfillment-provider.js#L30)

___

### registerInstalledProviders

▸ **registerInstalledProviders**(`providers`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `providers` | `any` |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/fulfillment-provider.js:12](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/fulfillment-provider.js#L12)

___

### retrieveDocuments

▸ **retrieveDocuments**(`providerId`, `fulfillmentData`, `documentType`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `providerId` | `string` |  |
| `fulfillmentData` | `any` |  |
| `documentType` | ``"label"`` \| ``"invoice"`` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/fulfillment-provider.js:102](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/fulfillment-provider.js#L102)

___

### retrieveProvider

▸ **retrieveProvider**(`provider_id`): `FulfillmentService`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `provider_id` | `string` |  |

#### Returns

`FulfillmentService`

#### Defined in

[services/fulfillment-provider.js:48](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/fulfillment-provider.js#L48)

___

### validateFulfillmentData

▸ **validateFulfillmentData**(`option`, `data`, `cart`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `option` | `any` |
| `data` | `any` |
| `cart` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/fulfillment-provider.js:69](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/fulfillment-provider.js#L69)

___

### validateOption

▸ **validateOption**(`option`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `option` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/fulfillment-provider.js:84](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/fulfillment-provider.js#L84)
