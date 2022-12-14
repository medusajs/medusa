# Class: AdminDiscountsResource

## Hierarchy

- `default`

  ↳ **`AdminDiscountsResource`**

## Methods

### addConditionResourceBatch

▸ **addConditionResourceBatch**(`discountId`, `conditionId`, `payload`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-7.md#admindiscountsres)\>

**`Description`**

Add a batch of items to a discount condition

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountId` | `string` |
| `conditionId` | `string` |
| `payload` | [`AdminPostDiscountsDiscountConditionsConditionBatchReq`](internal-7.AdminPostDiscountsDiscountConditionsConditionBatchReq.md) |
| `query?` | [`AdminPostDiscountsDiscountConditionsConditionBatchParams`](internal-7.AdminPostDiscountsDiscountConditionsConditionBatchParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-7.md#admindiscountsres)\>

#### Defined in

[medusa-js/src/resources/admin/discounts.ts:218](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/discounts.ts#L218)

___

### addRegion

▸ **addRegion**(`id`, `regionId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-7.md#admindiscountsres)\>

**`Description`**

Adds region to discount

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `regionId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-7.md#admindiscountsres)\>

#### Defined in

[medusa-js/src/resources/admin/discounts.ts:27](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/discounts.ts#L27)

___

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-7.md#admindiscountsres)\>

**`Description`**

Creates discounts

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostDiscountsReq`](internal-7.AdminPostDiscountsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-7.md#admindiscountsres)\>

#### Defined in

[medusa-js/src/resources/admin/discounts.ts:39](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/discounts.ts#L39)

___

### createCondition

▸ **createCondition**(`discountId`, `payload`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-7.md#admindiscountsres)\>

**`Description`**

creates a discount condition

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountId` | `string` |
| `payload` | [`AdminPostDiscountsDiscountConditions`](internal-7.AdminPostDiscountsDiscountConditions.md) |
| `query` | [`AdminPostDiscountsDiscountConditionsParams`](internal-7.AdminPostDiscountsDiscountConditionsParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-7.md#admindiscountsres)\>

#### Defined in

[medusa-js/src/resources/admin/discounts.ts:148](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/discounts.ts#L148)

___

### createDynamicCode

▸ **createDynamicCode**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-7.md#admindiscountsres)\>

**`Description`**

Creates a dynamic discount code

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostDiscountsDiscountDynamicCodesReq`](internal-7.AdminPostDiscountsDiscountDynamicCodesReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-7.md#admindiscountsres)\>

#### Defined in

[medusa-js/src/resources/admin/discounts.ts:62](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/discounts.ts#L62)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

**`Description`**

Deletes a discount

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

#### Defined in

[medusa-js/src/resources/admin/discounts.ts:74](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/discounts.ts#L74)

___

### deleteCondition

▸ **deleteCondition**(`discountId`, `conditionId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

**`Description`**

Removes a condition from a discount

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountId` | `string` |
| `conditionId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

#### Defined in

[medusa-js/src/resources/admin/discounts.ts:187](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/discounts.ts#L187)

___

### deleteConditionResourceBatch

▸ **deleteConditionResourceBatch**(`discountId`, `conditionId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-7.md#admindiscountsres)\>

**`Description`**

Delete a batch of items from a discount condition

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountId` | `string` |
| `conditionId` | `string` |
| `payload` | [`AdminDeleteDiscountsDiscountConditionsConditionBatchReq`](internal-7.AdminDeleteDiscountsDiscountConditionsConditionBatchReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-7.md#admindiscountsres)\>

#### Defined in

[medusa-js/src/resources/admin/discounts.ts:238](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/discounts.ts#L238)

___

### deleteDynamicCode

▸ **deleteDynamicCode**(`id`, `code`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-7.md#admindiscountsres)\>

**`Description`**

Deletes a dynamic discount

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `code` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-7.md#admindiscountsres)\>

#### Defined in

[medusa-js/src/resources/admin/discounts.ts:85](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/discounts.ts#L85)

___

### getCondition

▸ **getCondition**(`discountId`, `conditionId`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountConditionsRes`](../modules/internal-7.md#admindiscountconditionsres)\>

**`Description`**

Gets a condition from a discount

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountId` | `string` |
| `conditionId` | `string` |
| `query?` | [`AdminGetDiscountsDiscountConditionsConditionParams`](internal-7.AdminGetDiscountsDiscountConditionsConditionParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountConditionsRes`](../modules/internal-7.md#admindiscountconditionsres)\>

#### Defined in

[medusa-js/src/resources/admin/discounts.ts:199](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/discounts.ts#L199)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsListRes`](../modules/internal-7.md#admindiscountslistres)\>

**`Description`**

Lists discounts

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetDiscountsParams`](internal-7.AdminGetDiscountsParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsListRes`](../modules/internal-7.md#admindiscountslistres)\>

#### Defined in

[medusa-js/src/resources/admin/discounts.ts:119](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/discounts.ts#L119)

___

### removeRegion

▸ **removeRegion**(`id`, `regionId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-7.md#admindiscountsres)\>

**`Description`**

Removes a region from a discount

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `regionId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-7.md#admindiscountsres)\>

#### Defined in

[medusa-js/src/resources/admin/discounts.ts:136](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/discounts.ts#L136)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-7.md#admindiscountsres)\>

**`Description`**

Retrieves a discount

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-7.md#admindiscountsres)\>

#### Defined in

[medusa-js/src/resources/admin/discounts.ts:97](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/discounts.ts#L97)

___

### retrieveByCode

▸ **retrieveByCode**(`code`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-7.md#admindiscountsres)\>

**`Description`**

Retrieves a discount by code

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-7.md#admindiscountsres)\>

#### Defined in

[medusa-js/src/resources/admin/discounts.ts:108](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/discounts.ts#L108)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-7.md#admindiscountsres)\>

**`Description`**

Updates discount

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostDiscountsDiscountReq`](internal-7.AdminPostDiscountsDiscountReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-7.md#admindiscountsres)\>

#### Defined in

[medusa-js/src/resources/admin/discounts.ts:50](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/discounts.ts#L50)

___

### updateCondition

▸ **updateCondition**(`discountId`, `conditionId`, `payload`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-7.md#admindiscountsres)\>

**`Description`**

Updates a discount condition

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountId` | `string` |
| `conditionId` | `string` |
| `payload` | [`AdminPostDiscountsDiscountConditionsCondition`](internal-7.AdminPostDiscountsDiscountConditionsCondition.md) |
| `query` | [`AdminPostDiscountsDiscountConditionsConditionParams`](internal-7.AdminPostDiscountsDiscountConditionsConditionParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-7.md#admindiscountsres)\>

#### Defined in

[medusa-js/src/resources/admin/discounts.ts:167](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/discounts.ts#L167)
