# Class: AdminDiscountsResource

## Hierarchy

- `default`

  ↳ **`AdminDiscountsResource`**

## Methods

### addRegion

▸ **addRegion**(`id`, `regionId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal.md#admindiscountsres)\>

**`description`** Adds region to discount

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `regionId` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal.md#admindiscountsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/discounts.ts:24](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/discounts.ts#L24)

___

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal.md#admindiscountsres)\>

**`description`** Creates discounts

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostDiscountsReq`](internal.AdminPostDiscountsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal.md#admindiscountsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/discounts.ts:36](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/discounts.ts#L36)

___

### createCondition

▸ **createCondition**(`discountId`, `payload`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal.md#admindiscountsres)\>

**`description`** creates a discount condition

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountId` | `string` |
| `payload` | [`AdminPostDiscountsDiscountConditions`](internal.AdminPostDiscountsDiscountConditions.md) |
| `query` | [`AdminPostDiscountsDiscountConditionsParams`](internal.AdminPostDiscountsDiscountConditionsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal.md#admindiscountsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/discounts.ts:145](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/discounts.ts#L145)

___

### createDynamicCode

▸ **createDynamicCode**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal.md#admindiscountsres)\>

**`description`** Creates a dynamic discount code

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostDiscountsDiscountDynamicCodesReq`](internal.AdminPostDiscountsDiscountDynamicCodesReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal.md#admindiscountsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/discounts.ts:59](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/discounts.ts#L59)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal.md#deleteresponse)\>

**`description`** Deletes a discount

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal.md#deleteresponse)\>

#### Defined in

[packages/medusa-js/src/resources/admin/discounts.ts:71](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/discounts.ts#L71)

___

### deleteCondition

▸ **deleteCondition**(`discountId`, `conditionId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal.md#deleteresponse)\>

**`description`** Removes a condition from a discount

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountId` | `string` |
| `conditionId` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal.md#deleteresponse)\>

#### Defined in

[packages/medusa-js/src/resources/admin/discounts.ts:184](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/discounts.ts#L184)

___

### deleteDynamicCode

▸ **deleteDynamicCode**(`id`, `code`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal.md#admindiscountsres)\>

**`description`** Deletes a dynamic discount

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `code` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal.md#admindiscountsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/discounts.ts:82](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/discounts.ts#L82)

___

### getCondition

▸ **getCondition**(`discountId`, `conditionId`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountConditionsRes`](../modules/internal.md#admindiscountconditionsres)\>

**`description`** Gets a condition from a discount

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountId` | `string` |
| `conditionId` | `string` |
| `query?` | [`AdminGetDiscountsDiscountConditionsConditionParams`](internal.AdminGetDiscountsDiscountConditionsConditionParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountConditionsRes`](../modules/internal.md#admindiscountconditionsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/discounts.ts:196](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/discounts.ts#L196)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsListRes`](../modules/internal.md#admindiscountslistres)\>

**`description`** Lists discounts

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetDiscountsParams`](internal.AdminGetDiscountsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsListRes`](../modules/internal.md#admindiscountslistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/discounts.ts:116](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/discounts.ts#L116)

___

### removeRegion

▸ **removeRegion**(`id`, `regionId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal.md#admindiscountsres)\>

**`description`** Removes a region from a discount

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `regionId` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal.md#admindiscountsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/discounts.ts:133](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/discounts.ts#L133)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal.md#admindiscountsres)\>

**`description`** Retrieves a discount

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal.md#admindiscountsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/discounts.ts:94](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/discounts.ts#L94)

___

### retrieveByCode

▸ **retrieveByCode**(`code`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal.md#admindiscountsres)\>

**`description`** Retrieves a discount by code

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal.md#admindiscountsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/discounts.ts:105](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/discounts.ts#L105)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal.md#admindiscountsres)\>

**`description`** Updates discount

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostDiscountsDiscountReq`](internal.AdminPostDiscountsDiscountReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal.md#admindiscountsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/discounts.ts:47](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/discounts.ts#L47)

___

### updateCondition

▸ **updateCondition**(`discountId`, `conditionId`, `payload`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal.md#admindiscountsres)\>

**`description`** Updates a discount condition

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountId` | `string` |
| `conditionId` | `string` |
| `payload` | [`AdminPostDiscountsDiscountConditionsCondition`](internal.AdminPostDiscountsDiscountConditionsCondition.md) |
| `query` | [`AdminPostDiscountsDiscountConditionsConditionParams`](internal.AdminPostDiscountsDiscountConditionsConditionParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal.md#admindiscountsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/discounts.ts:164](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/discounts.ts#L164)
