# Class: ShippingProfileService

Provides layer to manipulate profiles.

**`Implements`**

## Hierarchy

- `TransactionBaseService`

  ↳ **`ShippingProfileService`**

## Constructors

### constructor

• **new ShippingProfileService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:48](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/shipping-profile.ts#L48)

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

### customShippingOptionService\_

• `Protected` `Readonly` **customShippingOptionService\_**: [`CustomShippingOptionService`](CustomShippingOptionService.md)

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:40](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/shipping-profile.ts#L40)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:45](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/shipping-profile.ts#L45)

___

### productRepository\_

• `Protected` `Readonly` **productRepository\_**: typeof `ProductRepository`

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:43](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/shipping-profile.ts#L43)

___

### productService\_

• `Protected` `Readonly` **productService\_**: [`ProductService`](ProductService.md)

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:38](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/shipping-profile.ts#L38)

___

### shippingOptionService\_

• `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](ShippingOptionService.md)

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:39](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/shipping-profile.ts#L39)

___

### shippingProfileRepository\_

• `Protected` `Readonly` **shippingProfileRepository\_**: typeof `ShippingProfileRepository`

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:42](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/shipping-profile.ts#L42)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:46](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/shipping-profile.ts#L46)

## Methods

### addProduct

▸ **addProduct**(`profileId`, `productId`): `Promise`<`ShippingProfile`\>

Adds a product of an array of products to the profile.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profileId` | `string` | the profile to add the products to. |
| `productId` | `string` \| `string`[] | the ID of the product or multiple products to add. |

#### Returns

`Promise`<`ShippingProfile`\>

the result of update

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:356](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/shipping-profile.ts#L356)

___

### addShippingOption

▸ **addShippingOption**(`profileId`, `optionId`): `Promise`<`ShippingProfile`\>

Adds a shipping option to the profile. The shipping option can be used to
fulfill the products in the products field.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profileId` | `string` | the profile to apply the shipping option to |
| `optionId` | `string` \| `string`[] | the ID of the option or multiple options to add to the profile |

#### Returns

`Promise`<`ShippingProfile`\>

the result of the model update operation

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:386](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/shipping-profile.ts#L386)

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

### create

▸ **create**(`profile`): `Promise`<`ShippingProfile`\>

Creates a new shipping profile.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profile` | `CreateShippingProfile` | the shipping profile to create from |

#### Returns

`Promise`<`ShippingProfile`\>

the result of the create operation

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:250](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/shipping-profile.ts#L250)

___

### createDefault

▸ **createDefault**(): `Promise`<`ShippingProfile`\>

Creates a default shipping profile, if this does not already exist.

#### Returns

`Promise`<`ShippingProfile`\>

the shipping profile

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:180](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/shipping-profile.ts#L180)

___

### createGiftCardDefault

▸ **createGiftCardDefault**(): `Promise`<`ShippingProfile`\>

Creates a default shipping profile, for gift cards if unless it already
exists.

#### Returns

`Promise`<`ShippingProfile`\>

the shipping profile

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:224](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/shipping-profile.ts#L224)

___

### delete

▸ **delete**(`profileId`): `Promise`<`void`\>

Deletes a profile with a given profile id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profileId` | `string` | the id of the profile to delete. Must be   castable as an ObjectId |

#### Returns

`Promise`<`void`\>

the result of the delete operation.

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:331](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/shipping-profile.ts#L331)

___

### fetchCartOptions

▸ **fetchCartOptions**(`cart`): `Promise`<`ShippingOption`[]\>

Finds all the shipping profiles that cover the products in a cart, and
validates all options that are available for the cart.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | `any` | the cart object to find shipping options for |

#### Returns

`Promise`<`ShippingOption`[]\>

a list of the available shipping options

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:416](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/shipping-profile.ts#L416)

___

### fetchOptionsByProductIds

▸ **fetchOptionsByProductIds**(`productIds`, `filter`): `Promise`<`ShippingOption`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `productIds` | `string`[] |
| `filter` | `Selector`<`ShippingOption`\> |

#### Returns

`Promise`<`ShippingOption`[]\>

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:83](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/shipping-profile.ts#L83)

___

### getProfilesInCart

▸ `Protected` **getProfilesInCart**(`cart`): `string`[]

Returns a list of all the productIds in the cart.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | `Cart` | the cart to extract products from |

#### Returns

`string`[]

a list of product ids

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:482](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/shipping-profile.ts#L482)

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<`ShippingProfile`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`ShippingProfile`\> | the query object for find |
| `config` | `FindConfig`<`ShippingProfile`\> | the config object for find |

#### Returns

`Promise`<`ShippingProfile`[]\>

the result of the find operation

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:71](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/shipping-profile.ts#L71)

___

### retrieve

▸ **retrieve**(`profileId`, `options?`): `Promise`<`ShippingProfile`\>

Gets a profile by id.
Throws in case of DB Error and if profile was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profileId` | `string` | the id of the profile to get. |
| `options` | `FindConfig`<`ShippingProfile`\> | options opf the query. |

#### Returns

`Promise`<`ShippingProfile`\>

the profile document.

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:135](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/shipping-profile.ts#L135)

___

### retrieveDefault

▸ **retrieveDefault**(): `Promise`<`undefined` \| `ShippingProfile`\>

#### Returns

`Promise`<`undefined` \| `ShippingProfile`\>

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:164](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/shipping-profile.ts#L164)

___

### retrieveGiftCardDefault

▸ **retrieveGiftCardDefault**(): `Promise`<`undefined` \| `ShippingProfile`\>

Retrieves the default gift card profile

#### Returns

`Promise`<`undefined` \| `ShippingProfile`\>

the shipping profile for gift cards

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:207](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/shipping-profile.ts#L207)

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

▸ **update**(`profileId`, `update`): `Promise`<`ShippingProfile`\>

Updates a profile. Metadata updates and product updates should use
dedicated methods, e.g. `setMetadata`, `addProduct`, etc. The function
will throw errors if metadata or product updates are attempted.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profileId` | `string` | the id of the profile. Must be a string that   can be casted to an ObjectId |
| `update` | `UpdateShippingProfile` | an object with the update values. |

#### Returns

`Promise`<`ShippingProfile`\>

resolves to the update result.

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:285](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/shipping-profile.ts#L285)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`ShippingProfileService`](ShippingProfileService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ShippingProfileService`](ShippingProfileService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)
