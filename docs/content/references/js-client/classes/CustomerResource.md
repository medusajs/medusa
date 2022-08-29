# Class: CustomerResource

## Hierarchy

- `default`

  ↳ **`CustomerResource`**

## Properties

### addresses

• **addresses**: [`AddressesResource`](AddressesResource.md)

#### Defined in

[medusa-js/src/resources/customers.ts:17](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/customers.ts#L17)

___

### paymentMethods

• **paymentMethods**: [`PaymentMethodsResource`](PaymentMethodsResource.md)

#### Defined in

[medusa-js/src/resources/customers.ts:16](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/customers.ts#L16)

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

Creates a customer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`StorePostCustomersReq`](internal-32.StorePostCustomersReq.md) | information of customer |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

#### Defined in

[medusa-js/src/resources/customers.ts:25](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/customers.ts#L25)

___

### generatePasswordToken

▸ **generatePasswordToken**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<`any`\>

Generates a reset password token, which can be used to reset the password.
The token is not returned but should be sent out to the customer in an email.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`StorePostCustomersCustomerPasswordTokenReq`](internal-32.StorePostCustomersCustomerPasswordTokenReq.md) | info used to generate token |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<`any`\>

#### Defined in

[medusa-js/src/resources/customers.ts:100](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/customers.ts#L100)

___

### listOrders

▸ **listOrders**(`params?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersListOrdersRes`](../modules/internal-32.md#storecustomerslistordersres)\>

Retrieve customer orders

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params?` | [`StoreGetCustomersCustomerOrdersParams`](internal-32.StoreGetCustomersCustomerOrdersParams.md) | optional params to retrieve orders |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersListOrdersRes`](../modules/internal-32.md#storecustomerslistordersres)\>

#### Defined in

[medusa-js/src/resources/customers.ts:65](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/customers.ts#L65)

___

### resetPassword

▸ **resetPassword**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

Resets customer password

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`StorePostCustomersCustomerPasswordTokenReq`](internal-32.StorePostCustomersCustomerPasswordTokenReq.md) | info used to reset customer password |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

#### Defined in

[medusa-js/src/resources/customers.ts:85](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/customers.ts#L85)

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

[medusa-js/src/resources/customers.ts:38](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/customers.ts#L38)

___

### update

▸ **update**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

Updates a customer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`StorePostCustomersCustomerReq`](internal-32.StorePostCustomersCustomerReq.md) | information to update customer with |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

#### Defined in

[medusa-js/src/resources/customers.ts:51](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/customers.ts#L51)
