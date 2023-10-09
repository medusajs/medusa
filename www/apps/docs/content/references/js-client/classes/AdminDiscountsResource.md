# Class: AdminDiscountsResource

## Hierarchy

- `default`

  ↳ **`AdminDiscountsResource`**

## Methods

### addConditionResourceBatch

▸ **addConditionResourceBatch**(`discountId`, `conditionId`, `payload`, `query?`, `customHeaders?`): `ResponsePromise`<`AdminDiscountsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountId` | `string` |
| `conditionId` | `string` |
| `payload` | `AdminPostDiscountsDiscountConditionsConditionBatchReq` |
| `query?` | `AdminPostDiscountsDiscountConditionsConditionBatchParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminDiscountsRes`\>

**`Description`**

Add a batch of items to a discount condition

#### Defined in

[admin/discounts.ts:218](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/discounts.ts#L218)

___

### addRegion

▸ **addRegion**(`id`, `regionId`, `customHeaders?`): `ResponsePromise`<`AdminDiscountsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `regionId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminDiscountsRes`\>

**`Description`**

Adds region to discount

#### Defined in

[admin/discounts.ts:27](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/discounts.ts#L27)

___

### create

▸ **create**(`payload`, `customHeaders?`): `ResponsePromise`<`AdminDiscountsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `AdminPostDiscountsReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminDiscountsRes`\>

**`Description`**

Creates discounts

#### Defined in

[admin/discounts.ts:39](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/discounts.ts#L39)

___

### createCondition

▸ **createCondition**(`discountId`, `payload`, `query?`, `customHeaders?`): `ResponsePromise`<`AdminDiscountsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountId` | `string` |
| `payload` | `AdminPostDiscountsDiscountConditions` |
| `query` | `AdminPostDiscountsDiscountConditionsParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminDiscountsRes`\>

**`Description`**

creates a discount condition

#### Defined in

[admin/discounts.ts:148](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/discounts.ts#L148)

___

### createDynamicCode

▸ **createDynamicCode**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminDiscountsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `AdminPostDiscountsDiscountDynamicCodesReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminDiscountsRes`\>

**`Description`**

Creates a dynamic discount code

#### Defined in

[admin/discounts.ts:62](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/discounts.ts#L62)

___

### delete

▸ **delete**(`id`, `customHeaders?`): `ResponsePromise`<`DeleteResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`DeleteResponse`\>

**`Description`**

Deletes a discount

#### Defined in

[admin/discounts.ts:74](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/discounts.ts#L74)

___

### deleteCondition

▸ **deleteCondition**(`discountId`, `conditionId`, `customHeaders?`): `ResponsePromise`<`DeleteResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountId` | `string` |
| `conditionId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`DeleteResponse`\>

**`Description`**

Removes a condition from a discount

#### Defined in

[admin/discounts.ts:187](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/discounts.ts#L187)

___

### deleteConditionResourceBatch

▸ **deleteConditionResourceBatch**(`discountId`, `conditionId`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminDiscountsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountId` | `string` |
| `conditionId` | `string` |
| `payload` | `AdminDeleteDiscountsDiscountConditionsConditionBatchReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminDiscountsRes`\>

**`Description`**

Delete a batch of items from a discount condition

#### Defined in

[admin/discounts.ts:238](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/discounts.ts#L238)

___

### deleteDynamicCode

▸ **deleteDynamicCode**(`id`, `code`, `customHeaders?`): `ResponsePromise`<`AdminDiscountsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `code` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminDiscountsRes`\>

**`Description`**

Deletes a dynamic discount

#### Defined in

[admin/discounts.ts:85](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/discounts.ts#L85)

___

### getCondition

▸ **getCondition**(`discountId`, `conditionId`, `query?`, `customHeaders?`): `ResponsePromise`<`AdminDiscountConditionsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountId` | `string` |
| `conditionId` | `string` |
| `query?` | `AdminGetDiscountsDiscountConditionsConditionParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminDiscountConditionsRes`\>

**`Description`**

Gets a condition from a discount

#### Defined in

[admin/discounts.ts:199](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/discounts.ts#L199)

___

### list

▸ **list**(`query?`, `customHeaders?`): `ResponsePromise`<`AdminDiscountsListRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | `AdminGetDiscountsParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminDiscountsListRes`\>

**`Description`**

Lists discounts

#### Defined in

[admin/discounts.ts:119](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/discounts.ts#L119)

___

### removeRegion

▸ **removeRegion**(`id`, `regionId`, `customHeaders?`): `ResponsePromise`<`AdminDiscountsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `regionId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminDiscountsRes`\>

**`Description`**

Removes a region from a discount

#### Defined in

[admin/discounts.ts:136](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/discounts.ts#L136)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): `ResponsePromise`<`AdminDiscountsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminDiscountsRes`\>

**`Description`**

Retrieves a discount

#### Defined in

[admin/discounts.ts:97](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/discounts.ts#L97)

___

### retrieveByCode

▸ **retrieveByCode**(`code`, `customHeaders?`): `ResponsePromise`<`AdminDiscountsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminDiscountsRes`\>

**`Description`**

Retrieves a discount by code

#### Defined in

[admin/discounts.ts:108](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/discounts.ts#L108)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminDiscountsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `AdminPostDiscountsDiscountReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminDiscountsRes`\>

**`Description`**

Updates discount

#### Defined in

[admin/discounts.ts:50](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/discounts.ts#L50)

___

### updateCondition

▸ **updateCondition**(`discountId`, `conditionId`, `payload`, `query?`, `customHeaders?`): `ResponsePromise`<`AdminDiscountsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountId` | `string` |
| `conditionId` | `string` |
| `payload` | `AdminPostDiscountsDiscountConditionsCondition` |
| `query` | `AdminPostDiscountsDiscountConditionsConditionParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminDiscountsRes`\>

**`Description`**

Updates a discount condition

#### Defined in

[admin/discounts.ts:167](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/discounts.ts#L167)
