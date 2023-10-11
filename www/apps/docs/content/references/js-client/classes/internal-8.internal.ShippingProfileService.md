---
displayed_sidebar: jsClientSidebar
---

# Class: ShippingProfileService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).ShippingProfileService

Provides layer to manipulate profiles.

**`Implements`**

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`ShippingProfileService`**

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__configModule__](internal-8.internal.TransactionBaseService.md#__configmodule__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:5

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__container__](internal-8.internal.TransactionBaseService.md#__container__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:4

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__moduleDeclaration__](internal-8.internal.TransactionBaseService.md#__moduledeclaration__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:6

___

### customShippingOptionService\_

• `Protected` `Readonly` **customShippingOptionService\_**: [`CustomShippingOptionService`](internal-8.internal.CustomShippingOptionService.md)

#### Defined in

packages/medusa/dist/services/shipping-profile.d.ts:29

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: [`FlagRouter`](internal-8.FlagRouter.md)

#### Defined in

packages/medusa/dist/services/shipping-profile.d.ts:32

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### productRepository\_

• `Protected` `Readonly` **productRepository\_**: `Repository`<[`Product`](internal-3.Product.md)\> & { `_applyCategoriesQuery`: (`qb`: `SelectQueryBuilder`<[`Product`](internal-3.Product.md)\>, `__namedParameters`: { `alias`: `any` ; `categoryAlias`: `any` ; `joinName`: `any` ; `where`: `any`  }) => `SelectQueryBuilder`<[`Product`](internal-3.Product.md)\> ; `_findWithRelations`: (`__namedParameters`: { `idsOrOptionsWithoutRelations`: `string`[] \| [`FindWithoutRelationsOptions`](../modules/internal-8.md#findwithoutrelationsoptions-1) ; `relations`: `string`[] ; `shouldCount`: `boolean` ; `withDeleted`: `boolean`  }) => `Promise`<[[`Product`](internal-3.Product.md)[], `number`]\> ; `bulkAddToCollection`: (`productIds`: `string`[], `collectionId`: `string`) => `Promise`<[`Product`](internal-3.Product.md)[]\> ; `bulkRemoveFromCollection`: (`productIds`: `string`[], `collectionId`: `string`) => `Promise`<[`Product`](internal-3.Product.md)[]\> ; `findOneWithRelations`: (`relations?`: `string`[], `optionsWithoutRelations?`: [`FindWithoutRelationsOptions`](../modules/internal-8.md#findwithoutrelationsoptions-1)) => `Promise`<[`Product`](internal-3.Product.md)\> ; `findWithRelations`: (`relations?`: `string`[], `idsOrOptionsWithoutRelations?`: `string`[] \| [`FindWithoutRelationsOptions`](../modules/internal-8.md#findwithoutrelationsoptions-1), `withDeleted?`: `boolean`) => `Promise`<[`Product`](internal-3.Product.md)[]\> ; `findWithRelationsAndCount`: (`relations?`: `string`[], `idsOrOptionsWithoutRelations?`: [`FindWithoutRelationsOptions`](../modules/internal-8.md#findwithoutrelationsoptions-1)) => `Promise`<[[`Product`](internal-3.Product.md)[], `number`]\> ; `getCategoryIdsFromInput`: (`categoryId?`: [`CategoryQueryParams`](../modules/internal-8.md#categoryqueryparams), `includeCategoryChildren?`: `boolean`) => `Promise`<`string`[]\> ; `getCategoryIdsRecursively`: (`productCategory`: [`ProductCategory`](internal-3.ProductCategory.md)) => `string`[] ; `getFreeTextSearchResultsAndCount`: (`q`: `string`, `options?`: [`FindWithoutRelationsOptions`](../modules/internal-8.md#findwithoutrelationsoptions-1), `relations?`: `string`[]) => `Promise`<[[`Product`](internal-3.Product.md)[], `number`]\> ; `isProductInSalesChannels`: (`id`: `string`, `salesChannelIds`: `string`[]) => `Promise`<`boolean`\> ; `queryProducts`: (`optionsWithoutRelations`: [`FindWithoutRelationsOptions`](../modules/internal-8.md#findwithoutrelationsoptions-1), `shouldCount?`: `boolean`) => `Promise`<[[`Product`](internal-3.Product.md)[], `number`]\> ; `queryProductsWithIds`: (`__namedParameters`: { `entityIds`: `string`[] ; `groupedRelations`: { `[toplevel: string]`: `string`[];  } ; `order?`: { `[column: string]`: ``"ASC"`` \| ``"DESC"``;  } ; `select?`: keyof [`Product`](internal-3.Product.md)[] ; `where?`: `FindOptionsWhere`<[`Product`](internal-3.Product.md)\> ; `withDeleted?`: `boolean`  }) => `Promise`<[`Product`](internal-3.Product.md)[]\>  }

#### Defined in

packages/medusa/dist/services/shipping-profile.d.ts:31

___

### productService\_

• `Protected` `Readonly` **productService\_**: [`ProductService`](internal-8.internal.ProductService.md)

#### Defined in

packages/medusa/dist/services/shipping-profile.d.ts:27

___

### shippingOptionService\_

• `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](internal-8.internal.ShippingOptionService.md)

#### Defined in

packages/medusa/dist/services/shipping-profile.d.ts:28

___

### shippingProfileRepository\_

• `Protected` `Readonly` **shippingProfileRepository\_**: `Repository`<[`ShippingProfile`](internal-3.ShippingProfile.md)\> & { `findByProducts`: (`productIds`: `string` \| `string`[]) => `Promise`<{ `[product_id: string]`: [`ShippingProfile`](internal-3.ShippingProfile.md)[];  }\>  }

#### Defined in

packages/medusa/dist/services/shipping-profile.d.ts:30

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:9

## Methods

### addProduct

▸ **addProduct**(`profileId`, `productId`): `Promise`<[`ShippingProfile`](internal-3.ShippingProfile.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `profileId` | `string` |
| `productId` | `string` \| `string`[] |

#### Returns

`Promise`<[`ShippingProfile`](internal-3.ShippingProfile.md)\>

**`Deprecated`**

use [addProducts](internal-8.internal.ShippingProfileService.md#addproducts) instead

#### Defined in

packages/medusa/dist/services/shipping-profile.d.ts:95

___

### addProducts

▸ **addProducts**(`profileId`, `productId`): `Promise`<[`ShippingProfile`](internal-3.ShippingProfile.md)\>

Adds a product or an array of products to the profile.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profileId` | `string` | the profile to add the products to. |
| `productId` | `string` \| `string`[] | the ID of the product or multiple products to add. |

#### Returns

`Promise`<[`ShippingProfile`](internal-3.ShippingProfile.md)\>

the result of update

#### Defined in

packages/medusa/dist/services/shipping-profile.d.ts:102

___

### addShippingOption

▸ **addShippingOption**(`profileId`, `optionId`): `Promise`<[`ShippingProfile`](internal-3.ShippingProfile.md)\>

Adds a shipping option to the profile. The shipping option can be used to
fulfill the products in the products field.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profileId` | `string` | the profile to apply the shipping option to |
| `optionId` | `string` \| `string`[] | the ID of the option or multiple options to add to the profile |

#### Returns

`Promise`<[`ShippingProfile`](internal-3.ShippingProfile.md)\>

the result of the model update operation

#### Defined in

packages/medusa/dist/services/shipping-profile.d.ts:117

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

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[atomicPhase_](internal-8.internal.TransactionBaseService.md#atomicphase_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:24

___

### create

▸ **create**(`profile`): `Promise`<[`ShippingProfile`](internal-3.ShippingProfile.md)\>

Creates a new shipping profile.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profile` | [`CreateShippingProfile`](../modules/internal-8.md#createshippingprofile) | the shipping profile to create from |

#### Returns

`Promise`<[`ShippingProfile`](internal-3.ShippingProfile.md)\>

the result of the create operation

#### Defined in

packages/medusa/dist/services/shipping-profile.d.ts:74

___

### createDefault

▸ **createDefault**(): `Promise`<[`ShippingProfile`](internal-3.ShippingProfile.md)\>

Creates a default shipping profile, if this does not already exist.

#### Returns

`Promise`<[`ShippingProfile`](internal-3.ShippingProfile.md)\>

the shipping profile

#### Defined in

packages/medusa/dist/services/shipping-profile.d.ts:57

___

### createGiftCardDefault

▸ **createGiftCardDefault**(): `Promise`<[`ShippingProfile`](internal-3.ShippingProfile.md)\>

Creates a default shipping profile, for gift cards if unless it already
exists.

#### Returns

`Promise`<[`ShippingProfile`](internal-3.ShippingProfile.md)\>

the shipping profile

#### Defined in

packages/medusa/dist/services/shipping-profile.d.ts:68

___

### delete

▸ **delete**(`profileId`): `Promise`<`void`\>

Deletes a profile with a given profile id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profileId` | `string` | the id of the profile to delete. Must be castable as an ObjectId |

#### Returns

`Promise`<`void`\>

the result of the delete operation.

#### Defined in

packages/medusa/dist/services/shipping-profile.d.ts:91

___

### fetchCartOptions

▸ **fetchCartOptions**(`cart`): `Promise`<[`ShippingOption`](internal-3.ShippingOption.md)[]\>

Finds all the shipping profiles that cover the products in a cart, and
validates all options that are available for the cart.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | `any` | the cart object to find shipping options for |

#### Returns

`Promise`<[`ShippingOption`](internal-3.ShippingOption.md)[]\>

a list of the available shipping options

#### Defined in

packages/medusa/dist/services/shipping-profile.d.ts:124

___

### getMapProfileIdsByProductIds

▸ **getMapProfileIdsByProductIds**(`productIds`): `Promise`<`Map`<`string`, `string`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `productIds` | `string`[] |

#### Returns

`Promise`<`Map`<`string`, `string`\>\>

#### Defined in

packages/medusa/dist/services/shipping-profile.d.ts:40

___

### getProfilesInCart

▸ `Protected` **getProfilesInCart**(`cart`): `Promise`<`string`[]\>

Returns a list of all the productIds in the cart.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | [`Cart`](internal-3.Cart.md) | the cart to extract products from |

#### Returns

`Promise`<`string`[]\>

a list of product ids

#### Defined in

packages/medusa/dist/services/shipping-profile.d.ts:130

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<[`ShippingProfile`](internal-3.ShippingProfile.md)[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector?` | [`Selector`](../modules/internal-8.internal.md#selector)<[`ShippingProfile`](internal-3.ShippingProfile.md)\> | the query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`ShippingProfile`](internal-3.ShippingProfile.md)\> | the config object for find |

#### Returns

`Promise`<[`ShippingProfile`](internal-3.ShippingProfile.md)[]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/shipping-profile.d.ts:39

___

### removeProducts

▸ **removeProducts**(`profileId`, `productId`): `Promise`<`void` \| [`ShippingProfile`](internal-3.ShippingProfile.md)\>

Removes a product or an array of products from the profile.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profileId` | ``null`` \| `string` | the profile to add the products to. |
| `productId` | `string` \| `string`[] | the ID of the product or multiple products to add. |

#### Returns

`Promise`<`void` \| [`ShippingProfile`](internal-3.ShippingProfile.md)\>

the result of update

#### Defined in

packages/medusa/dist/services/shipping-profile.d.ts:109

___

### retrieve

▸ **retrieve**(`profileId`, `options?`): `Promise`<[`ShippingProfile`](internal-3.ShippingProfile.md)\>

Gets a profile by id.
Throws in case of DB Error and if profile was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profileId` | `string` | the id of the profile to get. |
| `options?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`ShippingProfile`](internal-3.ShippingProfile.md)\> | options opf the query. |

#### Returns

`Promise`<[`ShippingProfile`](internal-3.ShippingProfile.md)\>

the profile document.

#### Defined in

packages/medusa/dist/services/shipping-profile.d.ts:48

___

### retrieveDefault

▸ **retrieveDefault**(): `Promise`<``null`` \| [`ShippingProfile`](internal-3.ShippingProfile.md)\>

#### Returns

`Promise`<``null`` \| [`ShippingProfile`](internal-3.ShippingProfile.md)\>

#### Defined in

packages/medusa/dist/services/shipping-profile.d.ts:52

___

### retrieveForProducts

▸ **retrieveForProducts**(`productIds`): `Promise`<{ `[product_id: string]`: [`ShippingProfile`](internal-3.ShippingProfile.md)[];  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `productIds` | `string` \| `string`[] |

#### Returns

`Promise`<{ `[product_id: string]`: [`ShippingProfile`](internal-3.ShippingProfile.md)[];  }\>

#### Defined in

packages/medusa/dist/services/shipping-profile.d.ts:49

___

### retrieveGiftCardDefault

▸ **retrieveGiftCardDefault**(): `Promise`<``null`` \| [`ShippingProfile`](internal-3.ShippingProfile.md)\>

Retrieves the default gift card profile

#### Returns

`Promise`<``null`` \| [`ShippingProfile`](internal-3.ShippingProfile.md)\>

the shipping profile for gift cards

#### Defined in

packages/medusa/dist/services/shipping-profile.d.ts:62

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[shouldRetryTransaction_](internal-8.internal.TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:12

___

### update

▸ **update**(`profileId`, `update`): `Promise`<[`ShippingProfile`](internal-3.ShippingProfile.md)\>

Updates a profile. Metadata updates and product updates should use
dedicated methods, e.g. `setMetadata`, `addProduct`, etc. The function
will throw errors if metadata or product updates are attempted.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profileId` | `string` | the id of the profile. Must be a string that can be casted to an ObjectId |
| `update` | [`UpdateShippingProfile`](../modules/internal-8.md#updateshippingprofile) | an object with the update values. |

#### Returns

`Promise`<[`ShippingProfile`](internal-3.ShippingProfile.md)\>

resolves to the update result.

#### Defined in

packages/medusa/dist/services/shipping-profile.d.ts:84

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`ShippingProfileService`](internal-8.internal.ShippingProfileService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ShippingProfileService`](internal-8.internal.ShippingProfileService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
