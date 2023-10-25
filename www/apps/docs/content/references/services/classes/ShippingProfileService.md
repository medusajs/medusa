# ShippingProfileService

Provides layer to manipulate profiles.

**Implements**

## Hierarchy

- `TransactionBaseService`

  ↳ **`ShippingProfileService`**

## Constructors

### constructor

**new ShippingProfileService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/shipping-profile.ts:49](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/shipping-profile.ts#L49)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### customShippingOptionService\_

 `Protected` `Readonly` **customShippingOptionService\_**: [`CustomShippingOptionService`](CustomShippingOptionService.md)

#### Defined in

[medusa/src/services/shipping-profile.ts:43](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/shipping-profile.ts#L43)

___

### featureFlagRouter\_

 `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[medusa/src/services/shipping-profile.ts:47](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/shipping-profile.ts#L47)

___

### manager\_

 `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### productRepository\_

 `Protected` `Readonly` **productRepository\_**: `Repository`<`Product`\> & { `_applyCategoriesQuery`: Method \_applyCategoriesQuery ; `_findWithRelations`: Method \_findWithRelations ; `bulkAddToCollection`: Method bulkAddToCollection ; `bulkRemoveFromCollection`: Method bulkRemoveFromCollection ; `findOneWithRelations`: Method findOneWithRelations ; `findWithRelations`: Method findWithRelations ; `findWithRelationsAndCount`: Method findWithRelationsAndCount ; `getCategoryIdsFromInput`: Method getCategoryIdsFromInput ; `getCategoryIdsRecursively`: Method getCategoryIdsRecursively ; `getFreeTextSearchResultsAndCount`: Method getFreeTextSearchResultsAndCount ; `isProductInSalesChannels`: Method isProductInSalesChannels ; `queryProducts`: Method queryProducts ; `queryProductsWithIds`: Method queryProductsWithIds  }

#### Defined in

[medusa/src/services/shipping-profile.ts:46](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/shipping-profile.ts#L46)

___

### productService\_

 `Protected` `Readonly` **productService\_**: [`ProductService`](ProductService.md)

#### Defined in

[medusa/src/services/shipping-profile.ts:41](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/shipping-profile.ts#L41)

___

### shippingOptionService\_

 `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](ShippingOptionService.md)

#### Defined in

[medusa/src/services/shipping-profile.ts:42](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/shipping-profile.ts#L42)

___

### shippingProfileRepository\_

 `Protected` `Readonly` **shippingProfileRepository\_**: `Repository`<`ShippingProfile`\> & { `findByProducts`: Method findByProducts  }

#### Defined in

[medusa/src/services/shipping-profile.ts:45](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/shipping-profile.ts#L45)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

### addProduct

**addProduct**(`profileId`, `productId`): `Promise`<`ShippingProfile`\>

#### Parameters

| Name |
| :------ |
| `profileId` | `string` |
| `productId` | `string` \| `string`[] |

#### Returns

`Promise`<`ShippingProfile`\>

-`Promise`: 
	-`ShippingProfile`: 

**Deprecated**

use [addProducts](ShippingProfileService.md#addproducts) instead

#### Defined in

[medusa/src/services/shipping-profile.ts:371](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/shipping-profile.ts#L371)

___

### addProducts

**addProducts**(`profileId`, `productId`): `Promise`<`ShippingProfile`\>

Adds a product or an array of products to the profile.

#### Parameters

| Name | Description |
| :------ | :------ |
| `profileId` | `string` | the profile to add the products to. |
| `productId` | `string` \| `string`[] | the ID of the product or multiple products to add. |

#### Returns

`Promise`<`ShippingProfile`\>

-`Promise`: the result of update
	-`ShippingProfile`: 

#### Defined in

[medusa/src/services/shipping-profile.ts:384](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/shipping-profile.ts#L384)

___

### addShippingOption

**addShippingOption**(`profileId`, `optionId`): `Promise`<`ShippingProfile`\>

Adds a shipping option to the profile. The shipping option can be used to
fulfill the products in the products field.

#### Parameters

| Name | Description |
| :------ | :------ |
| `profileId` | `string` | the profile to apply the shipping option to |
| `optionId` | `string` \| `string`[] | the ID of the option or multiple options to add to the profile |

#### Returns

`Promise`<`ShippingProfile`\>

-`Promise`: the result of the model update operation
	-`ShippingProfile`: 

#### Defined in

[medusa/src/services/shipping-profile.ts:427](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/shipping-profile.ts#L427)

___

### atomicPhase\_

`Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

Wraps some work within a transactional block. If the service already has
a transaction manager attached this will be reused, otherwise a new
transaction manager is created.

| Name |
| :------ |
| `TResult` | `object` |
| `TError` | `object` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### create

**create**(`profile`): `Promise`<`ShippingProfile`\>

Creates a new shipping profile.

#### Parameters

| Name | Description |
| :------ | :------ |
| `profile` | `CreateShippingProfile` | the shipping profile to create from |

#### Returns

`Promise`<`ShippingProfile`\>

-`Promise`: the result of the create operation
	-`ShippingProfile`: 

#### Defined in

[medusa/src/services/shipping-profile.ts:275](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/shipping-profile.ts#L275)

___

### createDefault

**createDefault**(): `Promise`<`ShippingProfile`\>

Creates a default shipping profile, if this does not already exist.

#### Returns

`Promise`<`ShippingProfile`\>

-`Promise`: the shipping profile
	-`ShippingProfile`: 

#### Defined in

[medusa/src/services/shipping-profile.ts:205](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/shipping-profile.ts#L205)

___

### createGiftCardDefault

**createGiftCardDefault**(): `Promise`<`ShippingProfile`\>

Creates a default shipping profile, for gift cards if unless it already
exists.

#### Returns

`Promise`<`ShippingProfile`\>

-`Promise`: the shipping profile
	-`ShippingProfile`: 

#### Defined in

[medusa/src/services/shipping-profile.ts:249](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/shipping-profile.ts#L249)

___

### delete

**delete**(`profileId`): `Promise`<`void`\>

Deletes a profile with a given profile id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `profileId` | `string` | the id of the profile to delete. Must be castable as an ObjectId |

#### Returns

`Promise`<`void`\>

-`Promise`: the result of the delete operation.

#### Defined in

[medusa/src/services/shipping-profile.ts:349](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/shipping-profile.ts#L349)

___

### fetchCartOptions

**fetchCartOptions**(`cart`): `Promise`<`ShippingOption`[]\>

Finds all the shipping profiles that cover the products in a cart, and
validates all options that are available for the cart.

#### Parameters

| Name | Description |
| :------ | :------ |
| `cart` | `any` | the cart object to find shipping options for |

#### Returns

`Promise`<`ShippingOption`[]\>

-`Promise`: a list of the available shipping options
	-`ShippingOption[]`: 
		-`ShippingOption`: 

#### Defined in

[medusa/src/services/shipping-profile.ts:452](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/shipping-profile.ts#L452)

___

### getMapProfileIdsByProductIds

**getMapProfileIdsByProductIds**(`productIds`): `Promise`<`Map`<`string`, `string`\>\>

#### Parameters

| Name |
| :------ |
| `productIds` | `string`[] |

#### Returns

`Promise`<`Map`<`string`, `string`\>\>

-`Promise`: 
	-`Map`: 
		-`string`: (optional) 
		-`string`: (optional) 

#### Defined in

[medusa/src/services/shipping-profile.ts:88](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/shipping-profile.ts#L88)

___

### getProfilesInCart

`Protected` **getProfilesInCart**(`cart`): `Promise`<`string`[]\>

Returns a list of all the productIds in the cart.

#### Parameters

| Name | Description |
| :------ | :------ |
| `cart` | `Cart` | the cart to extract products from |

#### Returns

`Promise`<`string`[]\>

-`Promise`: a list of product ids
	-`string[]`: 
		-`string`: (optional) 

#### Defined in

[medusa/src/services/shipping-profile.ts:518](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/shipping-profile.ts#L518)

___

### list

**list**(`selector?`, `config?`): `Promise`<`ShippingProfile`[]\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | `Selector`<`ShippingProfile`\> | the query object for find |
| `config` | `FindConfig`<`ShippingProfile`\> | the config object for find |

#### Returns

`Promise`<`ShippingProfile`[]\>

-`Promise`: the result of the find operation
	-`ShippingProfile[]`: 
		-`ShippingProfile`: 

#### Defined in

[medusa/src/services/shipping-profile.ts:73](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/shipping-profile.ts#L73)

___

### removeProducts

**removeProducts**(`profileId`, `productId`): `Promise`<`void` \| `ShippingProfile`\>

Removes a product or an array of products from the profile.

#### Parameters

| Name | Description |
| :------ | :------ |
| `profileId` | ``null`` \| `string` | the profile to add the products to. |
| `productId` | `string` \| `string`[] | the ID of the product or multiple products to add. |

#### Returns

`Promise`<`void` \| `ShippingProfile`\>

-`Promise`: the result of update
	-`void \| ShippingProfile`: (optional) 

#### Defined in

[medusa/src/services/shipping-profile.ts:406](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/shipping-profile.ts#L406)

___

### retrieve

**retrieve**(`profileId`, `options?`): `Promise`<`ShippingProfile`\>

Gets a profile by id.
Throws in case of DB Error and if profile was not found.

#### Parameters

| Name | Description |
| :------ | :------ |
| `profileId` | `string` | the id of the profile to get. |
| `options` | `FindConfig`<`ShippingProfile`\> | options opf the query. |

#### Returns

`Promise`<`ShippingProfile`\>

-`Promise`: the profile document.
	-`ShippingProfile`: 

#### Defined in

[medusa/src/services/shipping-profile.ts:130](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/shipping-profile.ts#L130)

___

### retrieveDefault

**retrieveDefault**(): `Promise`<``null`` \| `ShippingProfile`\>

#### Returns

`Promise`<``null`` \| `ShippingProfile`\>

-`Promise`: 
	-```null`` \| ShippingProfile`: (optional) 

#### Defined in

[medusa/src/services/shipping-profile.ts:189](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/shipping-profile.ts#L189)

___

### retrieveForProducts

**retrieveForProducts**(`productIds`): `Promise`<{ `[product_id: string]`: `ShippingProfile`[];  }\>

#### Parameters

| Name |
| :------ |
| `productIds` | `string` \| `string`[] |

#### Returns

`Promise`<{ `[product_id: string]`: `ShippingProfile`[];  }\>

-`Promise`: 
	-``object``: (optional) 

#### Defined in

[medusa/src/services/shipping-profile.ts:159](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/shipping-profile.ts#L159)

___

### retrieveGiftCardDefault

**retrieveGiftCardDefault**(): `Promise`<``null`` \| `ShippingProfile`\>

Retrieves the default gift card profile

#### Returns

`Promise`<``null`` \| `ShippingProfile`\>

-`Promise`: the shipping profile for gift cards
	-```null`` \| ShippingProfile`: (optional) 

#### Defined in

[medusa/src/services/shipping-profile.ts:232](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/shipping-profile.ts#L232)

___

### shouldRetryTransaction\_

`Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name |
| :------ |
| `err` | Record<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

TransactionBaseService.shouldRetryTransaction\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

**update**(`profileId`, `update`): `Promise`<`ShippingProfile`\>

Updates a profile. Metadata updates and product updates should use
dedicated methods, e.g. `setMetadata`, `addProduct`, etc. The function
will throw errors if metadata or product updates are attempted.

#### Parameters

| Name | Description |
| :------ | :------ |
| `profileId` | `string` | the id of the profile. Must be a string that can be casted to an ObjectId |
| `update` | `UpdateShippingProfile` | an object with the update values. |

#### Returns

`Promise`<`ShippingProfile`\>

-`Promise`: resolves to the update result.
	-`ShippingProfile`: 

#### Defined in

[medusa/src/services/shipping-profile.ts:310](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/shipping-profile.ts#L310)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`ShippingProfileService`](ShippingProfileService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ShippingProfileService`](ShippingProfileService.md)

-`ShippingProfileService`: 

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
