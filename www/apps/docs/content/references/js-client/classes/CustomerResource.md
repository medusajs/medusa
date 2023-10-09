# Class: CustomerResource

## Hierarchy

- `default`

  ↳ **`CustomerResource`**

## Properties

### addresses

• **addresses**: [`AddressesResource`](AddressesResource.md)

#### Defined in

[customers.ts:18](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/customers.ts#L18)

___

### paymentMethods

• **paymentMethods**: [`PaymentMethodsResource`](PaymentMethodsResource.md)

#### Defined in

[customers.ts:17](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/customers.ts#L17)

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): `ResponsePromise`<`StoreCustomersRes`\>

Creates a customer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `StorePostCustomersReq` | information of customer |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`StoreCustomersRes`\>

#### Defined in

[customers.ts:26](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/customers.ts#L26)

___

### generatePasswordToken

▸ **generatePasswordToken**(`payload`, `customHeaders?`): `ResponsePromise`

Generates a reset password token, which can be used to reset the password.
The token is not returned but should be sent out to the customer in an email.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `StorePostCustomersCustomerPasswordTokenReq` | info used to generate token |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`

#### Defined in

[customers.ts:101](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/customers.ts#L101)

___

### listOrders

▸ **listOrders**(`params?`, `customHeaders?`): `ResponsePromise`<`StoreCustomersListOrdersRes`\>

Retrieve customer orders

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params?` | `StoreGetCustomersCustomerOrdersParams` | optional params to retrieve orders |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`StoreCustomersListOrdersRes`\>

#### Defined in

[customers.ts:66](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/customers.ts#L66)

___

### resetPassword

▸ **resetPassword**(`payload`, `customHeaders?`): `ResponsePromise`<`StoreCustomersRes`\>

Resets customer password

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `StorePostCustomersResetPasswordReq` | info used to reset customer password |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`StoreCustomersRes`\>

#### Defined in

[customers.ts:86](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/customers.ts#L86)

___

### retrieve

▸ **retrieve**(`customHeaders?`): `ResponsePromise`<`StoreCustomersRes`\>

Retrieves the customer that is currently logged

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`StoreCustomersRes`\>

#### Defined in

[customers.ts:39](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/customers.ts#L39)

___

### update

▸ **update**(`payload`, `customHeaders?`): `ResponsePromise`<`StoreCustomersRes`\>

Updates a customer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `StorePostCustomersCustomerReq` | information to update customer with |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`StoreCustomersRes`\>

#### Defined in

[customers.ts:52](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/customers.ts#L52)
