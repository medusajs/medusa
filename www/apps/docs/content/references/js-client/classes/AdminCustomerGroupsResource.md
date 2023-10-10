---
displayed_sidebar: jsClientSidebar
---

# Class: AdminCustomerGroupsResource

## Hierarchy

- `default`

  ↳ **`AdminCustomerGroupsResource`**

## Methods

### addCustomers

▸ **addCustomers**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCustomerGroupsRes`](../modules/internal-6.md#admincustomergroupsres)\>

Add multiple customers to a customer group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | customer group id |
| `payload` | [`AdminPostCustomerGroupsGroupCustomersBatchReq`](internal-6.AdminPostCustomerGroupsGroupCustomersBatchReq.md) | an object which contains an array of customer ids which will be added to the group |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCustomerGroupsRes`](../modules/internal-6.md#admincustomergroupsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/customer-groups.ts:112](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/customer-groups.ts#L112)

___

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCustomerGroupsRes`](../modules/internal-6.md#admincustomergroupsres)\>

Create a customer group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`AdminPostCustomerGroupsReq`](internal-6.AdminPostCustomerGroupsReq.md) | customer group info |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCustomerGroupsRes`](../modules/internal-6.md#admincustomergroupsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/customer-groups.ts:26](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/customer-groups.ts#L26)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

Deletes a customer group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the customer group |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

#### Defined in

[packages/medusa-js/src/resources/admin/customer-groups.ts:77](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/customer-groups.ts#L77)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCustomerGroupsListRes`](../modules/internal-6.md#admincustomergroupslistres)\>

Lists customer groups.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | [`AdminGetCustomerGroupsParams`](internal-6.AdminGetCustomerGroupsParams.md) | optional |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCustomerGroupsListRes`](../modules/internal-6.md#admincustomergroupslistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/customer-groups.ts:91](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/customer-groups.ts#L91)

___

### listCustomers

▸ **listCustomers**(`id`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCustomersListRes`](../modules/internal-7.md#admincustomerslistres)\>

List and count customers that belong to provided customer groups.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | customer group id |
| `query?` | [`AdminGetCustomersParams`](internal-7.AdminGetCustomersParams.md) | params for filtering customers |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCustomersListRes`](../modules/internal-7.md#admincustomerslistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/customer-groups.ts:144](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/customer-groups.ts#L144)

___

### removeCustomers

▸ **removeCustomers**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCustomerGroupsRes`](../modules/internal-6.md#admincustomergroupsres)\>

Remove multiple customers from a customer group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | customer group id |
| `payload` | [`AdminDeleteCustomerGroupsGroupCustomerBatchReq`](internal-6.AdminDeleteCustomerGroupsGroupCustomerBatchReq.md) | an object which contains an array of customers ids which will be removed from the group |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCustomerGroupsRes`](../modules/internal-6.md#admincustomergroupsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/customer-groups.ts:128](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/customer-groups.ts#L128)

___

### retrieve

▸ **retrieve**(`id`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCustomerGroupsRes`](../modules/internal-6.md#admincustomergroupsres)\>

Retrieves a customer group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | customer group id |
| `query?` | [`AdminGetCustomerGroupsGroupParams`](internal-6.AdminGetCustomerGroupsGroupParams.md) | pass query options such as "expand", "fields" etc. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCustomerGroupsRes`](../modules/internal-6.md#admincustomergroupsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/customer-groups.ts:41](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/customer-groups.ts#L41)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCustomerGroupsRes`](../modules/internal-6.md#admincustomergroupsres)\>

Updates a customer group

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | customer group id |
| `payload` | [`AdminPostCustomerGroupsGroupReq`](internal-6.AdminPostCustomerGroupsGroupReq.md) | data to update customer group with |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCustomerGroupsRes`](../modules/internal-6.md#admincustomergroupsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/customer-groups.ts:62](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/customer-groups.ts#L62)
