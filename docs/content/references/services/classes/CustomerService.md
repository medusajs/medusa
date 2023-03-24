# Class: CustomerService

Provides layer to manipulate customers.

## Hierarchy

- `TransactionBaseService`

  ↳ **`CustomerService`**

## Constructors

### constructor

• **new CustomerService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/customer.ts:39](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/customer.ts#L39)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:11](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L11)

___

### addressRepository\_

• `Protected` `Readonly` **addressRepository\_**: typeof `AddressRepository`

#### Defined in

[packages/medusa/src/services/customer.ts:27](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/customer.ts#L27)

___

### customerRepository\_

• `Protected` `Readonly` **customerRepository\_**: typeof `CustomerRepository`

#### Defined in

[packages/medusa/src/services/customer.ts:26](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/customer.ts#L26)

___

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/customer.ts:28](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/customer.ts#L28)

___

### manager\_

• `Protected` `Readonly` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/customer.ts:30](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/customer.ts#L30)

___

### transactionManager\_

• `Protected` `Readonly` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/customer.ts:31](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/customer.ts#L31)

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

[packages/medusa/src/services/customer.ts:33](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/customer.ts#L33)

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

[packages/medusa/src/services/customer.ts:498](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/customer.ts#L498)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

___

### count

▸ **count**(): `Promise`<`number`\>

Return the total number of documents in database

#### Returns

`Promise`<`number`\>

the result of the count operation

#### Defined in

[packages/medusa/src/services/customer.ts:158](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/customer.ts#L158)

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

[packages/medusa/src/services/customer.ts:285](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/customer.ts#L285)

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

[packages/medusa/src/services/customer.ts:546](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/customer.ts#L546)

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

[packages/medusa/src/services/customer.ts:64](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/customer.ts#L64)

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

[packages/medusa/src/services/customer.ts:272](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/customer.ts#L272)

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

[packages/medusa/src/services/customer.ts:107](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/customer.ts#L107)

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

[packages/medusa/src/services/customer.ts:131](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/customer.ts#L131)

___

### listByEmail

▸ **listByEmail**(`email`, `config?`): `Promise`<`Customer`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `email` | `string` |
| `config` | `FindConfig`<`Customer`\> |

#### Returns

`Promise`<`Customer`[]\>

#### Defined in

[packages/medusa/src/services/customer.ts:228](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/customer.ts#L228)

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

[packages/medusa/src/services/customer.ts:481](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/customer.ts#L481)

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

[packages/medusa/src/services/customer.ts:253](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/customer.ts#L253)

___

### retrieveByEmail

▸ **retrieveByEmail**(`email`, `config?`): `Promise`<`Customer`\>

Gets a registered customer by email.

**`Deprecated`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` | the email of the customer to get. |
| `config` | `FindConfig`<`Customer`\> | the config object containing query settings |

#### Returns

`Promise`<`Customer`\>

the customer document.

#### Defined in

[packages/medusa/src/services/customer.ts:195](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/customer.ts#L195)

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

[packages/medusa/src/services/customer.ts:240](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/customer.ts#L240)

___

### retrieveRegisteredByEmail

▸ **retrieveRegisteredByEmail**(`email`, `config?`): `Promise`<`Customer`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `email` | `string` |
| `config` | `FindConfig`<`Customer`\> |

#### Returns

`Promise`<`Customer`\>

#### Defined in

[packages/medusa/src/services/customer.ts:218](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/customer.ts#L218)

___

### retrieveUnregisteredByEmail

▸ **retrieveUnregisteredByEmail**(`email`, `config?`): `Promise`<`Customer`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `email` | `string` |
| `config` | `FindConfig`<`Customer`\> |

#### Returns

`Promise`<`Customer`\>

#### Defined in

[packages/medusa/src/services/customer.ts:209](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/customer.ts#L209)

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

[packages/medusa/src/services/customer.ts:164](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/customer.ts#L164)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:31](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L31)

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

[packages/medusa/src/services/customer.ts:341](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/customer.ts#L341)

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

[packages/medusa/src/services/customer.ts:453](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/customer.ts#L453)

___

### updateBillingAddress\_

▸ **updateBillingAddress_**(`customer`, `addressOrId`): `Promise`<`void`\>

Updates the customers' billing address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customer` | `Customer` | the Customer to update |
| `addressOrId` | `undefined` \| `string` \| { `address_1?`: ``null`` \| `string` ; `address_2?`: ``null`` \| `string` ; `city?`: ``null`` \| `string` ; `company?`: ``null`` \| `string` ; `country?`: ``null`` \| { id?: number \| undefined; iso\_2?: string \| undefined; iso\_3?: string \| undefined; num\_code?: number \| undefined; name?: string \| undefined; display\_name?: string \| undefined; region\_id?: string \| ... 1 more ... \| undefined; region?: { ...; } \| undefined; } ; `country_code?`: ``null`` \| `string` ; `created_at?`: { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } ; `customer?`: ``null`` \| { email?: string \| undefined; first\_name?: string \| undefined; last\_name?: string \| undefined; billing\_address\_id?: string \| null \| undefined; billing\_address?: { customer\_id?: string \| null \| undefined; ... 16 more ...; updated\_at?: { ...; } \| undefined; } \| undefined; ... 10 more ...; updated\_at?: { ...; } \| undef... ; `customer_id?`: ``null`` \| `string` ; `deleted_at?`: ``null`` \| { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } ; `first_name?`: ``null`` \| `string` ; `id?`: `string` ; `last_name?`: ``null`` \| `string` ; `metadata?`: { [x: string]: unknown; } ; `phone?`: ``null`` \| `string` ; `postal_code?`: ``null`` \| `string` ; `province?`: ``null`` \| `string` ; `updated_at?`: { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; }  } | the value to set the billing address to |

#### Returns

`Promise`<`void`\>

the result of the update operation

#### Defined in

[packages/medusa/src/services/customer.ts:401](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/customer.ts#L401)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)
