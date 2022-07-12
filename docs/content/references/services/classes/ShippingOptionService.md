# Class: ShippingOptionService

Provides layer to manipulate profiles.

## Hierarchy

- `TransactionBaseService`<[`ShippingOptionService`](ShippingOptionService.md)\>

  ↳ **`ShippingOptionService`**

## Constructors

### constructor

• **new ShippingOptionService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

TransactionBaseService&lt;ShippingOptionService\&gt;.constructor

#### Defined in

[services/shipping-option.ts:39](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/shipping-option.ts#L39)

## Properties

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

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[services/shipping-option.ts:36](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/shipping-option.ts#L36)

___

### methodRepository\_

• `Protected` `Readonly` **methodRepository\_**: typeof `ShippingMethodRepository`

#### Defined in

[services/shipping-option.ts:34](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/shipping-option.ts#L34)

___

### optionRepository\_

• `Protected` `Readonly` **optionRepository\_**: typeof `ShippingOptionRepository`

#### Defined in

[services/shipping-option.ts:33](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/shipping-option.ts#L33)

___

### providerService\_

• `Protected` `Readonly` **providerService\_**: [`FulfillmentProviderService`](FulfillmentProviderService.md)

#### Defined in

[services/shipping-option.ts:30](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/shipping-option.ts#L30)

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[services/shipping-option.ts:31](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/shipping-option.ts#L31)

___

### requirementRepository\_

• `Protected` `Readonly` **requirementRepository\_**: typeof `ShippingOptionRequirementRepository`

#### Defined in

[services/shipping-option.ts:32](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/shipping-option.ts#L32)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/shipping-option.ts:37](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/shipping-option.ts#L37)

## Methods

### addRequirement

▸ **addRequirement**(`optionId`, `requirement`): `Promise`<`ShippingOption`\>

Adds a requirement to a shipping option. Only 1 requirement of each type
is allowed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `optionId` | `string` | the option to add the requirement to. |
| `requirement` | `ShippingOptionRequirement` | the requirement for the option. |

#### Returns

`Promise`<`ShippingOption`\>

the result of update

#### Defined in

[services/shipping-option.ts:627](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/shipping-option.ts#L627)

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

### create

▸ **create**(`data`): `Promise`<`ShippingOption`\>

Creates a new shipping option. Used both for outbound and inbound shipping
options. The difference is registered by the `is_return` field which
defaults to false.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `CreateShippingOptionInput` | the data to create shipping options |

#### Returns

`Promise`<`ShippingOption`\>

the result of the create operation

#### Defined in

[services/shipping-option.ts:384](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/shipping-option.ts#L384)

___

### createShippingMethod

▸ **createShippingMethod**(`optionId`, `data`, `config`): `Promise`<`ShippingMethod`\>

Creates a shipping method for a given cart.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `optionId` | `string` | the id of the option to use for the method. |
| `data` | `object` | the optional provider data to use. |
| `config` | `CreateShippingMethodDto` | the cart to create the shipping method for. |

#### Returns

`Promise`<`ShippingMethod`\>

the resulting shipping method.

#### Defined in

[services/shipping-option.ts:259](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/shipping-option.ts#L259)

___

### delete

▸ **delete**(`optionId`): `Promise`<`void` \| `ShippingOption`\>

Deletes a profile with a given profile id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `optionId` | `string` | the id of the profile to delete. Must be   castable as an ObjectId |

#### Returns

`Promise`<`void` \| `ShippingOption`\>

the result of the delete operation.

#### Defined in

[services/shipping-option.ts:605](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/shipping-option.ts#L605)

___

### deleteShippingMethods

▸ **deleteShippingMethods**(`shippingMethods`): `Promise`<`ShippingMethod`[]\>

Removes a given shipping method

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shippingMethods` | `ShippingMethod` \| `ShippingMethod`[] | the shipping method to remove |

#### Returns

`Promise`<`ShippingMethod`[]\>

removed shipping methods

#### Defined in

[services/shipping-option.ts:239](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/shipping-option.ts#L239)

___

### getPrice\_

▸ **getPrice_**(`option`, `data`, `cart`): `Promise`<`number`\>

Returns the amount to be paid for a shipping method. Will ask the
fulfillment provider to calculate the price if the shipping option has the
price type "calculated".

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `option` | `ShippingOption` | the shipping option to retrieve the price   for. |
| `data` | `object` | the shipping data to retrieve the price. |
| `cart` | `undefined` \| `Cart` \| `Order` | the context in which the price should be   retrieved. |

#### Returns

`Promise`<`number`\>

the price of the shipping option.

#### Defined in

[services/shipping-option.ts:686](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/shipping-option.ts#L686)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`ShippingOption`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`ShippingMethod`\> | the query object for find |
| `config` | `FindConfig`<`ShippingOption`\> | config object |

#### Returns

`Promise`<`ShippingOption`[]\>

the result of the find operation

#### Defined in

[services/shipping-option.ts:130](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/shipping-option.ts#L130)

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[`ShippingOption`[], `number`]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`ShippingMethod`\> | the query object for find |
| `config` | `FindConfig`<`ShippingOption`\> | config object |

#### Returns

`Promise`<[`ShippingOption`[], `number`]\>

the result of the find operation

#### Defined in

[services/shipping-option.ts:149](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/shipping-option.ts#L149)

___

### removeRequirement

▸ **removeRequirement**(`requirementId`): `Promise`<`void` \| `ShippingOptionRequirement`\>

Removes a requirement from a shipping option

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `requirementId` | `any` | the id of the requirement to remove |

#### Returns

`Promise`<`void` \| `ShippingOptionRequirement`\>

the result of update

#### Defined in

[services/shipping-option.ts:656](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/shipping-option.ts#L656)

___

### retrieve

▸ **retrieve**(`optionId`, `options?`): `Promise`<`ShippingOption`\>

Gets a profile by id.
Throws in case of DB Error and if profile was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `optionId` | `any` | the id of the profile to get. |
| `options` | `Object` | the options to get a profile |
| `options.relations?` | `string`[] | - |
| `options.select?` | keyof `ShippingOption`[] | - |

#### Returns

`Promise`<`ShippingOption`\>

the profile document.

#### Defined in

[services/shipping-option.ts:170](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/shipping-option.ts#L170)

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

▸ **update**(`optionId`, `update`): `Promise`<`ShippingOption`\>

Updates a profile. Metadata updates and product updates should use
dedicated methods, e.g. `setMetadata`, etc. The function
will throw errors if metadata or product updates are attempted.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `optionId` | `string` | the id of the option. Must be a string that   can be casted to an ObjectId |
| `update` | `UpdateShippingOptionInput` | an object with the update values. |

#### Returns

`Promise`<`ShippingOption`\>

resolves to the update result.

#### Defined in

[services/shipping-option.ts:498](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/shipping-option.ts#L498)

___

### updateShippingMethod

▸ **updateShippingMethod**(`id`, `update`): `Promise`<`undefined` \| `ShippingMethod`\>

Updates a shipping method's associations. Useful when a cart is completed
and its methods should be copied to an order/swap entity.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the shipping method to update |
| `update` | `ShippingMethodUpdate` | the values to update the method with |

#### Returns

`Promise`<`undefined` \| `ShippingMethod`\>

the resulting shipping method

#### Defined in

[services/shipping-option.ts:210](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/shipping-option.ts#L210)

___

### validateCartOption

▸ **validateCartOption**(`option`, `cart`): ``null`` \| `ShippingOption`

Checks if a given option id is a valid option for a cart. If it is the
option is returned with the correct price. Throws when region_ids do not
match, or when the shipping option requirements are not satisfied.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `option` | `ShippingOption` | the option object to check |
| `cart` | `Cart` | the cart object to check against |

#### Returns

``null`` \| `ShippingOption`

the validated shipping option

#### Defined in

[services/shipping-option.ts:337](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/shipping-option.ts#L337)

___

### validatePriceType\_

▸ **validatePriceType_**(`priceType`, `option`): `Promise`<`ShippingOptionPriceType`\>

Validates a shipping option price

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `priceType` | `ShippingOptionPriceType` | the price to validate |
| `option` | `ShippingOption` | the option to validate against |

#### Returns

`Promise`<`ShippingOptionPriceType`\>

the validated price

#### Defined in

[services/shipping-option.ts:462](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/shipping-option.ts#L462)

___

### validateRequirement\_

▸ **validateRequirement_**(`requirement`, `optionId?`): `Promise`<`ShippingOptionRequirement`\>

Validates a requirement

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `requirement` | `ShippingOptionRequirement` | `undefined` | the requirement to validate |
| `optionId` | `undefined` \| `string` | `undefined` | the id to validate the requirement |

#### Returns

`Promise`<`ShippingOptionRequirement`\>

a validated shipping requirement

#### Defined in

[services/shipping-option.ts:64](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/shipping-option.ts#L64)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`ShippingOptionService`](ShippingOptionService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ShippingOptionService`](ShippingOptionService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
