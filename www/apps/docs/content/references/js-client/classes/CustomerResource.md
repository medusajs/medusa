# Class: CustomerResource

## Hierarchy

- `default`

  ↳ **`CustomerResource`**

## Properties

### addresses

• **addresses**: [`AddressesResource`](AddressesResource.md)

#### Defined in

[medusa-js/src/resources/customers.ts:18](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/customers.ts#L18)

___

### paymentMethods

• **paymentMethods**: [`PaymentMethodsResource`](PaymentMethodsResource.md)

#### Defined in

[medusa-js/src/resources/customers.ts:17](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/customers.ts#L17)

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

Creates a customer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`StorePostCustomersReq`](internal-37.StorePostCustomersReq.md) | information of customer |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

#### Defined in

[medusa-js/src/resources/customers.ts:26](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/customers.ts#L26)

___

### generatePasswordToken

▸ **generatePasswordToken**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<`any`\>

Generates a reset password token, which can be used to reset the password.
The token is not returned but should be sent out to the customer in an email.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`StorePostCustomersCustomerPasswordTokenReq`](internal-37.StorePostCustomersCustomerPasswordTokenReq.md) | info used to generate token |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<`any`\>

#### Defined in

[medusa-js/src/resources/customers.ts:101](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/customers.ts#L101)

___

### listOrders

▸ **listOrders**(`params?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersListOrdersRes`](../modules/internal-37.md#storecustomerslistordersres)\>

Retrieve customer orders

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params?` | [`StoreGetCustomersCustomerOrdersParams`](internal-37.StoreGetCustomersCustomerOrdersParams.md) | optional params to retrieve orders |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersListOrdersRes`](../modules/internal-37.md#storecustomerslistordersres)\>

#### Defined in

[medusa-js/src/resources/customers.ts:66](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/customers.ts#L66)

___

### resetPassword

▸ **resetPassword**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

Resets customer password

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`StorePostCustomersResetPasswordReq`](internal-37.StorePostCustomersResetPasswordReq.md) | info used to reset customer password |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

#### Defined in

[medusa-js/src/resources/customers.ts:86](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/customers.ts#L86)

___

### retrieve

▸ **retrieve**(`customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

Retrieves the customer that is currently logged

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

#### Defined in

[medusa-js/src/resources/customers.ts:39](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/customers.ts#L39)

___

### update

▸ **update**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

Updates a customer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`StorePostCustomersCustomerReq`](internal-37.StorePostCustomersCustomerReq.md) | information to update customer with |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

#### Defined in

[medusa-js/src/resources/customers.ts:52](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/customers.ts#L52)
