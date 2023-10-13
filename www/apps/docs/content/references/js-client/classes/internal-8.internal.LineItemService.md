---
displayed_sidebar: jsClientSidebar
---

# Class: LineItemService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).LineItemService

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`LineItemService`**

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

### cartRepository\_

• `Protected` `Readonly` **cartRepository\_**: `Repository`<[`Cart`](internal-3.Cart.md)\> & { `findOneWithRelations`: (`relations?`: `FindOptionsRelations`<[`Cart`](internal-3.Cart.md)\>, `optionsWithoutRelations?`: [`Omit`](../modules/internal-1.md#omit)<`FindManyOptions`<[`Cart`](internal-3.Cart.md)\>, ``"relations"``\>) => `Promise`<[`Cart`](internal-3.Cart.md)\> ; `findWithRelations`: (`relations?`: `FindOptionsRelations`<[`Cart`](internal-3.Cart.md)\>, `optionsWithoutRelations?`: [`Omit`](../modules/internal-1.md#omit)<`FindManyOptions`<[`Cart`](internal-3.Cart.md)\>, ``"relations"``\>) => `Promise`<[`Cart`](internal-3.Cart.md)[]\>  }

#### Defined in

packages/medusa/dist/services/line-item.d.ts:30

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: [`FlagRouter`](internal-8.FlagRouter.md)

#### Defined in

packages/medusa/dist/services/line-item.d.ts:35

___

### itemTaxLineRepo\_

• `Protected` `Readonly` **itemTaxLineRepo\_**: `Repository`<[`LineItemTaxLine`](internal-3.LineItemTaxLine.md)\> & { `deleteForCart`: (`cartId`: `string`) => `Promise`<`void`\> ; `upsertLines`: (`lines`: [`LineItemTaxLine`](internal-3.LineItemTaxLine.md)[]) => `Promise`<[`LineItemTaxLine`](internal-3.LineItemTaxLine.md)[]\>  }

#### Defined in

packages/medusa/dist/services/line-item.d.ts:29

___

### lineItemAdjustmentService\_

• `Protected` `Readonly` **lineItemAdjustmentService\_**: [`LineItemAdjustmentService`](internal-8.internal.LineItemAdjustmentService.md)

#### Defined in

packages/medusa/dist/services/line-item.d.ts:36

___

### lineItemRepository\_

• `Protected` `Readonly` **lineItemRepository\_**: `Repository`<[`LineItem`](internal-3.LineItem.md)\> & { `findByReturn`: (`returnId`: `string`) => `Promise`<[`LineItem`](internal-3.LineItem.md) & { `return_item`: [`ReturnItem`](internal-3.ReturnItem.md)  }[]\>  }

#### Defined in

packages/medusa/dist/services/line-item.d.ts:28

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### pricingService\_

• `Protected` `Readonly` **pricingService\_**: [`PricingService`](internal-8.internal.PricingService.md)

#### Defined in

packages/medusa/dist/services/line-item.d.ts:33

___

### productService\_

• `Protected` `Readonly` **productService\_**: [`ProductService`](internal-8.internal.ProductService.md)

#### Defined in

packages/medusa/dist/services/line-item.d.ts:32

___

### productVariantService\_

• `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](internal-8.internal.ProductVariantService.md)

#### Defined in

packages/medusa/dist/services/line-item.d.ts:31

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](internal-8.internal.RegionService.md)

#### Defined in

packages/medusa/dist/services/line-item.d.ts:34

___

### taxProviderService\_

• `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](internal-8.internal.TaxProviderService.md)

#### Defined in

packages/medusa/dist/services/line-item.d.ts:37

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

### cloneTo

▸ **cloneTo**(`ids`, `data?`, `options?`): `Promise`<[`LineItem`](internal-3.LineItem.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ids` | `string` \| `string`[] |
| `data?` | `DeepPartial`<[`LineItem`](internal-3.LineItem.md)\> |
| `options?` | `Object` |
| `options.setOriginalLineItemId?` | `boolean` |

#### Returns

`Promise`<[`LineItem`](internal-3.LineItem.md)[]\>

#### Defined in

packages/medusa/dist/services/line-item.d.ts:108

___

### create

▸ **create**<`T`, `TResult`\>(`data`): `Promise`<`TResult`\>

Create a line item

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [`LineItem`](internal-3.LineItem.md) \| [`LineItem`](internal-3.LineItem.md)[] |
| `TResult` | `T` extends [`LineItem`](internal-3.LineItem.md)[] ? [`LineItem`](internal-3.LineItem.md)[] : [`LineItem`](internal-3.LineItem.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `T` | the line item object to create |

#### Returns

`Promise`<`TResult`\>

the created line item

#### Defined in

packages/medusa/dist/services/line-item.d.ts:81

___

### createReturnLines

▸ **createReturnLines**(`returnId`, `cartId`): `Promise`<[`LineItem`](internal-3.LineItem.md)[]\>

Creates return line items for a given cart based on the return items in a
return.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `returnId` | `string` | the id to generate return items from. |
| `cartId` | `string` | the cart to assign the return line items to. |

#### Returns

`Promise`<[`LineItem`](internal-3.LineItem.md)[]\>

the created line items

#### Defined in

packages/medusa/dist/services/line-item.d.ts:54

___

### createTaxLine

▸ **createTaxLine**(`args`): [`LineItemTaxLine`](internal-3.LineItemTaxLine.md)

Create a line item tax line.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `args` | `DeepPartial`<[`LineItemTaxLine`](internal-3.LineItemTaxLine.md)\> | tax line partial passed to the repo create method |

#### Returns

[`LineItemTaxLine`](internal-3.LineItemTaxLine.md)

a new line item tax line

#### Defined in

packages/medusa/dist/services/line-item.d.ts:107

___

### delete

▸ **delete**(`id`): `Promise`<`undefined` \| ``null`` \| [`LineItem`](internal-3.LineItem.md)\>

Deletes a line item.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the line item to delete |

#### Returns

`Promise`<`undefined` \| ``null`` \| [`LineItem`](internal-3.LineItem.md)\>

the result of the delete operation

#### Defined in

packages/medusa/dist/services/line-item.d.ts:94

___

### deleteWithTaxLines

▸ **deleteWithTaxLines**(`id`): `Promise`<`undefined` \| ``null`` \| [`LineItem`](internal-3.LineItem.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the line item to delete |

#### Returns

`Promise`<`undefined` \| ``null`` \| [`LineItem`](internal-3.LineItem.md)\>

the result of the delete operation

**`Deprecated`**

no the cascade on the entity takes care of it
Deletes a line item with the tax lines.

#### Defined in

packages/medusa/dist/services/line-item.d.ts:101

___

### generate

▸ **generate**<`T`, `TResult`\>(`variantIdOrData`, `regionIdOrContext`, `quantity?`, `context?`): `Promise`<`TResult`\>

Generate a single or multiple line item without persisting the data into the db

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `string` \| [`GenerateInputData`](../modules/internal-8.md#generateinputdata) \| [`GenerateInputData`](../modules/internal-8.md#generateinputdata)[] |
| `TResult` | `T` extends `string` ? [`LineItem`](internal-3.LineItem.md) : `T` extends [`LineItem`](internal-3.LineItem.md) ? [`LineItem`](internal-3.LineItem.md) : [`LineItem`](internal-3.LineItem.md)[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `variantIdOrData` | `T` |
| `regionIdOrContext` | `T` extends `string` ? `string` : [`GenerateLineItemContext`](../modules/internal-8.md#generatelineitemcontext) |
| `quantity?` | `number` |
| `context?` | [`GenerateLineItemContext`](../modules/internal-8.md#generatelineitemcontext) |

#### Returns

`Promise`<`TResult`\>

#### Defined in

packages/medusa/dist/services/line-item.d.ts:62

___

### generateLineItem

▸ `Protected` **generateLineItem**(`variant`, `quantity`, `context`): `Promise`<[`LineItem`](internal-3.LineItem.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `variant` | `Object` |
| `variant.id` | `string` |
| `variant.product` | `Object` |
| `variant.product.discountable` | `boolean` |
| `variant.product.is_giftcard` | `boolean` |
| `variant.product.thumbnail` | ``null`` \| `string` |
| `variant.product.title` | `string` |
| `variant.product_id` | `string` |
| `variant.title` | `string` |
| `quantity` | `number` |
| `context` | [`GenerateLineItemContext`](../modules/internal-8.md#generatelineitemcontext) & { `variantPricing`: [`ProductVariantPricing`](../modules/internal-8.md#productvariantpricing)  } |

#### Returns

`Promise`<[`LineItem`](internal-3.LineItem.md)\>

#### Defined in

packages/medusa/dist/services/line-item.d.ts:63

___

### list

▸ **list**(`selector`, `config?`): `Promise`<[`LineItem`](internal-3.LineItem.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | [`Selector`](../modules/internal-8.internal.md#selector)<[`LineItem`](internal-3.LineItem.md)\> |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`LineItem`](internal-3.LineItem.md)\> |

#### Returns

`Promise`<[`LineItem`](internal-3.LineItem.md)[]\>

#### Defined in

packages/medusa/dist/services/line-item.d.ts:39

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<[`LineItem`](internal-3.LineItem.md)\>

Retrieves a line item by its id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the line item to retrieve |
| `config?` | `Object` | the config to be used at query building |

#### Returns

`Promise`<[`LineItem`](internal-3.LineItem.md)\>

the line item

#### Defined in

packages/medusa/dist/services/line-item.d.ts:46

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

▸ **update**(`idOrSelector`, `data`): `Promise`<[`LineItem`](internal-3.LineItem.md)[]\>

Updates a line item

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idOrSelector` | `string` \| [`Selector`](../modules/internal-8.internal.md#selector)<[`LineItem`](internal-3.LineItem.md)\> | the id or selector of the line item(s) to update |
| `data` | [`Partial`](../modules/internal-8.md#partial)<[`LineItem`](internal-3.LineItem.md)\> | the properties to update the line item(s) |

#### Returns

`Promise`<[`LineItem`](internal-3.LineItem.md)[]\>

the updated line item(s)

#### Defined in

packages/medusa/dist/services/line-item.d.ts:88

___

### validateGenerateArguments

▸ `Protected` **validateGenerateArguments**<`T`, `TResult`\>(`variantIdOrData`, `regionIdOrContext`, `quantity?`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `string` \| [`GenerateInputData`](../modules/internal-8.md#generateinputdata) \| [`GenerateInputData`](../modules/internal-8.md#generateinputdata)[] |
| `TResult` | `T` extends `string` ? [`LineItem`](internal-3.LineItem.md) : `T` extends [`LineItem`](internal-3.LineItem.md) ? [`LineItem`](internal-3.LineItem.md) : [`LineItem`](internal-3.LineItem.md)[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `variantIdOrData` | `string` \| `T` |
| `regionIdOrContext` | `T` extends `string` ? `string` : [`GenerateLineItemContext`](../modules/internal-8.md#generatelineitemcontext) |
| `quantity?` | `number` |

#### Returns

`void`

#### Defined in

packages/medusa/dist/services/line-item.d.ts:111

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`LineItemService`](internal-8.internal.LineItemService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`LineItemService`](internal-8.internal.LineItemService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
