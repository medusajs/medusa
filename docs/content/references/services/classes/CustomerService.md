# Class: CustomerService

Provides layer to manipulate customers.

## Hierarchy

- `TransactionBaseService`<[`CustomerService`](CustomerService.md)\>

  ↳ **`CustomerService`**

## Constructors

### constructor

• **new CustomerService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService&lt;CustomerService\&gt;.constructor

#### Defined in

[services/customer.ts:40](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/customer.ts#L40)

## Properties

### addressRepository\_

• `Protected` `Readonly` **addressRepository\_**: typeof `AddressRepository`

#### Defined in

[services/customer.ts:28](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/customer.ts#L28)

___

### configModule

• `Protected` `Optional` `Readonly` **configModule**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.configModule

___

### container

• `Protected` `Readonly` **container**: `unknown`

#### Inherited from

TransactionBaseService.container

___

### customerRepository\_

• `Protected` `Readonly` **customerRepository\_**: typeof `CustomerRepository`

#### Defined in

[services/customer.ts:27](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/customer.ts#L27)

___

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[services/customer.ts:29](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/customer.ts#L29)

___

### manager\_

• `Protected` `Readonly` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[services/customer.ts:31](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/customer.ts#L31)

___

### transactionManager\_

• `Protected` `Readonly` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/customer.ts:32](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/customer.ts#L32)

___

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `PASSWORD_RESET` | `string` |
| `UPDATED` | `string` |

#### Defined in

[services/customer.ts:34](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/customer.ts#L34)

## Methods

### addAddress

▸ **addAddress**(`customerId`, `address`): `Promise`<`Customer` \| `Address`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customerId` | `string` |
| `address` | `AddressCreatePayload` |

#### Returns

`Promise`<`Customer` \| `Address`\>

#### Defined in

[services/customer.ts:471](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/customer.ts#L471)

___

### atomicPhase\_

▸ `Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

Wraps some work within a transactional block. If the service already has
a transaction manager attached this will be reused, otherwise a new
transaction manager is created.

#### Type parameters

| Name |
| :------ |
| `TResult` |
| `TError` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

the result of the transactional work

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[interfaces/transaction-base-service.ts:53](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/interfaces/transaction-base-service.ts#L53)

___

### count

▸ **count**(): `Promise`<`number`\>

Return the total number of documents in database

#### Returns

`Promise`<`number`\>

the result of the count operation

#### Defined in

[services/customer.ts:161](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/customer.ts#L161)

___

### create

▸ **create**(`customer`): `Promise`<`Customer`\>

Creates a customer from an email - customers can have accounts associated,
e.g. to login and view order history, etc. If a password is provided the
customer will automatically get an account, otherwise the customer is just
used to hold details of customers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customer` | `CreateCustomerInput` | the customer to create |

#### Returns

`Promise`<`Customer`\>

the result of create

#### Defined in

[services/customer.ts:255](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/customer.ts#L255)

___

### delete

▸ **delete**(`customerId`): `Promise`<`void` \| `Customer`\>

Deletes a customer from a given customer id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customerId` | `string` | the id of the customer to delete. Must be   castable as an ObjectId |

#### Returns

`Promise`<`void` \| `Customer`\>

the result of the delete operation.

#### Defined in

[services/customer.ts:519](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/customer.ts#L519)

___

### generateResetPasswordToken

▸ **generateResetPasswordToken**(`customerId`): `Promise`<`string`\>

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

`Promise`<`string`\>

the generated JSON web token

#### Defined in

[services/customer.ts:65](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/customer.ts#L65)

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

[services/customer.ts:242](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/customer.ts#L242)

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<`Customer`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`Customer`\> & { `q?`: `string`  } | the query object for find |
| `config` | `FindConfig`<`Customer`\> | the config object containing query settings |

#### Returns

`Promise`<`Customer`[]\>

the result of the find operation

#### Defined in

[services/customer.ts:108](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/customer.ts#L108)

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[`Customer`[], `number`]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`Customer`\> & { `q?`: `string`  } | the query object for find |
| `config` | `FindConfig`<`Customer`\> | the config object containing query settings |

#### Returns

`Promise`<[`Customer`[], `number`]\>

the result of the find operation

#### Defined in

[services/customer.ts:133](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/customer.ts#L133)

___

### removeAddress

▸ **removeAddress**(`customerId`, `addressId`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customerId` | `string` |
| `addressId` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/customer.ts:454](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/customer.ts#L454)

___

### retrieve

▸ **retrieve**(`customerId`, `config?`): `Promise`<`Customer`\>

Gets a customer by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customerId` | `string` | the id of the customer to get. |
| `config` | `FindConfig`<`Customer`\> | the config object containing query settings |

#### Returns

`Promise`<`Customer`\>

the customer document.

#### Defined in

[services/customer.ts:228](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/customer.ts#L228)

___

### retrieveByEmail

▸ **retrieveByEmail**(`email`, `config?`): `Promise`<`Customer`\>

Gets a customer by email.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` | the email of the customer to get. |
| `config` | `FindConfig`<`Customer`\> | the config object containing query settings |

#### Returns

`Promise`<`Customer`\>

the customer document.

#### Defined in

[services/customer.ts:198](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/customer.ts#L198)

___

### retrieveByPhone

▸ **retrieveByPhone**(`phone`, `config?`): `Promise`<`Customer`\>

Gets a customer by phone.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `phone` | `string` | the phone of the customer to get. |
| `config` | `FindConfig`<`Customer`\> | the config object containing query settings |

#### Returns

`Promise`<`Customer`\>

the customer document.

#### Defined in

[services/customer.ts:213](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/customer.ts#L213)

___

### retrieve\_

▸ `Private` **retrieve_**(`selector`, `config?`): `Promise`<`Customer`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | `Selector`<`Customer`\> |
| `config` | `FindConfig`<`Customer`\> |

#### Returns

`Promise`<`Customer`\>

#### Defined in

[services/customer.ts:168](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/customer.ts#L168)

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Record`<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Inherited from

TransactionBaseService.shouldRetryTransaction\_

#### Defined in

[interfaces/transaction-base-service.ts:34](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/interfaces/transaction-base-service.ts#L34)

___

### update

▸ **update**(`customerId`, `update`): `Promise`<`Customer`\>

Updates a customer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customerId` | `string` | the id of the variant. Must be a string that   can be casted to an ObjectId |
| `update` | `UpdateCustomerInput` | an object with the update values. |

#### Returns

`Promise`<`Customer`\>

resolves to the update result.

#### Defined in

[services/customer.ts:310](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/customer.ts#L310)

___

### updateAddress

▸ **updateAddress**(`customerId`, `addressId`, `address`): `Promise`<`Address`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customerId` | `string` |
| `addressId` | `string` |
| `address` | `StorePostCustomersCustomerAddressesAddressReq` |

#### Returns

`Promise`<`Address`\>

#### Defined in

[services/customer.ts:426](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/customer.ts#L426)

___

### updateBillingAddress\_

▸ **updateBillingAddress_**(`customer`, `addressOrId`): `Promise`<`void`\>

Updates the customers' billing address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customer` | `Customer` | the Customer to update |
| `addressOrId` | `undefined` \| `string` \| `DeepPartial`<`Address`\> | the value to set the billing address to |

#### Returns

`Promise`<`void`\>

the result of the update operation

#### Defined in

[services/customer.ts:374](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/customer.ts#L374)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`CustomerService`](CustomerService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`CustomerService`](CustomerService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
