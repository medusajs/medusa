# Class: AdminCustomerGroupsResource

## Hierarchy

- `default`

  ↳ **`AdminCustomerGroupsResource`**

## Methods

### addCustomers

▸ **addCustomers**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomerGroupsRes`](../modules/internal.md#admincustomergroupsres)\>

Add multiple customers to a customer group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | customer group id |
| `payload` | [`AdminPostCustomerGroupsGroupCustomersBatchReq`](internal.AdminPostCustomerGroupsGroupCustomersBatchReq.md) | an object which contains an array of customer ids which will be added to the group |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomerGroupsRes`](../modules/internal.md#admincustomergroupsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/customer-groups.ts:112](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/customer-groups.ts#L112)

___

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomerGroupsRes`](../modules/internal.md#admincustomergroupsres)\>

Create a customer group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`AdminPostCustomerGroupsReq`](internal.AdminPostCustomerGroupsReq.md) | customer group info |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomerGroupsRes`](../modules/internal.md#admincustomergroupsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/customer-groups.ts:26](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/customer-groups.ts#L26)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal.md#deleteresponse)\>

Deletes a customer group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the customer group |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal.md#deleteresponse)\>

#### Defined in

[packages/medusa-js/src/resources/admin/customer-groups.ts:77](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/customer-groups.ts#L77)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomerGroupsListRes`](../modules/internal.md#admincustomergroupslistres)\>

Lists customer groups.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | [`AdminGetCustomerGroupsParams`](internal.AdminGetCustomerGroupsParams.md) | optional |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomerGroupsListRes`](../modules/internal.md#admincustomergroupslistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/customer-groups.ts:91](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/customer-groups.ts#L91)

___

### listCustomers

▸ **listCustomers**(`id`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomersListRes`](../modules/internal.md#admincustomerslistres)\>

List and count customers that belong to provided customer groups.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | customer group id |
| `query?` | [`AdminGetCustomersParams`](internal.AdminGetCustomersParams.md) | params for filtering customers |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomersListRes`](../modules/internal.md#admincustomerslistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/customer-groups.ts:144](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/customer-groups.ts#L144)

___

### removeCustomers

▸ **removeCustomers**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomerGroupsRes`](../modules/internal.md#admincustomergroupsres)\>

Remove multiple customers from a customer group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | customer group id |
| `payload` | [`AdminDeleteCustomerGroupsGroupCustomerBatchReq`](internal.AdminDeleteCustomerGroupsGroupCustomerBatchReq.md) | an object which contains an array of customers ids which will be removed from the group |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomerGroupsRes`](../modules/internal.md#admincustomergroupsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/customer-groups.ts:128](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/customer-groups.ts#L128)

___

### retrieve

▸ **retrieve**(`id`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomerGroupsRes`](../modules/internal.md#admincustomergroupsres)\>

Retrieves a customer group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | customer group id |
| `query?` | [`AdminGetCustomerGroupsGroupParams`](internal.AdminGetCustomerGroupsGroupParams.md) | pass query options such as "expand", "fields" etc. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomerGroupsRes`](../modules/internal.md#admincustomergroupsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/customer-groups.ts:41](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/customer-groups.ts#L41)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomerGroupsRes`](../modules/internal.md#admincustomergroupsres)\>

Updates a customer group

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | customer group id |
| `payload` | [`AdminPostCustomerGroupsGroupReq`](internal.AdminPostCustomerGroupsGroupReq.md) | data to update customer group with |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomerGroupsRes`](../modules/internal.md#admincustomergroupsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/customer-groups.ts:62](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/customer-groups.ts#L62)
