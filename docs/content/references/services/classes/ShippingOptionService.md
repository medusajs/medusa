# Class: ShippingOptionService

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

[services/shipping-option.ts:39](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/shipping-option.ts#L39)

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

[services/shipping-option.ts:36](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/shipping-option.ts#L36)

___

### methodRepository\_

• `Protected` `Readonly` **methodRepository\_**: typeof `ShippingMethodRepository`

#### Defined in

[services/shipping-option.ts:34](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/shipping-option.ts#L34)

___

### optionRepository\_

• `Protected` `Readonly` **optionRepository\_**: typeof `ShippingOptionRepository`

#### Defined in

[services/shipping-option.ts:33](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/shipping-option.ts#L33)

___

### providerService\_

• `Protected` `Readonly` **providerService\_**: [`FulfillmentProviderService`](FulfillmentProviderService.md)

#### Defined in

[services/shipping-option.ts:30](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/shipping-option.ts#L30)

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[services/shipping-option.ts:31](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/shipping-option.ts#L31)

___

### requirementRepository\_

• `Protected` `Readonly` **requirementRepository\_**: typeof `ShippingOptionRequirementRepository`

#### Defined in

[services/shipping-option.ts:32](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/shipping-option.ts#L32)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/shipping-option.ts:37](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/shipping-option.ts#L37)

## Methods

### addRequirement

▸ **addRequirement**(`optionId`, `requirement`): `Promise`<`ShippingOption`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `optionId` | `string` |  |
| `requirement` | `ShippingOptionRequirement` |  |

#### Returns

`Promise`<`ShippingOption`\>

#### Defined in

[services/shipping-option.ts:623](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/shipping-option.ts#L623)

___

### atomicPhase\_

▸ `Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

#### Type parameters

| Name |
| :------ |
| `TResult` |
| `TError` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> |  |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |

#### Returns

`Promise`<`TResult`\>

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[interfaces/transaction-base-service.ts:53](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L53)

___

### create

▸ **create**(`data`): `Promise`<`ShippingOption`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `CreateShippingOptionInput` |  |

#### Returns

`Promise`<`ShippingOption`\>

#### Defined in

[services/shipping-option.ts:380](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/shipping-option.ts#L380)

___

### createShippingMethod

▸ **createShippingMethod**(`optionId`, `data`, `config`): `Promise`<`ShippingMethod`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `optionId` | `string` |  |
| `data` | `object` |  |
| `config` | `CreateShippingMethodDto` |  |

#### Returns

`Promise`<`ShippingMethod`\>

#### Defined in

[services/shipping-option.ts:253](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/shipping-option.ts#L253)

___

### delete

▸ **delete**(`optionId`): `Promise`<`void` \| `ShippingOption`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `optionId` | `string` |  |

#### Returns

`Promise`<`void` \| `ShippingOption`\>

#### Defined in

[services/shipping-option.ts:601](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/shipping-option.ts#L601)

___

### deleteShippingMethods

▸ **deleteShippingMethods**(`shippingMethods`): `Promise`<`ShippingMethod`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shippingMethods` | `ShippingMethod` \| `ShippingMethod`[] |  |

#### Returns

`Promise`<`ShippingMethod`[]\>

#### Defined in

[services/shipping-option.ts:233](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/shipping-option.ts#L233)

___

### getPrice\_

▸ **getPrice_**(`option`, `data`, `cart`): `Promise`<`number`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `option` | `ShippingOption` |  |
| `data` | `object` |  |
| `cart` | `undefined` \| `Order` \| `Cart` |  |

#### Returns

`Promise`<`number`\>

#### Defined in

[services/shipping-option.ts:682](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/shipping-option.ts#L682)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`ShippingOption`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`ShippingMethod`\> |  |
| `config` | `FindConfig`<`ShippingOption`\> |  |

#### Returns

`Promise`<`ShippingOption`[]\>

#### Defined in

[services/shipping-option.ts:130](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/shipping-option.ts#L130)

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[`ShippingOption`[], `number`]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`ShippingMethod`\> |  |
| `config` | `FindConfig`<`ShippingOption`\> |  |

#### Returns

`Promise`<[`ShippingOption`[], `number`]\>

#### Defined in

[services/shipping-option.ts:146](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/shipping-option.ts#L146)

___

### removeRequirement

▸ **removeRequirement**(`requirementId`): `Promise`<`void` \| `ShippingOptionRequirement`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `requirementId` | `any` |  |

#### Returns

`Promise`<`void` \| `ShippingOptionRequirement`\>

#### Defined in

[services/shipping-option.ts:652](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/shipping-option.ts#L652)

___

### retrieve

▸ **retrieve**(`optionId`, `options?`): `Promise`<`ShippingOption`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `optionId` | `any` |  |
| `options` | `Object` |  |
| `options.relations?` | `string`[] | - |
| `options.select?` | keyof `ShippingOption`[] | - |

#### Returns

`Promise`<`ShippingOption`\>

#### Defined in

[services/shipping-option.ts:164](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/shipping-option.ts#L164)

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

[interfaces/transaction-base-service.ts:34](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L34)

___

### update

▸ **update**(`optionId`, `update`): `Promise`<`ShippingOption`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `optionId` | `string` |  |
| `update` | `UpdateShippingOptionInput` |  |

#### Returns

`Promise`<`ShippingOption`\>

#### Defined in

[services/shipping-option.ts:494](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/shipping-option.ts#L494)

___

### updateShippingMethod

▸ **updateShippingMethod**(`id`, `update`): `Promise`<`undefined` \| `ShippingMethod`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |
| `update` | `ShippingMethodUpdate` |  |

#### Returns

`Promise`<`undefined` \| `ShippingMethod`\>

#### Defined in

[services/shipping-option.ts:204](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/shipping-option.ts#L204)

___

### validateCartOption

▸ **validateCartOption**(`option`, `cart`): `Promise`<``null`` \| `ShippingOption`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `option` | `ShippingOption` |  |
| `cart` | `Cart` |  |

#### Returns

`Promise`<``null`` \| `ShippingOption`\>

#### Defined in

[services/shipping-option.ts:331](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/shipping-option.ts#L331)

___

### validatePriceType\_

▸ **validatePriceType_**(`priceType`, `option`): `Promise`<`ShippingOptionPriceType`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `priceType` | `ShippingOptionPriceType` |  |
| `option` | `ShippingOption` |  |

#### Returns

`Promise`<`ShippingOptionPriceType`\>

#### Defined in

[services/shipping-option.ts:458](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/shipping-option.ts#L458)

___

### validateRequirement\_

▸ **validateRequirement_**(`requirement`, `optionId?`): `Promise`<`ShippingOptionRequirement`\>

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `requirement` | `ShippingOptionRequirement` | `undefined` |  |
| `optionId` | `undefined` \| `string` | `undefined` |  |

#### Returns

`Promise`<`ShippingOptionRequirement`\>

#### Defined in

[services/shipping-option.ts:64](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/shipping-option.ts#L64)

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

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
