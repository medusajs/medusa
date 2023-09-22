# Class: AdminCustomerGroupsResource

## Hierarchy

- `default`

  ↳ **`AdminCustomerGroupsResource`**

## Methods

### addCustomers

▸ **addCustomers**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomerGroupsRes`](../modules/internal-5.md#admincustomergroupsres)\>

Add multiple customers to a customer group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | customer group id |
| `payload` | [`AdminPostCustomerGroupsGroupCustomersBatchReq`](internal-5.AdminPostCustomerGroupsGroupCustomersBatchReq.md) | an object which contains an array of customer ids which will be added to the group |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomerGroupsRes`](../modules/internal-5.md#admincustomergroupsres)\>

#### Defined in

[medusa-js/src/resources/admin/customer-groups.ts:112](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/customer-groups.ts#L112)

___

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomerGroupsRes`](../modules/internal-5.md#admincustomergroupsres)\>

Create a customer group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`AdminPostCustomerGroupsReq`](internal-5.AdminPostCustomerGroupsReq.md) | customer group info |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomerGroupsRes`](../modules/internal-5.md#admincustomergroupsres)\>

#### Defined in

[medusa-js/src/resources/admin/customer-groups.ts:26](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/customer-groups.ts#L26)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

Deletes a customer group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the customer group |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

#### Defined in

[medusa-js/src/resources/admin/customer-groups.ts:77](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/customer-groups.ts#L77)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomerGroupsListRes`](../modules/internal-5.md#admincustomergroupslistres)\>

Lists customer groups.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | [`AdminGetCustomerGroupsParams`](internal-5.AdminGetCustomerGroupsParams.md) | optional |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomerGroupsListRes`](../modules/internal-5.md#admincustomergroupslistres)\>

#### Defined in

[medusa-js/src/resources/admin/customer-groups.ts:91](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/customer-groups.ts#L91)

___

### listCustomers

▸ **listCustomers**(`id`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomersListRes`](../modules/internal-5.md#admincustomerslistres)\>

List and count customers that belong to provided customer groups.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | customer group id |
| `query?` | [`AdminGetCustomersParams`](internal-5.AdminGetCustomersParams.md) | params for filtering customers |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomersListRes`](../modules/internal-5.md#admincustomerslistres)\>

#### Defined in

[medusa-js/src/resources/admin/customer-groups.ts:144](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/customer-groups.ts#L144)

___

### removeCustomers

▸ **removeCustomers**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomerGroupsRes`](../modules/internal-5.md#admincustomergroupsres)\>

Remove multiple customers from a customer group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | customer group id |
| `payload` | [`AdminDeleteCustomerGroupsGroupCustomerBatchReq`](internal-5.AdminDeleteCustomerGroupsGroupCustomerBatchReq.md) | an object which contains an array of customers ids which will be removed from the group |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomerGroupsRes`](../modules/internal-5.md#admincustomergroupsres)\>

#### Defined in

[medusa-js/src/resources/admin/customer-groups.ts:128](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/customer-groups.ts#L128)

___

### retrieve

▸ **retrieve**(`id`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomerGroupsRes`](../modules/internal-5.md#admincustomergroupsres)\>

Retrieves a customer group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | customer group id |
| `query?` | [`AdminGetCustomerGroupsGroupParams`](internal-5.AdminGetCustomerGroupsGroupParams.md) | pass query options such as "expand", "fields" etc. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomerGroupsRes`](../modules/internal-5.md#admincustomergroupsres)\>

#### Defined in

[medusa-js/src/resources/admin/customer-groups.ts:41](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/customer-groups.ts#L41)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomerGroupsRes`](../modules/internal-5.md#admincustomergroupsres)\>

Updates a customer group

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | customer group id |
| `payload` | [`AdminPostCustomerGroupsGroupReq`](internal-5.AdminPostCustomerGroupsGroupReq.md) | data to update customer group with |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomerGroupsRes`](../modules/internal-5.md#admincustomergroupsres)\>

#### Defined in

[medusa-js/src/resources/admin/customer-groups.ts:62](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/customer-groups.ts#L62)
