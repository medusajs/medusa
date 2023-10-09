# Class: AdminCustomersResource

## Hierarchy

- `default`

  ↳ **`AdminCustomersResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): `ResponsePromise`<`AdminCustomersRes`\>

Creates a customer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `AdminPostCustomersReq` | information of customer |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminCustomersRes`\>

#### Defined in

[admin/customers.ts:18](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/customers.ts#L18)

___

### list

▸ **list**(`query?`, `customHeaders?`): `ResponsePromise`<`AdminCustomersListRes`\>

Lists customers

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | `AdminGetCustomersParams` | optional |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminCustomersListRes`\>

#### Defined in

[admin/customers.ts:59](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/customers.ts#L59)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): `ResponsePromise`<`AdminCustomersRes`\>

Retrieves a customer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | customer id |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminCustomersRes`\>

#### Defined in

[admin/customers.ts:46](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/customers.ts#L46)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminCustomersRes`\>

Updates a customer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | customer id |
| `payload` | `AdminPostCustomersCustomerReq` | data to update customer with |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminCustomersRes`\>

#### Defined in

[admin/customers.ts:32](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/customers.ts#L32)
