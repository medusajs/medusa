# Class: AdminDiscountsResource

## Hierarchy

- `default`

  ↳ **`AdminDiscountsResource`**

## Methods

### addRegion

▸ **addRegion**(`id`, `regionId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-6.md#admindiscountsres)\>

**`Description`**

Adds region to discount

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `regionId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-6.md#admindiscountsres)\>

#### Defined in

[medusa-js/src/resources/admin/discounts.ts:24](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/discounts.ts#L24)

___

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-6.md#admindiscountsres)\>

**`Description`**

Creates discounts

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostDiscountsReq`](internal-6.AdminPostDiscountsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-6.md#admindiscountsres)\>

#### Defined in

[medusa-js/src/resources/admin/discounts.ts:36](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/discounts.ts#L36)

___

### createCondition

▸ **createCondition**(`discountId`, `payload`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-6.md#admindiscountsres)\>

**`Description`**

creates a discount condition

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountId` | `string` |
| `payload` | [`AdminPostDiscountsDiscountConditions`](internal-6.AdminPostDiscountsDiscountConditions.md) |
| `query` | [`AdminPostDiscountsDiscountConditionsParams`](internal-6.AdminPostDiscountsDiscountConditionsParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-6.md#admindiscountsres)\>

#### Defined in

[medusa-js/src/resources/admin/discounts.ts:145](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/discounts.ts#L145)

___

### createDynamicCode

▸ **createDynamicCode**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-6.md#admindiscountsres)\>

**`Description`**

Creates a dynamic discount code

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostDiscountsDiscountDynamicCodesReq`](internal-6.AdminPostDiscountsDiscountDynamicCodesReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-6.md#admindiscountsres)\>

#### Defined in

[medusa-js/src/resources/admin/discounts.ts:59](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/discounts.ts#L59)

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

[medusa-js/src/resources/admin/discounts.ts:71](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/discounts.ts#L71)

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

[medusa-js/src/resources/admin/discounts.ts:184](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/discounts.ts#L184)

___

### deleteDynamicCode

▸ **deleteDynamicCode**(`id`, `code`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-6.md#admindiscountsres)\>

**`Description`**

Deletes a dynamic discount

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `code` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-6.md#admindiscountsres)\>

#### Defined in

[medusa-js/src/resources/admin/discounts.ts:82](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/discounts.ts#L82)

___

### getCondition

▸ **getCondition**(`discountId`, `conditionId`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountConditionsRes`](../modules/internal-6.md#admindiscountconditionsres)\>

**`Description`**

Gets a condition from a discount

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountId` | `string` |
| `conditionId` | `string` |
| `query?` | [`AdminGetDiscountsDiscountConditionsConditionParams`](internal-6.AdminGetDiscountsDiscountConditionsConditionParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountConditionsRes`](../modules/internal-6.md#admindiscountconditionsres)\>

#### Defined in

[medusa-js/src/resources/admin/discounts.ts:196](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/discounts.ts#L196)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsListRes`](../modules/internal-6.md#admindiscountslistres)\>

**`Description`**

Lists discounts

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetDiscountsParams`](internal-6.AdminGetDiscountsParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsListRes`](../modules/internal-6.md#admindiscountslistres)\>

#### Defined in

[medusa-js/src/resources/admin/discounts.ts:116](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/discounts.ts#L116)

___

### removeRegion

▸ **removeRegion**(`id`, `regionId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-6.md#admindiscountsres)\>

**`Description`**

Removes a region from a discount

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `regionId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-6.md#admindiscountsres)\>

#### Defined in

[medusa-js/src/resources/admin/discounts.ts:133](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/discounts.ts#L133)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-6.md#admindiscountsres)\>

**`Description`**

Retrieves a discount

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-6.md#admindiscountsres)\>

#### Defined in

[medusa-js/src/resources/admin/discounts.ts:94](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/discounts.ts#L94)

___

### retrieveByCode

▸ **retrieveByCode**(`code`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-6.md#admindiscountsres)\>

**`Description`**

Retrieves a discount by code

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-6.md#admindiscountsres)\>

#### Defined in

[medusa-js/src/resources/admin/discounts.ts:105](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/discounts.ts#L105)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-6.md#admindiscountsres)\>

**`Description`**

Updates discount

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostDiscountsDiscountReq`](internal-6.AdminPostDiscountsDiscountReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-6.md#admindiscountsres)\>

#### Defined in

[medusa-js/src/resources/admin/discounts.ts:47](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/discounts.ts#L47)

___

### updateCondition

▸ **updateCondition**(`discountId`, `conditionId`, `payload`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-6.md#admindiscountsres)\>

**`Description`**

Updates a discount condition

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountId` | `string` |
| `conditionId` | `string` |
| `payload` | [`AdminPostDiscountsDiscountConditionsCondition`](internal-6.AdminPostDiscountsDiscountConditionsCondition.md) |
| `query` | [`AdminPostDiscountsDiscountConditionsConditionParams`](internal-6.AdminPostDiscountsDiscountConditionsConditionParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDiscountsRes`](../modules/internal-6.md#admindiscountsres)\>

#### Defined in

[medusa-js/src/resources/admin/discounts.ts:164](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/discounts.ts#L164)
