# Class: AdminCustomerGroupsResource

## Hierarchy

- `default`

  ↳ **`AdminCustomerGroupsResource`**

## Methods

### addCustomers

▸ **addCustomers**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminCustomerGroupsRes`\>

Add multiple customers to a customer group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | customer group id |
| `payload` | `AdminPostCustomerGroupsGroupCustomersBatchReq` | an object which contains an array of customer ids which will be added to the group |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminCustomerGroupsRes`\>

#### Defined in

[admin/customer-groups.ts:112](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/customer-groups.ts#L112)

___

### create

▸ **create**(`payload`, `customHeaders?`): `ResponsePromise`<`AdminCustomerGroupsRes`\>

Create a customer group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `AdminPostCustomerGroupsReq` | customer group info |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminCustomerGroupsRes`\>

#### Defined in

[admin/customer-groups.ts:26](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/customer-groups.ts#L26)

___

### delete

▸ **delete**(`id`, `customHeaders?`): `ResponsePromise`<`DeleteResponse`\>

Deletes a customer group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the customer group |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`DeleteResponse`\>

#### Defined in

[admin/customer-groups.ts:77](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/customer-groups.ts#L77)

___

### list

▸ **list**(`query?`, `customHeaders?`): `ResponsePromise`<`AdminCustomerGroupsListRes`\>

Lists customer groups.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | `AdminGetCustomerGroupsParams` | optional |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminCustomerGroupsListRes`\>

#### Defined in

[admin/customer-groups.ts:91](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/customer-groups.ts#L91)

___

### listCustomers

▸ **listCustomers**(`id`, `query?`, `customHeaders?`): `ResponsePromise`<`AdminCustomersListRes`\>

List and count customers that belong to provided customer groups.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | customer group id |
| `query?` | `AdminGetCustomersParams` | params for filtering customers |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminCustomersListRes`\>

#### Defined in

[admin/customer-groups.ts:144](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/customer-groups.ts#L144)

___

### removeCustomers

▸ **removeCustomers**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminCustomerGroupsRes`\>

Remove multiple customers from a customer group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | customer group id |
| `payload` | `AdminDeleteCustomerGroupsGroupCustomerBatchReq` | an object which contains an array of customers ids which will be removed from the group |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminCustomerGroupsRes`\>

#### Defined in

[admin/customer-groups.ts:128](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/customer-groups.ts#L128)

___

### retrieve

▸ **retrieve**(`id`, `query?`, `customHeaders?`): `ResponsePromise`<`AdminCustomerGroupsRes`\>

Retrieves a customer group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | customer group id |
| `query?` | `AdminGetCustomerGroupsGroupParams` | pass query options such as "expand", "fields" etc. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminCustomerGroupsRes`\>

#### Defined in

[admin/customer-groups.ts:41](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/customer-groups.ts#L41)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminCustomerGroupsRes`\>

Updates a customer group

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | customer group id |
| `payload` | `AdminPostCustomerGroupsGroupReq` | data to update customer group with |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminCustomerGroupsRes`\>

#### Defined in

[admin/customer-groups.ts:62](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/customer-groups.ts#L62)
