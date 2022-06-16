# Class: CustomerService

Provides layer to manipulate customers.

**`implements`** {BaseService}

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`CustomerService`**

## Constructors

### constructor

• **new CustomerService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

BaseService.constructor

#### Defined in

[services/customer.js:20](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/customer.js#L20)

## Properties

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `PASSWORD_RESET` | `string` |
| `UPDATED` | `string` |

#### Defined in

[services/customer.js:14](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/customer.js#L14)

## Methods

### addAddress

▸ **addAddress**(`customerId`, `address`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customerId` | `any` |
| `address` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/customer.js:479](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/customer.js#L479)

___

### count

▸ **count**(): `Promise`<`any`\>

Return the total number of documents in database

#### Returns

`Promise`<`any`\>

the result of the count operation

#### Defined in

[services/customer.js:192](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/customer.js#L192)

___

### create

▸ **create**(`customer`): `Promise`<`any`\>

Creates a customer from an email - customers can have accounts associated,
e.g. to login and view order history, etc. If a password is provided the
customer will automatically get an account, otherwise the customer is just
used to hold details of customers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customer` | `any` | the customer to create |

#### Returns

`Promise`<`any`\>

the result of create

#### Defined in

[services/customer.js:290](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/customer.js#L290)

___

### decorate

▸ **decorate**(`customer`, `fields?`, `expandFields?`): `Customer`

Decorates a customer.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `customer` | `Customer` | `undefined` | the cart to decorate. |
| `fields` | `string`[] | `[]` | the fields to include. |
| `expandFields` | `string`[] | `[]` | fields to expand. |

#### Returns

`Customer`

return the decorated customer.

#### Defined in

[services/customer.js:547](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/customer.js#L547)

___

### delete

▸ **delete**(`customerId`): `Promise`<`any`\>

Deletes a customer from a given customer id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customerId` | `string` | the id of the customer to delete. Must be   castable as an ObjectId |

#### Returns

`Promise`<`any`\>

the result of the delete operation.

#### Defined in

[services/customer.js:523](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/customer.js#L523)

___

### generateResetPasswordToken

▸ **generateResetPasswordToken**(`customerId`): `string`

Generate a JSON Web token, that will be sent to a customer, that wishes to
reset password.
The token will be signed with the customer's current password hash as a
secret a long side a payload with userId and the expiry time for the token,
which is always 15 minutes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customerId` | `string` | the customer to reset the password for |

#### Returns

`string`

the generated JSON web token

#### Defined in

[services/customer.js:67](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/customer.js#L67)

___

### hashPassword\_

▸ **hashPassword_**(`password`): `Promise`<`string`\>

Hashes a password

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `password` | `string` | the value to hash |

#### Returns

`Promise`<`string`\>

hashed password

#### Defined in

[services/customer.js:277](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/customer.js#L277)

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` | the query object for find |
| `config` | `any` | the config object containing query settings |

#### Returns

`Promise`<`any`\>

the result of the find operation

#### Defined in

[services/customer.js:106](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/customer.js#L106)

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` | the query object for find |
| `config` | `FindConfig`<`Customer`\> | the config object containing query settings |

#### Returns

`Promise`<`any`\>

the result of the find operation

#### Defined in

[services/customer.js:147](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/customer.js#L147)

___

### removeAddress

▸ **removeAddress**(`customerId`, `addressId`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customerId` | `any` |
| `addressId` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/customer.js:460](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/customer.js#L460)

___

### retrieve

▸ **retrieve**(`customerId`, `config?`): `Promise`<`Customer`\>

Gets a customer by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customerId` | `string` | the id of the customer to get. |
| `config` | `any` | the config object containing query settings |

#### Returns

`Promise`<`Customer`\>

the customer document.

#### Defined in

[services/customer.js:205](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/customer.js#L205)

___

### retrieveByEmail

▸ **retrieveByEmail**(`email`, `config?`): `Promise`<`Customer`\>

Gets a customer by email.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` | the email of the customer to get. |
| `config` | `any` | the config object containing query settings |

#### Returns

`Promise`<`Customer`\>

the customer document.

#### Defined in

[services/customer.js:230](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/customer.js#L230)

___

### retrieveByPhone

▸ **retrieveByPhone**(`phone`, `config?`): `Promise`<`Customer`\>

Gets a customer by phone.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `phone` | `string` | the phone of the customer to get. |
| `config` | `any` | the config object containing query settings |

#### Returns

`Promise`<`Customer`\>

the customer document.

#### Defined in

[services/customer.js:254](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/customer.js#L254)

___

### update

▸ **update**(`customerId`, `update`): `Promise`<`any`\>

Updates a customer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customerId` | `string` | the id of the variant. Must be a string that   can be casted to an ObjectId |
| `update` | `any` | an object with the update values. |

#### Returns

`Promise`<`any`\>

resolves to the update result.

#### Defined in

[services/customer.js:346](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/customer.js#L346)

___

### updateAddress

▸ **updateAddress**(`customerId`, `addressId`, `address`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customerId` | `any` |
| `addressId` | `any` |
| `address` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/customer.js:441](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/customer.js#L441)

___

### updateBillingAddress\_

▸ **updateBillingAddress_**(`customer`, `addressOrId`, `addrRepo`): `Promise`<`any`\>

Updates the customers' billing address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customer` | `Customer` | the Customer to update |
| `addressOrId` | `any` | the value to set the billing address to |
| `addrRepo` | `any` | address repository |

#### Returns

`Promise`<`any`\>

the result of the update operation

#### Defined in

[services/customer.js:408](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/customer.js#L408)

___

### withTransaction

▸ **withTransaction**(`transactionManager`): [`CustomerService`](CustomerService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager` | `any` |

#### Returns

[`CustomerService`](CustomerService.md)

#### Defined in

[services/customer.js:41](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/customer.js#L41)
