# Class: AdminCustomersResource

## Hierarchy

- `default`

  ↳ **`AdminCustomersResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomersRes`](../modules/internal.md#admincustomersres)\>

Creates a customer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`AdminPostCustomersReq`](internal.AdminPostCustomersReq.md) | information of customer |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomersRes`](../modules/internal.md#admincustomersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/customers.ts:18](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/customers.ts#L18)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomersListRes`](../modules/internal.md#admincustomerslistres)\>

Lists customers

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | [`AdminGetCustomersParams`](internal.AdminGetCustomersParams.md) | optional |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomersListRes`](../modules/internal.md#admincustomerslistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/customers.ts:59](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/customers.ts#L59)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomersRes`](../modules/internal.md#admincustomersres)\>

Retrieves a customer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | customer id |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomersRes`](../modules/internal.md#admincustomersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/customers.ts:46](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/customers.ts#L46)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomersRes`](../modules/internal.md#admincustomersres)\>

Updates a customer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | customer id |
| `payload` | [`AdminPostCustomersCustomerReq`](internal.AdminPostCustomersCustomerReq.md) | data to update customer with |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCustomersRes`](../modules/internal.md#admincustomersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/customers.ts:32](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/customers.ts#L32)
