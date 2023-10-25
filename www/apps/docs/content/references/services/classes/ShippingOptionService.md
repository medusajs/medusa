# ShippingOptionService

Provides layer to manipulate profiles.

## Hierarchy

- `TransactionBaseService`

  ↳ **`ShippingOptionService`**

## Constructors

### constructor

**new ShippingOptionService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/shipping-option.ts:52](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/shipping-option.ts#L52)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### featureFlagRouter\_

 `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[medusa/src/services/shipping-option.ts:50](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/shipping-option.ts#L50)

___

### manager\_

 `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### methodRepository\_

 `Protected` `Readonly` **methodRepository\_**: `Repository`<`ShippingMethod`\>

#### Defined in

[medusa/src/services/shipping-option.ts:49](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/shipping-option.ts#L49)

___

### optionRepository\_

 `Protected` `Readonly` **optionRepository\_**: `Repository`<`ShippingOption`\> & { `upsertShippingProfile`: Method upsertShippingProfile  }

#### Defined in

[medusa/src/services/shipping-option.ts:48](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/shipping-option.ts#L48)

___

### providerService\_

 `Protected` `Readonly` **providerService\_**: [`FulfillmentProviderService`](FulfillmentProviderService.md)

#### Defined in

[medusa/src/services/shipping-option.ts:44](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/shipping-option.ts#L44)

___

### regionService\_

 `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[medusa/src/services/shipping-option.ts:45](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/shipping-option.ts#L45)

___

### requirementRepository\_

 `Protected` `Readonly` **requirementRepository\_**: `Repository`<`ShippingOptionRequirement`\>

#### Defined in

[medusa/src/services/shipping-option.ts:47](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/shipping-option.ts#L47)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

### addRequirement

**addRequirement**(`optionId`, `requirement`): `Promise`<`ShippingOption`\>

Adds a requirement to a shipping option. Only 1 requirement of each type
is allowed.

#### Parameters

| Name | Description |
| :------ | :------ |
| `optionId` | `string` | the option to add the requirement to. |
| `requirement` | `ShippingOptionRequirement` | the requirement for the option. |

#### Returns

`Promise`<`ShippingOption`\>

-`Promise`: the result of update
	-`ShippingOption`: 

#### Defined in

[medusa/src/services/shipping-option.ts:693](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/shipping-option.ts#L693)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### create

**create**(`data`): `Promise`<`ShippingOption`\>

Creates a new shipping option. Used both for outbound and inbound shipping
options. The difference is registered by the `is_return` field which
defaults to false.

#### Parameters

| Name | Description |
| :------ | :------ |
| `data` | `CreateShippingOptionInput` | the data to create shipping options |

#### Returns

`Promise`<`ShippingOption`\>

-`Promise`: the result of the create operation
	-`ShippingOption`: 

#### Defined in

[medusa/src/services/shipping-option.ts:431](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/shipping-option.ts#L431)

___

### createShippingMethod

**createShippingMethod**(`optionId`, `data`, `config`): `Promise`<`ShippingMethod`\>

Creates a shipping method for a given cart.

#### Parameters

| Name | Description |
| :------ | :------ |
| `optionId` | `string` | the id of the option to use for the method. |
| `data` | Record<`string`, `unknown`\> | the optional provider data to use. |
| `config` | `CreateShippingMethodDto` | the cart to create the shipping method for. |

#### Returns

`Promise`<`ShippingMethod`\>

-`Promise`: the resulting shipping method.
	-`ShippingMethod`: 

#### Defined in

[medusa/src/services/shipping-option.ts:258](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/shipping-option.ts#L258)

___

### delete

**delete**(`optionId`): `Promise`<`void` \| `ShippingOption`\>

Deletes a profile with a given profile id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `optionId` | `string` | the id of the profile to delete. Must be castable as an ObjectId |

#### Returns

`Promise`<`void` \| `ShippingOption`\>

-`Promise`: the result of the delete operation.
	-`void \| ShippingOption`: (optional) 

#### Defined in

[medusa/src/services/shipping-option.ts:671](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/shipping-option.ts#L671)

___

### deleteShippingMethods

**deleteShippingMethods**(`shippingMethods`): `Promise`<`ShippingMethod`[]\>

Removes a given shipping method

#### Parameters

| Name | Description |
| :------ | :------ |
| `shippingMethods` | `ShippingMethod` \| `ShippingMethod`[] | the shipping method to remove |

#### Returns

`Promise`<`ShippingMethod`[]\>

-`Promise`: removed shipping methods
	-`ShippingMethod[]`: 
		-`ShippingMethod`: 

#### Defined in

[medusa/src/services/shipping-option.ts:238](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/shipping-option.ts#L238)

___

### getPrice\_

**getPrice_**(`option`, `data`, `cart`): `Promise`<`number`\>

Returns the amount to be paid for a shipping method. Will ask the
fulfillment provider to calculate the price if the shipping option has the
price type "calculated".

#### Parameters

| Name | Description |
| :------ | :------ |
| `option` | `ShippingOption` | the shipping option to retrieve the price for. |
| `data` | Record<`string`, `unknown`\> | the shipping data to retrieve the price. |
| `cart` | `undefined` \| `Order` \| `Cart` | the context in which the price should be retrieved. |

#### Returns

`Promise`<`number`\>

-`Promise`: the price of the shipping option.
	-`number`: (optional) 

#### Defined in

[medusa/src/services/shipping-option.ts:771](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/shipping-option.ts#L771)

___

### list

**list**(`selector`, `config?`): `Promise`<`ShippingOption`[]\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | `Selector`<`ShippingOption`\> | the query object for find |
| `config` | `FindConfig`<`ShippingOption`\> | config object |

#### Returns

`Promise`<`ShippingOption`[]\>

-`Promise`: the result of the find operation
	-`ShippingOption[]`: 
		-`ShippingOption`: 

#### Defined in

[medusa/src/services/shipping-option.ts:145](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/shipping-option.ts#L145)

___

### listAndCount

**listAndCount**(`selector`, `config?`): `Promise`<[`ShippingOption`[], `number`]\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | `Selector`<`ShippingOption`\> | the query object for find |
| `config` | `FindConfig`<`ShippingOption`\> | config object |

#### Returns

`Promise`<[`ShippingOption`[], `number`]\>

-`Promise`: the result of the find operation
	-`ShippingOption[]`: 
	-`number`: (optional) 

#### Defined in

[medusa/src/services/shipping-option.ts:160](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/shipping-option.ts#L160)

___

### removeRequirement

**removeRequirement**(`requirementId`): `Promise`<`void` \| `ShippingOptionRequirement`\>

Removes a requirement from a shipping option

#### Parameters

| Name | Description |
| :------ | :------ |
| `requirementId` | `any` | the id of the requirement to remove |

#### Returns

`Promise`<`void` \| `ShippingOptionRequirement`\>

-`Promise`: the result of update
	-`void \| ShippingOptionRequirement`: (optional) 

#### Defined in

[medusa/src/services/shipping-option.ts:722](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/shipping-option.ts#L722)

___

### retrieve

**retrieve**(`optionId`, `options?`): `Promise`<`ShippingOption`\>

Gets a profile by id.
Throws in case of DB Error and if profile was not found.

#### Parameters

| Name | Description |
| :------ | :------ |
| `optionId` | `any` | the id of the profile to get. |
| `options` | `FindConfig`<`ShippingOption`\> | the options to get a profile |

#### Returns

`Promise`<`ShippingOption`\>

-`Promise`: the profile document.
	-`ShippingOption`: 

#### Defined in

[medusa/src/services/shipping-option.ts:177](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/shipping-option.ts#L177)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

**update**(`optionId`, `update`): `Promise`<`ShippingOption`\>

Updates a profile. Metadata updates and product updates should use
dedicated methods, e.g. `setMetadata`, etc. The function
will throw errors if metadata or product updates are attempted.

#### Parameters

| Name | Description |
| :------ | :------ |
| `optionId` | `string` | the id of the option. Must be a string that can be casted to an ObjectId |
| `update` | `UpdateShippingOptionInput` | an object with the update values. |

#### Returns

`Promise`<`ShippingOption`\>

-`Promise`: resolves to the update result.
	-`ShippingOption`: 

#### Defined in

[medusa/src/services/shipping-option.ts:559](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/shipping-option.ts#L559)

___

### updateShippingMethod

**updateShippingMethod**(`id`, `update`): `Promise`<`undefined` \| `ShippingMethod`\>

Updates a shipping method's associations. Useful when a cart is completed
and its methods should be copied to an order/swap entity.

#### Parameters

| Name | Description |
| :------ | :------ |
| `id` | `string` | the id of the shipping method to update |
| `update` | `ShippingMethodUpdate` | the values to update the method with |

#### Returns

`Promise`<`undefined` \| `ShippingMethod`\>

-`Promise`: the resulting shipping method
	-`undefined \| ShippingMethod`: (optional) 

#### Defined in

[medusa/src/services/shipping-option.ts:211](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/shipping-option.ts#L211)

___

### updateShippingProfile

**updateShippingProfile**(`optionIds`, `profileId`): `Promise`<`ShippingOption`[]\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `optionIds` | `string` \| `string`[] | ID or IDs of the shipping options to update |
| `profileId` | `string` | Shipping profile ID to update the shipping options with |

#### Returns

`Promise`<`ShippingOption`[]\>

-`Promise`: updated shipping options
	-`ShippingOption[]`: 
		-`ShippingOption`: 

#### Defined in

[medusa/src/services/shipping-option.ts:747](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/shipping-option.ts#L747)

___

### validateAndMutatePrice

`Private` **validateAndMutatePrice**(`option`, `priceInput`): `Promise`<`CreateShippingOptionInput` \| `Omit`<`ShippingOption`, ``"beforeInsert"``\>\>

#### Parameters

| Name |
| :------ |
| `option` | `ShippingOption` \| `CreateShippingOptionInput` |
| `priceInput` | `ValidatePriceTypeAndAmountInput` |

#### Returns

`Promise`<`CreateShippingOptionInput` \| `Omit`<`ShippingOption`, ``"beforeInsert"``\>\>

-`Promise`: 
	-`CreateShippingOptionInput \| Omit<ShippingOption, ``"beforeInsert"``\>`: (optional) 

#### Defined in

[medusa/src/services/shipping-option.ts:388](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/shipping-option.ts#L388)

___

### validateCartOption

**validateCartOption**(`option`, `cart`): `Promise`<``null`` \| `ShippingOption`\>

Checks if a given option id is a valid option for a cart. If it is the
option is returned with the correct price. Throws when region_ids do not
match, or when the shipping option requirements are not satisfied.

#### Parameters

| Name | Description |
| :------ | :------ |
| `option` | `ShippingOption` | the option object to check |
| `cart` | `Cart` | the cart object to check against |

#### Returns

`Promise`<``null`` \| `ShippingOption`\>

-`Promise`: the validated shipping option
	-```null`` \| ShippingOption`: (optional) 

#### Defined in

[medusa/src/services/shipping-option.ts:346](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/shipping-option.ts#L346)

___

### validatePriceType\_

**validatePriceType_**(`priceType`, `option`): `Promise`<`ShippingOptionPriceType`\>

Validates a shipping option price

#### Parameters

| Name | Description |
| :------ | :------ |
| `priceType` | `ShippingOptionPriceType` | the price to validate |
| `option` | `ShippingOption` | the option to validate against |

#### Returns

`Promise`<`ShippingOptionPriceType`\>

-`Promise`: the validated price

#### Defined in

[medusa/src/services/shipping-option.ts:519](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/shipping-option.ts#L519)

___

### validateRequirement\_

**validateRequirement_**(`requirement`, `optionId?`): `Promise`<`ShippingOptionRequirement`\>

Validates a requirement

#### Parameters

| Name | Default value | Description |
| :------ | :------ | :------ |
| `requirement` | `ShippingOptionRequirement` | the requirement to validate |
| `optionId` | `undefined` \| `string` | `undefined` | the id to validate the requirement |

#### Returns

`Promise`<`ShippingOptionRequirement`\>

-`Promise`: a validated shipping requirement
	-`ShippingOptionRequirement`: 

#### Defined in

[medusa/src/services/shipping-option.ts:77](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/shipping-option.ts#L77)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`ShippingOptionService`](ShippingOptionService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ShippingOptionService`](ShippingOptionService.md)

-`ShippingOptionService`: 

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
