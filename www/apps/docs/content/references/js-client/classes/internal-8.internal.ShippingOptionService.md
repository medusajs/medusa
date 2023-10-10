---
displayed_sidebar: jsClientSidebar
---

# Class: ShippingOptionService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).ShippingOptionService

Provides layer to manipulate profiles.

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`ShippingOptionService`**

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

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: [`FlagRouter`](internal-8.FlagRouter.md)

#### Defined in

packages/medusa/dist/services/shipping-option.d.ts:30

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### methodRepository\_

• `Protected` `Readonly` **methodRepository\_**: `Repository`<[`ShippingMethod`](internal-3.ShippingMethod.md)\>

#### Defined in

packages/medusa/dist/services/shipping-option.d.ts:29

___

### optionRepository\_

• `Protected` `Readonly` **optionRepository\_**: `Repository`<[`ShippingOption`](internal-3.ShippingOption.md)\> & { `upsertShippingProfile`: (`shippingOptionIds`: `string`[], `shippingProfileId`: `string`) => `Promise`<[`ShippingOption`](internal-3.ShippingOption.md)[]\>  }

#### Defined in

packages/medusa/dist/services/shipping-option.d.ts:28

___

### providerService\_

• `Protected` `Readonly` **providerService\_**: [`FulfillmentProviderService`](internal-8.internal.FulfillmentProviderService.md)

#### Defined in

packages/medusa/dist/services/shipping-option.d.ts:25

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](internal-8.internal.RegionService.md)

#### Defined in

packages/medusa/dist/services/shipping-option.d.ts:26

___

### requirementRepository\_

• `Protected` `Readonly` **requirementRepository\_**: `Repository`<[`ShippingOptionRequirement`](internal-3.ShippingOptionRequirement.md)\>

#### Defined in

packages/medusa/dist/services/shipping-option.d.ts:27

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

___

### validateAndMutatePrice

• `Private` **validateAndMutatePrice**: `any`

#### Defined in

packages/medusa/dist/services/shipping-option.d.ts:90

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

### addRequirement

▸ **addRequirement**(`optionId`, `requirement`): `Promise`<[`ShippingOption`](internal-3.ShippingOption.md)\>

Adds a requirement to a shipping option. Only 1 requirement of each type
is allowed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `optionId` | `string` | the option to add the requirement to. |
| `requirement` | [`ShippingOptionRequirement`](internal-3.ShippingOptionRequirement.md) | the requirement for the option. |

#### Returns

`Promise`<[`ShippingOption`](internal-3.ShippingOption.md)\>

the result of update

#### Defined in

packages/medusa/dist/services/shipping-option.d.ts:130

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

▸ **create**(`data`): `Promise`<[`ShippingOption`](internal-3.ShippingOption.md)\>

Creates a new shipping option. Used both for outbound and inbound shipping
options. The difference is registered by the `is_return` field which
defaults to false.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`CreateShippingOptionInput`](../modules/internal-8.md#createshippingoptioninput) | the data to create shipping options |

#### Returns

`Promise`<[`ShippingOption`](internal-3.ShippingOption.md)\>

the result of the create operation

#### Defined in

packages/medusa/dist/services/shipping-option.d.ts:98

___

### createShippingMethod

▸ **createShippingMethod**(`optionId`, `data`, `config`): `Promise`<[`ShippingMethod`](internal-3.ShippingMethod.md)\>

Creates a shipping method for a given cart.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `optionId` | `string` | the id of the option to use for the method. |
| `data` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> | the optional provider data to use. |
| `config` | [`CreateShippingMethodDto`](../modules/internal-8.md#createshippingmethoddto) | the cart to create the shipping method for. |

#### Returns

`Promise`<[`ShippingMethod`](internal-3.ShippingMethod.md)\>

the resulting shipping method.

#### Defined in

packages/medusa/dist/services/shipping-option.d.ts:80

___

### delete

▸ **delete**(`optionId`): `Promise`<`void` \| [`ShippingOption`](internal-3.ShippingOption.md)\>

Deletes a profile with a given profile id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `optionId` | `string` | the id of the profile to delete. Must be castable as an ObjectId |

#### Returns

`Promise`<`void` \| [`ShippingOption`](internal-3.ShippingOption.md)\>

the result of the delete operation.

#### Defined in

packages/medusa/dist/services/shipping-option.d.ts:122

___

### deleteShippingMethods

▸ **deleteShippingMethods**(`shippingMethods`): `Promise`<[`ShippingMethod`](internal-3.ShippingMethod.md)[]\>

Removes a given shipping method

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shippingMethods` | [`ShippingMethod`](internal-3.ShippingMethod.md) \| [`ShippingMethod`](internal-3.ShippingMethod.md)[] | the shipping method to remove |

#### Returns

`Promise`<[`ShippingMethod`](internal-3.ShippingMethod.md)[]\>

removed shipping methods

#### Defined in

packages/medusa/dist/services/shipping-option.d.ts:72

___

### getPrice\_

▸ **getPrice_**(`option`, `data`, `cart`): `Promise`<`number`\>

Returns the amount to be paid for a shipping method. Will ask the
fulfillment provider to calculate the price if the shipping option has the
price type "calculated".

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `option` | [`ShippingOption`](internal-3.ShippingOption.md) | the shipping option to retrieve the price for. |
| `data` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> | the shipping data to retrieve the price. |
| `cart` | `undefined` \| [`Order`](internal-3.Order.md) \| [`Cart`](internal-3.Cart.md) | the context in which the price should be retrieved. |

#### Returns

`Promise`<`number`\>

the price of the shipping option.

#### Defined in

packages/medusa/dist/services/shipping-option.d.ts:155

___

### list

▸ **list**(`selector`, `config?`): `Promise`<[`ShippingOption`](internal-3.ShippingOption.md)[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | [`Selector`](../modules/internal-8.internal.md#selector)<[`ShippingOption`](internal-3.ShippingOption.md)\> | the query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`ShippingOption`](internal-3.ShippingOption.md)\> | config object |

#### Returns

`Promise`<[`ShippingOption`](internal-3.ShippingOption.md)[]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/shipping-option.d.ts:44

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[[`ShippingOption`](internal-3.ShippingOption.md)[], `number`]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | [`Selector`](../modules/internal-8.internal.md#selector)<[`ShippingOption`](internal-3.ShippingOption.md)\> | the query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`ShippingOption`](internal-3.ShippingOption.md)\> | config object |

#### Returns

`Promise`<[[`ShippingOption`](internal-3.ShippingOption.md)[], `number`]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/shipping-option.d.ts:50

___

### removeRequirement

▸ **removeRequirement**(`requirementId`): `Promise`<`void` \| [`ShippingOptionRequirement`](internal-3.ShippingOptionRequirement.md)\>

Removes a requirement from a shipping option

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `requirementId` | `any` | the id of the requirement to remove |

#### Returns

`Promise`<`void` \| [`ShippingOptionRequirement`](internal-3.ShippingOptionRequirement.md)\>

the result of update

#### Defined in

packages/medusa/dist/services/shipping-option.d.ts:136

___

### retrieve

▸ **retrieve**(`optionId`, `options?`): `Promise`<[`ShippingOption`](internal-3.ShippingOption.md)\>

Gets a profile by id.
Throws in case of DB Error and if profile was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `optionId` | `any` | the id of the profile to get. |
| `options?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`ShippingOption`](internal-3.ShippingOption.md)\> | the options to get a profile |

#### Returns

`Promise`<[`ShippingOption`](internal-3.ShippingOption.md)\>

the profile document.

#### Defined in

packages/medusa/dist/services/shipping-option.d.ts:58

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

▸ **update**(`optionId`, `update`): `Promise`<[`ShippingOption`](internal-3.ShippingOption.md)\>

Updates a profile. Metadata updates and product updates should use
dedicated methods, e.g. `setMetadata`, etc. The function
will throw errors if metadata or product updates are attempted.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `optionId` | `string` | the id of the option. Must be a string that can be casted to an ObjectId |
| `update` | [`UpdateShippingOptionInput`](../modules/internal-8.md#updateshippingoptioninput) | an object with the update values. |

#### Returns

`Promise`<[`ShippingOption`](internal-3.ShippingOption.md)\>

resolves to the update result.

#### Defined in

packages/medusa/dist/services/shipping-option.d.ts:115

___

### updateShippingMethod

▸ **updateShippingMethod**(`id`, `update`): `Promise`<`undefined` \| [`ShippingMethod`](internal-3.ShippingMethod.md)\>

Updates a shipping method's associations. Useful when a cart is completed
and its methods should be copied to an order/swap entity.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the shipping method to update |
| `update` | [`ShippingMethodUpdate`](../modules/internal-8.md#shippingmethodupdate) | the values to update the method with |

#### Returns

`Promise`<`undefined` \| [`ShippingMethod`](internal-3.ShippingMethod.md)\>

the resulting shipping method

#### Defined in

packages/medusa/dist/services/shipping-option.d.ts:66

___

### updateShippingProfile

▸ **updateShippingProfile**(`optionIds`, `profileId`): `Promise`<[`ShippingOption`](internal-3.ShippingOption.md)[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `optionIds` | `string` \| `string`[] | ID or IDs of the shipping options to update |
| `profileId` | `string` | Shipping profile ID to update the shipping options with |

#### Returns

`Promise`<[`ShippingOption`](internal-3.ShippingOption.md)[]\>

updated shipping options

#### Defined in

packages/medusa/dist/services/shipping-option.d.ts:143

___

### validateCartOption

▸ **validateCartOption**(`option`, `cart`): `Promise`<``null`` \| [`ShippingOption`](internal-3.ShippingOption.md)\>

Checks if a given option id is a valid option for a cart. If it is the
option is returned with the correct price. Throws when region_ids do not
match, or when the shipping option requirements are not satisfied.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `option` | [`ShippingOption`](internal-3.ShippingOption.md) | the option object to check |
| `cart` | [`Cart`](internal-3.Cart.md) | the cart object to check against |

#### Returns

`Promise`<``null`` \| [`ShippingOption`](internal-3.ShippingOption.md)\>

the validated shipping option

#### Defined in

packages/medusa/dist/services/shipping-option.d.ts:89

___

### validatePriceType\_

▸ **validatePriceType_**(`priceType`, `option`): `Promise`<[`ShippingOptionPriceType`](../enums/internal-3.ShippingOptionPriceType.md)\>

Validates a shipping option price

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `priceType` | [`ShippingOptionPriceType`](../enums/internal-3.ShippingOptionPriceType.md) | the price to validate |
| `option` | [`ShippingOption`](internal-3.ShippingOption.md) | the option to validate against |

#### Returns

`Promise`<[`ShippingOptionPriceType`](../enums/internal-3.ShippingOptionPriceType.md)\>

the validated price

#### Defined in

packages/medusa/dist/services/shipping-option.d.ts:105

___

### validateRequirement\_

▸ **validateRequirement_**(`requirement`, `optionId?`): `Promise`<[`ShippingOptionRequirement`](internal-3.ShippingOptionRequirement.md)\>

Validates a requirement

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `requirement` | [`ShippingOptionRequirement`](internal-3.ShippingOptionRequirement.md) | the requirement to validate |
| `optionId?` | `string` | the id to validate the requirement |

#### Returns

`Promise`<[`ShippingOptionRequirement`](internal-3.ShippingOptionRequirement.md)\>

a validated shipping requirement

#### Defined in

packages/medusa/dist/services/shipping-option.d.ts:38

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`ShippingOptionService`](internal-8.internal.ShippingOptionService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ShippingOptionService`](internal-8.internal.ShippingOptionService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
