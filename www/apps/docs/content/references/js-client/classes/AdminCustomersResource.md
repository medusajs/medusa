---
displayed_sidebar: jsClientSidebar
---

# Class: AdminCustomersResource

## Hierarchy

- `default`

  ↳ **`AdminCustomersResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCustomersRes`](../modules/internal-7.md#admincustomersres)\>

Creates a customer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`AdminPostCustomersReq`](internal-7.AdminPostCustomersReq.md) | information of customer |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCustomersRes`](../modules/internal-7.md#admincustomersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/customers.ts:18](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/customers.ts#L18)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCustomersListRes`](../modules/internal-7.md#admincustomerslistres)\>

Lists customers

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | [`AdminGetCustomersParams`](internal-7.AdminGetCustomersParams.md) | optional |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCustomersListRes`](../modules/internal-7.md#admincustomerslistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/customers.ts:59](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/customers.ts#L59)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCustomersRes`](../modules/internal-7.md#admincustomersres)\>

Retrieves a customer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | customer id |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCustomersRes`](../modules/internal-7.md#admincustomersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/customers.ts:46](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/customers.ts#L46)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCustomersRes`](../modules/internal-7.md#admincustomersres)\>

Updates a customer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | customer id |
| `payload` | [`AdminPostCustomersCustomerReq`](internal-7.AdminPostCustomersCustomerReq.md) | data to update customer with |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCustomersRes`](../modules/internal-7.md#admincustomersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/customers.ts:32](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/customers.ts#L32)
