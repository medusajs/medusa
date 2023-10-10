---
displayed_sidebar: jsClientSidebar
---

# Class: AdminDiscountsResource

## Hierarchy

- `default`

  ↳ **`AdminDiscountsResource`**

## Methods

### addConditionResourceBatch

▸ **addConditionResourceBatch**(`discountId`, `conditionId`, `payload`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-8.md#admindiscountsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountId` | `string` |
| `conditionId` | `string` |
| `payload` | [`AdminPostDiscountsDiscountConditionsConditionBatchReq`](internal-8.AdminPostDiscountsDiscountConditionsConditionBatchReq.md) |
| `query?` | [`AdminPostDiscountsDiscountConditionsConditionBatchParams`](internal-8.AdminPostDiscountsDiscountConditionsConditionBatchParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-8.md#admindiscountsres)\>

**`Description`**

Add a batch of items to a discount condition

#### Defined in

[packages/medusa-js/src/resources/admin/discounts.ts:218](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/discounts.ts#L218)

___

### addRegion

▸ **addRegion**(`id`, `regionId`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-8.md#admindiscountsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `regionId` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-8.md#admindiscountsres)\>

**`Description`**

Adds region to discount

#### Defined in

[packages/medusa-js/src/resources/admin/discounts.ts:27](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/discounts.ts#L27)

___

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-8.md#admindiscountsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostDiscountsReq`](internal-8.AdminPostDiscountsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-8.md#admindiscountsres)\>

**`Description`**

Creates discounts

#### Defined in

[packages/medusa-js/src/resources/admin/discounts.ts:39](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/discounts.ts#L39)

___

### createCondition

▸ **createCondition**(`discountId`, `payload`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-8.md#admindiscountsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountId` | `string` |
| `payload` | [`AdminPostDiscountsDiscountConditions`](internal-8.AdminPostDiscountsDiscountConditions.md) |
| `query` | [`AdminPostDiscountsDiscountConditionsParams`](internal-8.AdminPostDiscountsDiscountConditionsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-8.md#admindiscountsres)\>

**`Description`**

creates a discount condition

#### Defined in

[packages/medusa-js/src/resources/admin/discounts.ts:148](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/discounts.ts#L148)

___

### createDynamicCode

▸ **createDynamicCode**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-8.md#admindiscountsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostDiscountsDiscountDynamicCodesReq`](internal-8.AdminPostDiscountsDiscountDynamicCodesReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-8.md#admindiscountsres)\>

**`Description`**

Creates a dynamic discount code

#### Defined in

[packages/medusa-js/src/resources/admin/discounts.ts:62](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/discounts.ts#L62)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

**`Description`**

Deletes a discount

#### Defined in

[packages/medusa-js/src/resources/admin/discounts.ts:74](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/discounts.ts#L74)

___

### deleteCondition

▸ **deleteCondition**(`discountId`, `conditionId`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountId` | `string` |
| `conditionId` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

**`Description`**

Removes a condition from a discount

#### Defined in

[packages/medusa-js/src/resources/admin/discounts.ts:187](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/discounts.ts#L187)

___

### deleteConditionResourceBatch

▸ **deleteConditionResourceBatch**(`discountId`, `conditionId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-8.md#admindiscountsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountId` | `string` |
| `conditionId` | `string` |
| `payload` | [`AdminDeleteDiscountsDiscountConditionsConditionBatchReq`](internal-8.AdminDeleteDiscountsDiscountConditionsConditionBatchReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-8.md#admindiscountsres)\>

**`Description`**

Delete a batch of items from a discount condition

#### Defined in

[packages/medusa-js/src/resources/admin/discounts.ts:238](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/discounts.ts#L238)

___

### deleteDynamicCode

▸ **deleteDynamicCode**(`id`, `code`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-8.md#admindiscountsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `code` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-8.md#admindiscountsres)\>

**`Description`**

Deletes a dynamic discount

#### Defined in

[packages/medusa-js/src/resources/admin/discounts.ts:85](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/discounts.ts#L85)

___

### getCondition

▸ **getCondition**(`discountId`, `conditionId`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDiscountConditionsRes`](../modules/internal-8.md#admindiscountconditionsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountId` | `string` |
| `conditionId` | `string` |
| `query?` | [`AdminGetDiscountsDiscountConditionsConditionParams`](internal-8.AdminGetDiscountsDiscountConditionsConditionParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDiscountConditionsRes`](../modules/internal-8.md#admindiscountconditionsres)\>

**`Description`**

Gets a condition from a discount

#### Defined in

[packages/medusa-js/src/resources/admin/discounts.ts:199](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/discounts.ts#L199)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDiscountsListRes`](../modules/internal-8.md#admindiscountslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetDiscountsParams`](internal-8.AdminGetDiscountsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDiscountsListRes`](../modules/internal-8.md#admindiscountslistres)\>

**`Description`**

Lists discounts

#### Defined in

[packages/medusa-js/src/resources/admin/discounts.ts:119](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/discounts.ts#L119)

___

### removeRegion

▸ **removeRegion**(`id`, `regionId`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-8.md#admindiscountsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `regionId` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-8.md#admindiscountsres)\>

**`Description`**

Removes a region from a discount

#### Defined in

[packages/medusa-js/src/resources/admin/discounts.ts:136](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/discounts.ts#L136)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-8.md#admindiscountsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-8.md#admindiscountsres)\>

**`Description`**

Retrieves a discount

#### Defined in

[packages/medusa-js/src/resources/admin/discounts.ts:97](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/discounts.ts#L97)

___

### retrieveByCode

▸ **retrieveByCode**(`code`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-8.md#admindiscountsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-8.md#admindiscountsres)\>

**`Description`**

Retrieves a discount by code

#### Defined in

[packages/medusa-js/src/resources/admin/discounts.ts:108](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/discounts.ts#L108)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-8.md#admindiscountsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostDiscountsDiscountReq`](internal-8.AdminPostDiscountsDiscountReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-8.md#admindiscountsres)\>

**`Description`**

Updates discount

#### Defined in

[packages/medusa-js/src/resources/admin/discounts.ts:50](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/discounts.ts#L50)

___

### updateCondition

▸ **updateCondition**(`discountId`, `conditionId`, `payload`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-8.md#admindiscountsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountId` | `string` |
| `conditionId` | `string` |
| `payload` | [`AdminPostDiscountsDiscountConditionsCondition`](internal-8.AdminPostDiscountsDiscountConditionsCondition.md) |
| `query` | [`AdminPostDiscountsDiscountConditionsConditionParams`](internal-8.AdminPostDiscountsDiscountConditionsConditionParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-8.md#admindiscountsres)\>

**`Description`**

Updates a discount condition

#### Defined in

[packages/medusa-js/src/resources/admin/discounts.ts:167](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/discounts.ts#L167)
