# Class: CustomerResource

## Hierarchy

- `default`

  ↳ **`CustomerResource`**

## Properties

### addresses

• **addresses**: [`AddressesResource`](AddressesResource.md)

#### Defined in

[packages/medusa-js/src/resources/customers.ts:17](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/customers.ts#L17)

___

### paymentMethods

• **paymentMethods**: [`PaymentMethodsResource`](PaymentMethodsResource.md)

#### Defined in

[packages/medusa-js/src/resources/customers.ts:16](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/customers.ts#L16)

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

Creates a customer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`StorePostCustomersReq`](internal.StorePostCustomersReq.md) | information of customer |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

#### Defined in

[packages/medusa-js/src/resources/customers.ts:25](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/customers.ts#L25)

___

### generatePasswordToken

▸ **generatePasswordToken**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<`any`\>

Generates a reset password token, which can be used to reset the password.
The token is not returned but should be sent out to the customer in an email.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`StorePostCustomersCustomerPasswordTokenReq`](internal.StorePostCustomersCustomerPasswordTokenReq.md) | info used to generate token |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<`any`\>

#### Defined in

[packages/medusa-js/src/resources/customers.ts:100](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/customers.ts#L100)

___

### listOrders

▸ **listOrders**(`params?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersListOrdersRes`](../modules/internal.md#storecustomerslistordersres)\>

Retrieve customer orders

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params?` | [`StoreGetCustomersCustomerOrdersParams`](internal.StoreGetCustomersCustomerOrdersParams.md) | optional params to retrieve orders |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersListOrdersRes`](../modules/internal.md#storecustomerslistordersres)\>

#### Defined in

[packages/medusa-js/src/resources/customers.ts:65](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/customers.ts#L65)

___

### resetPassword

▸ **resetPassword**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

Resets customer password

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`StorePostCustomersCustomerPasswordTokenReq`](internal.StorePostCustomersCustomerPasswordTokenReq.md) | info used to reset customer password |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

#### Defined in

[packages/medusa-js/src/resources/customers.ts:85](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/customers.ts#L85)

___

### retrieve

▸ **retrieve**(`customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

Retrieves the customer that is currently logged

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

#### Defined in

[packages/medusa-js/src/resources/customers.ts:38](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/customers.ts#L38)

___

### update

▸ **update**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

Updates a customer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`StorePostCustomersCustomerReq`](internal.StorePostCustomersCustomerReq.md) | information to update customer with |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

#### Defined in

[packages/medusa-js/src/resources/customers.ts:51](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/customers.ts#L51)
