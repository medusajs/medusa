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

[medusa/src/services/shipping-profile.ts:45](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/shipping-profile.ts#L45)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### customShippingOptionService\_

• `Protected` `Readonly` **customShippingOptionService\_**: [`CustomShippingOptionService`](CustomShippingOptionService.md)

#### Defined in

[medusa/src/services/shipping-profile.ts:40](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/shipping-profile.ts#L40)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### productRepository\_

• `Protected` `Readonly` **productRepository\_**: `Repository`<`Product`\> & { `bulkAddToCollection`: (`productIds`: `string`[], `collectionId`: `string`) => `Promise`<`Product`[]\> ; `bulkRemoveFromCollection`: (`productIds`: `string`[], `collectionId`: `string`) => `Promise`<`Product`[]\> ; `findAndCount`: (`options`: `ExtendedFindConfig`<`Product` & `ProductFilterOptions`\>, `q?`: `string`) => `Promise`<[`Product`[], `number`]\> ; `findOne`: (`options`: `ExtendedFindConfig`<`Product` & `ProductFilterOptions`\>) => `Promise`<``null`` \| `Product`\> ; `isProductInSalesChannels`: (`id`: `string`, `salesChannelIds`: `string`[]) => `Promise`<`boolean`\> ; `prepareQueryBuilder_`: (`options`: `ExtendedFindConfig`<`Product` & `ProductFilterOptions`\>, `q?`: `string`) => `Promise`<`SelectQueryBuilder`<`Product`\>\> ; `upsertShippingProfile`: (`productIds`: `string`[], `shippingProfileId`: `string`) => `Promise`<`Product`[]\>  }

#### Defined in

[medusa/src/services/shipping-profile.ts:43](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/shipping-profile.ts#L43)

___

### productService\_

• `Protected` `Readonly` **productService\_**: [`ProductService`](ProductService.md)

#### Defined in

[medusa/src/services/shipping-profile.ts:38](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/shipping-profile.ts#L38)

___

### shippingOptionService\_

• `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](ShippingOptionService.md)

#### Defined in

[medusa/src/services/shipping-profile.ts:39](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/shipping-profile.ts#L39)

___

### shippingProfileRepository\_

• `Protected` `Readonly` **shippingProfileRepository\_**: `Repository`<`ShippingProfile`\>

#### Defined in

[medusa/src/services/shipping-profile.ts:42](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/shipping-profile.ts#L42)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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

[medusa/src/services/shipping-profile.ts:355](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/shipping-profile.ts#L355)

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

[medusa/src/services/shipping-profile.ts:385](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/shipping-profile.ts#L385)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

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

[medusa/src/services/shipping-profile.ts:249](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/shipping-profile.ts#L249)

___

### createDefault

▸ **createDefault**(): `Promise`<`ShippingProfile`\>

Creates a default shipping profile, if this does not already exist.

#### Returns

`Promise`<`ShippingProfile`\>

the shipping profile

#### Defined in

[medusa/src/services/shipping-profile.ts:179](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/shipping-profile.ts#L179)

___

### createGiftCardDefault

▸ **createGiftCardDefault**(): `Promise`<`ShippingProfile`\>

Creates a default shipping profile, for gift cards if unless it already
exists.

#### Returns

`Promise`<`ShippingProfile`\>

the shipping profile

#### Defined in

[medusa/src/services/shipping-profile.ts:223](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/shipping-profile.ts#L223)

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

[medusa/src/services/shipping-profile.ts:330](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/shipping-profile.ts#L330)

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

[medusa/src/services/shipping-profile.ts:415](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/shipping-profile.ts#L415)

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

[medusa/src/services/shipping-profile.ts:82](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/shipping-profile.ts#L82)

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

[medusa/src/services/shipping-profile.ts:481](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/shipping-profile.ts#L481)

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

[medusa/src/services/shipping-profile.ts:67](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/shipping-profile.ts#L67)

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

[medusa/src/services/shipping-profile.ts:134](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/shipping-profile.ts#L134)

___

### retrieveDefault

▸ **retrieveDefault**(): `Promise`<``null`` \| `ShippingProfile`\>

#### Returns

`Promise`<``null`` \| `ShippingProfile`\>

#### Defined in

[medusa/src/services/shipping-profile.ts:163](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/shipping-profile.ts#L163)

___

### retrieveGiftCardDefault

▸ **retrieveGiftCardDefault**(): `Promise`<``null`` \| `ShippingProfile`\>

Retrieves the default gift card profile

#### Returns

`Promise`<``null`` \| `ShippingProfile`\>

the shipping profile for gift cards

#### Defined in

[medusa/src/services/shipping-profile.ts:206](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/shipping-profile.ts#L206)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

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

[medusa/src/services/shipping-profile.ts:284](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/shipping-profile.ts#L284)

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

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
