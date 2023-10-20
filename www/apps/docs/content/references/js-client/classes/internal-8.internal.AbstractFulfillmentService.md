---
displayed_sidebar: jsClientSidebar
---

# Class: AbstractFulfillmentService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AbstractFulfillmentService

Fulfillment Provider interface
Fullfillment provider plugin services should extend the AbstractFulfillmentService from this file

## Implements

- [`FulfillmentService`](../interfaces/internal-8.internal.FulfillmentService.md)

## Properties

### config

• `Protected` `Optional` `Readonly` **config**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/interfaces/fulfillment-service.d.ts:79

___

### container

• `Protected` `Readonly` **container**: [`MedusaContainer`](../modules/internal-8.md#medusacontainer)

#### Defined in

packages/medusa/dist/interfaces/fulfillment-service.d.ts:78

___

### identifier

▪ `Static` **identifier**: `string`

#### Defined in

packages/medusa/dist/interfaces/fulfillment-service.d.ts:81

## Methods

### calculatePrice

▸ `Abstract` **calculatePrice**(`optionData`, `data`, `cart`): `Promise`<`number`\>

Used to calculate a price for a given shipping option.

#### Parameters

| Name | Type |
| :------ | :------ |
| `optionData` | [`ShippingOptionData`](../modules/internal-8.md#shippingoptiondata) |
| `data` | [`FulfillmentProviderData`](../modules/internal-8.md#fulfillmentproviderdata) |
| `cart` | [`Cart`](internal-3.Cart.md) |

#### Returns

`Promise`<`number`\>

#### Implementation of

[FulfillmentService](../interfaces/internal-8.internal.FulfillmentService.md).[calculatePrice](../interfaces/internal-8.internal.FulfillmentService.md#calculateprice)

#### Defined in

packages/medusa/dist/interfaces/fulfillment-service.d.ts:87

___

### canCalculate

▸ `Abstract` **canCalculate**(`data`): `Promise`<`boolean`\>

Used to determine if a shipping option can have a calculated price

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`ShippingOptionData`](../modules/internal-8.md#shippingoptiondata) |

#### Returns

`Promise`<`boolean`\>

#### Implementation of

[FulfillmentService](../interfaces/internal-8.internal.FulfillmentService.md).[canCalculate](../interfaces/internal-8.internal.FulfillmentService.md#cancalculate)

#### Defined in

packages/medusa/dist/interfaces/fulfillment-service.d.ts:86

___

### cancelFulfillment

▸ `Abstract` **cancelFulfillment**(`fulfillment`): `Promise`<`any`\>

Cancel a fulfillment using data from the fulfillment

#### Parameters

| Name | Type |
| :------ | :------ |
| `fulfillment` | [`FulfillmentProviderData`](../modules/internal-8.md#fulfillmentproviderdata) |

#### Returns

`Promise`<`any`\>

#### Implementation of

[FulfillmentService](../interfaces/internal-8.internal.FulfillmentService.md).[cancelFulfillment](../interfaces/internal-8.internal.FulfillmentService.md#cancelfulfillment)

#### Defined in

packages/medusa/dist/interfaces/fulfillment-service.d.ts:89

___

### createFulfillment

▸ `Abstract` **createFulfillment**(`data`, `items`, `order`, `fulfillment`): `Promise`<[`FulfillmentProviderData`](../modules/internal-8.md#fulfillmentproviderdata)\>

Create a fulfillment using data from shipping method, line items, and fulfillment. All from the order.
The returned value of this method will populate the `fulfillment.data` field.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`ShippingMethodData`](../modules/internal-8.md#shippingmethoddata) |
| `items` | [`LineItem`](internal-3.LineItem.md)[] |
| `order` | [`Order`](internal-3.Order.md) |
| `fulfillment` | [`Fulfillment`](internal-3.Fulfillment.md) |

#### Returns

`Promise`<[`FulfillmentProviderData`](../modules/internal-8.md#fulfillmentproviderdata)\>

#### Implementation of

[FulfillmentService](../interfaces/internal-8.internal.FulfillmentService.md).[createFulfillment](../interfaces/internal-8.internal.FulfillmentService.md#createfulfillment)

#### Defined in

packages/medusa/dist/interfaces/fulfillment-service.d.ts:88

___

### createReturn

▸ `Abstract` **createReturn**(`returnOrder`): `Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\>\>

Used to create a return order. Should return the data necessary for future
operations on the return; in particular the data may be used to receive
documents attached to the return.

#### Parameters

| Name | Type |
| :------ | :------ |
| `returnOrder` | [`CreateReturnType`](../modules/internal-8.md#createreturntype) |

#### Returns

`Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\>\>

#### Implementation of

[FulfillmentService](../interfaces/internal-8.internal.FulfillmentService.md).[createReturn](../interfaces/internal-8.internal.FulfillmentService.md#createreturn)

#### Defined in

packages/medusa/dist/interfaces/fulfillment-service.d.ts:90

___

### getFulfillmentDocuments

▸ `Abstract` **getFulfillmentDocuments**(`data`): `Promise`<`any`\>

Used to retrieve documents associated with a fulfillment.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`FulfillmentProviderData`](../modules/internal-8.md#fulfillmentproviderdata) |

#### Returns

`Promise`<`any`\>

#### Implementation of

[FulfillmentService](../interfaces/internal-8.internal.FulfillmentService.md).[getFulfillmentDocuments](../interfaces/internal-8.internal.FulfillmentService.md#getfulfillmentdocuments)

#### Defined in

packages/medusa/dist/interfaces/fulfillment-service.d.ts:91

___

### getFulfillmentOptions

▸ `Abstract` **getFulfillmentOptions**(): `Promise`<`any`[]\>

Called before a shipping option is created in Admin. The method should
return all of the options that the fulfillment provider can be used with,
and it is here the distinction between different shipping options are
enforced. For example, a fulfillment provider may offer Standard Shipping
and Express Shipping as fulfillment options, it is up to the store operator
to create shipping options in Medusa that are offered to the customer.

#### Returns

`Promise`<`any`[]\>

#### Implementation of

[FulfillmentService](../interfaces/internal-8.internal.FulfillmentService.md).[getFulfillmentOptions](../interfaces/internal-8.internal.FulfillmentService.md#getfulfillmentoptions)

#### Defined in

packages/medusa/dist/interfaces/fulfillment-service.d.ts:83

___

### getIdentifier

▸ **getIdentifier**(): `string`

Return a unique identifier to retrieve the fulfillment plugin provider

#### Returns

`string`

#### Implementation of

[FulfillmentService](../interfaces/internal-8.internal.FulfillmentService.md).[getIdentifier](../interfaces/internal-8.internal.FulfillmentService.md#getidentifier)

#### Defined in

packages/medusa/dist/interfaces/fulfillment-service.d.ts:82

___

### getReturnDocuments

▸ `Abstract` **getReturnDocuments**(`data`): `Promise`<`any`\>

Used to retrieve documents related to a return order.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |

#### Returns

`Promise`<`any`\>

#### Implementation of

[FulfillmentService](../interfaces/internal-8.internal.FulfillmentService.md).[getReturnDocuments](../interfaces/internal-8.internal.FulfillmentService.md#getreturndocuments)

#### Defined in

packages/medusa/dist/interfaces/fulfillment-service.d.ts:92

___

### getShipmentDocuments

▸ `Abstract` **getShipmentDocuments**(`data`): `Promise`<`any`\>

Used to retrieve documents related to a shipment.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |

#### Returns

`Promise`<`any`\>

#### Implementation of

[FulfillmentService](../interfaces/internal-8.internal.FulfillmentService.md).[getShipmentDocuments](../interfaces/internal-8.internal.FulfillmentService.md#getshipmentdocuments)

#### Defined in

packages/medusa/dist/interfaces/fulfillment-service.d.ts:93

___

### retrieveDocuments

▸ `Abstract` **retrieveDocuments**(`fulfillmentData`, `documentType`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fulfillmentData` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |
| `documentType` | ``"label"`` \| ``"invoice"`` |

#### Returns

`Promise`<`any`\>

#### Implementation of

[FulfillmentService](../interfaces/internal-8.internal.FulfillmentService.md).[retrieveDocuments](../interfaces/internal-8.internal.FulfillmentService.md#retrievedocuments)

#### Defined in

packages/medusa/dist/interfaces/fulfillment-service.d.ts:94

___

### validateFulfillmentData

▸ `Abstract` **validateFulfillmentData**(`optionData`, `data`, `cart`): `Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\>\>

Called before a shipping method is set on a cart to ensure that the data
sent with the shipping method is valid. The data object may contain extra
data about the shipment such as an id of a drop point. It is up to the
fulfillment provider to enforce that the correct data is being sent
through.

#### Parameters

| Name | Type |
| :------ | :------ |
| `optionData` | [`ShippingOptionData`](../modules/internal-8.md#shippingoptiondata) |
| `data` | [`FulfillmentProviderData`](../modules/internal-8.md#fulfillmentproviderdata) |
| `cart` | [`Cart`](internal-3.Cart.md) |

#### Returns

`Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\>\>

the data to populate `cart.shipping_methods.$.data` this
   is usually important for future actions like generating shipping labels

#### Implementation of

[FulfillmentService](../interfaces/internal-8.internal.FulfillmentService.md).[validateFulfillmentData](../interfaces/internal-8.internal.FulfillmentService.md#validatefulfillmentdata)

#### Defined in

packages/medusa/dist/interfaces/fulfillment-service.d.ts:84

___

### validateOption

▸ `Abstract` **validateOption**(`data`): `Promise`<`boolean`\>

Called before a shipping option is created in Admin. Use this to ensure
that a fulfillment option does in fact exist.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`ShippingOptionData`](../modules/internal-8.md#shippingoptiondata) |

#### Returns

`Promise`<`boolean`\>

#### Implementation of

[FulfillmentService](../interfaces/internal-8.internal.FulfillmentService.md).[validateOption](../interfaces/internal-8.internal.FulfillmentService.md#validateoption)

#### Defined in

packages/medusa/dist/interfaces/fulfillment-service.d.ts:85
