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

[customer.js:20](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/customer.js#L20)

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

[customer.js:14](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/customer.js#L14)

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

[customer.js:521](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/customer.js#L521)

___

### count

▸ **count**(): `Promise`<`any`\>

Return the total number of documents in database

#### Returns

`Promise`<`any`\>

the result of the count operation

#### Defined in

[customer.js:222](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/customer.js#L222)

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

[customer.js:320](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/customer.js#L320)

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

[customer.js:590](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/customer.js#L590)

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

[customer.js:566](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/customer.js#L566)

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

[customer.js:97](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/customer.js#L97)

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

[customer.js:307](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/customer.js#L307)

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

[customer.js:136](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/customer.js#L136)

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

[customer.js:177](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/customer.js#L177)

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

[customer.js:502](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/customer.js#L502)

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

[customer.js:235](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/customer.js#L235)

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

[customer.js:260](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/customer.js#L260)

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

[customer.js:284](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/customer.js#L284)

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

[customer.js:381](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/customer.js#L381)

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

[customer.js:481](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/customer.js#L481)

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

[customer.js:448](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/customer.js#L448)

___

### validateBillingAddress\_

▸ **validateBillingAddress_**(`address`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `any` |

#### Returns

`any`

#### Defined in

[customer.js:76](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/customer.js#L76)

___

### validateEmail\_

▸ **validateEmail_**(`email`): `string`

Used to validate customer email.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` | email to validate |

#### Returns

`string`

the validated email

#### Defined in

[customer.js:63](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/customer.js#L63)

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

[customer.js:41](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/customer.js#L41)
