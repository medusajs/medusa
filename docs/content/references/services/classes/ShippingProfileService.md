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

[packages/medusa/src/services/shipping-profile.ts:47](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/shipping-profile.ts#L47)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### customShippingOptionService\_

• `Protected` `Readonly` **customShippingOptionService\_**: [`CustomShippingOptionService`](CustomShippingOptionService.md)

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:39](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/shipping-profile.ts#L39)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:44](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/shipping-profile.ts#L44)

___

### productRepository\_

• `Protected` `Readonly` **productRepository\_**: typeof `ProductRepository`

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:42](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/shipping-profile.ts#L42)

___

### productService\_

• `Protected` `Readonly` **productService\_**: [`ProductService`](ProductService.md)

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:37](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/shipping-profile.ts#L37)

___

### shippingOptionService\_

• `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](ShippingOptionService.md)

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:38](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/shipping-profile.ts#L38)

___

### shippingProfileRepository\_

• `Protected` `Readonly` **shippingProfileRepository\_**: typeof `ShippingProfileRepository`

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:41](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/shipping-profile.ts#L41)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:45](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/shipping-profile.ts#L45)

## Methods

### addProduct

▸ **addProduct**(`profileId`, `productId`): `Promise`<`ShippingProfile`\>

Adds a product to a profile. The method is idempotent, so multiple calls
with the same product variant will have the same result.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profileId` | `string` | the profile to add the product to. |
| `productId` | `string` | the product to add. |

#### Returns

`Promise`<`ShippingProfile`\>

the result of update

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:353](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/shipping-profile.ts#L353)

___

### addShippingOption

▸ **addShippingOption**(`profileId`, `optionId`): `Promise`<`ShippingProfile`\>

Adds a shipping option to the profile. The shipping option can be used to
fulfill the products in the products field.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profileId` | `string` | the profile to apply the shipping option to |
| `optionId` | `string` | the option to add to the profile |

#### Returns

`Promise`<`ShippingProfile`\>

the result of the model update operation

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:373](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/shipping-profile.ts#L373)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

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

[packages/medusa/src/services/shipping-profile.ts:242](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/shipping-profile.ts#L242)

___

### createDefault

▸ **createDefault**(): `Promise`<`ShippingProfile`\>

Creates a default shipping profile, if this does not already exist.

#### Returns

`Promise`<`ShippingProfile`\>

the shipping profile

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:172](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/shipping-profile.ts#L172)

___

### createGiftCardDefault

▸ **createGiftCardDefault**(): `Promise`<`ShippingProfile`\>

Creates a default shipping profile, for gift cards if unless it already
exists.

#### Returns

`Promise`<`ShippingProfile`\>

the shipping profile

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:216](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/shipping-profile.ts#L216)

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

[packages/medusa/src/services/shipping-profile.ts:327](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/shipping-profile.ts#L327)

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

[packages/medusa/src/services/shipping-profile.ts:393](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/shipping-profile.ts#L393)

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

[packages/medusa/src/services/shipping-profile.ts:82](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/shipping-profile.ts#L82)

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

[packages/medusa/src/services/shipping-profile.ts:463](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/shipping-profile.ts#L463)

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

[packages/medusa/src/services/shipping-profile.ts:70](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/shipping-profile.ts#L70)

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

[packages/medusa/src/services/shipping-profile.ts:134](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/shipping-profile.ts#L134)

___

### retrieveDefault

▸ **retrieveDefault**(): `Promise`<`undefined` \| `ShippingProfile`\>

#### Returns

`Promise`<`undefined` \| `ShippingProfile`\>

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:156](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/shipping-profile.ts#L156)

___

### retrieveGiftCardDefault

▸ **retrieveGiftCardDefault**(): `Promise`<`undefined` \| `ShippingProfile`\>

Retrieves the default gift card profile

#### Returns

`Promise`<`undefined` \| `ShippingProfile`\>

the shipping profile for gift cards

#### Defined in

[packages/medusa/src/services/shipping-profile.ts:199](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/shipping-profile.ts#L199)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:31](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/interfaces/transaction-base-service.ts#L31)

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

[packages/medusa/src/services/shipping-profile.ts:270](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/shipping-profile.ts#L270)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/interfaces/transaction-base-service.ts#L13)
