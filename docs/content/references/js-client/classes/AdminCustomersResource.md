# Class: AdminCustomersResource

## Hierarchy

- `default`

  ↳ **`AdminCustomersResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomersRes`](../modules/internal-6.md#admincustomersres)\>

Creates a customer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`AdminPostCustomersReq`](internal-6.AdminPostCustomersReq.md) | information of customer |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomersRes`](../modules/internal-6.md#admincustomersres)\>

#### Defined in

[medusa-js/src/resources/admin/customers.ts:18](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/customers.ts#L18)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomersListRes`](../modules/internal-5.md#admincustomerslistres)\>

Lists customers

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | [`AdminGetCustomersParams`](internal-5.AdminGetCustomersParams.md) | optional |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomersListRes`](../modules/internal-5.md#admincustomerslistres)\>

#### Defined in

[medusa-js/src/resources/admin/customers.ts:59](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/customers.ts#L59)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomersRes`](../modules/internal-6.md#admincustomersres)\>

Retrieves a customer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | customer id |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomersRes`](../modules/internal-6.md#admincustomersres)\>

#### Defined in

[medusa-js/src/resources/admin/customers.ts:46](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/customers.ts#L46)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomersRes`](../modules/internal-6.md#admincustomersres)\>

Updates a customer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | customer id |
| `payload` | [`AdminPostCustomersCustomerReq`](internal-6.AdminPostCustomersCustomerReq.md) | data to update customer with |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomersRes`](../modules/internal-6.md#admincustomersres)\>

#### Defined in

[medusa-js/src/resources/admin/customers.ts:32](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/customers.ts#L32)
