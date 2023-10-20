---
displayed_sidebar: jsClientSidebar
---

# Interface: FulfillmentService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).FulfillmentService

Fulfillment Provider interface
Fullfillment provider plugin services should extend the AbstractFulfillmentService from this file

## Implemented by

- [`AbstractFulfillmentService`](../classes/internal-8.internal.AbstractFulfillmentService.md)

## Methods

### calculatePrice

▸ **calculatePrice**(`optionData`, `data`, `cart`): `Promise`<`number`\>

Used to calculate a price for a given shipping option.

#### Parameters

| Name | Type |
| :------ | :------ |
| `optionData` | [`ShippingOptionData`](../modules/internal-8.md#shippingoptiondata) |
| `data` | [`FulfillmentProviderData`](../modules/internal-8.md#fulfillmentproviderdata) |
| `cart` | [`Cart`](../classes/internal-3.Cart.md) |

#### Returns

`Promise`<`number`\>

#### Defined in

packages/medusa/dist/interfaces/fulfillment-service.d.ts:47

___

### canCalculate

▸ **canCalculate**(`data`): `Promise`<`boolean`\>

Used to determine if a shipping option can have a calculated price

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`ShippingOptionData`](../modules/internal-8.md#shippingoptiondata) |

#### Returns

`Promise`<`boolean`\>

#### Defined in

packages/medusa/dist/interfaces/fulfillment-service.d.ts:43

___

### cancelFulfillment

▸ **cancelFulfillment**(`fulfillmentData`): `Promise`<`any`\>

Cancel a fulfillment using data from the fulfillment

#### Parameters

| Name | Type |
| :------ | :------ |
| `fulfillmentData` | [`FulfillmentProviderData`](../modules/internal-8.md#fulfillmentproviderdata) |

#### Returns

`Promise`<`any`\>

#### Defined in

packages/medusa/dist/interfaces/fulfillment-service.d.ts:56

___

### createFulfillment

▸ **createFulfillment**(`data`, `items`, `order`, `fulfillment`): `Promise`<[`FulfillmentProviderData`](../modules/internal-8.md#fulfillmentproviderdata)\>

Create a fulfillment using data from shipping method, line items, and fulfillment. All from the order.
The returned value of this method will populate the `fulfillment.data` field.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`ShippingMethodData`](../modules/internal-8.md#shippingmethoddata) |
| `items` | [`LineItem`](../classes/internal-3.LineItem.md)[] |
| `order` | [`Order`](../classes/internal-3.Order.md) |
| `fulfillment` | [`Fulfillment`](../classes/internal-3.Fulfillment.md) |

#### Returns

`Promise`<[`FulfillmentProviderData`](../modules/internal-8.md#fulfillmentproviderdata)\>

#### Defined in

packages/medusa/dist/interfaces/fulfillment-service.d.ts:52

___

### createReturn

▸ **createReturn**(`returnOrder`): `Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\>\>

Used to create a return order. Should return the data necessary for future
operations on the return; in particular the data may be used to receive
documents attached to the return.

#### Parameters

| Name | Type |
| :------ | :------ |
| `returnOrder` | [`CreateReturnType`](../modules/internal-8.md#createreturntype) |

#### Returns

`Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\>\>

#### Defined in

packages/medusa/dist/interfaces/fulfillment-service.d.ts:62

___

### getFulfillmentDocuments

▸ **getFulfillmentDocuments**(`data`): `Promise`<`any`\>

Used to retrieve documents associated with a fulfillment.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`FulfillmentProviderData`](../modules/internal-8.md#fulfillmentproviderdata) |

#### Returns

`Promise`<`any`\>

#### Defined in

packages/medusa/dist/interfaces/fulfillment-service.d.ts:66

___

### getFulfillmentOptions

▸ **getFulfillmentOptions**(): `Promise`<`any`[]\>

Called before a shipping option is created in Admin. The method should
return all of the options that the fulfillment provider can be used with,
and it is here the distinction between different shipping options are
enforced. For example, a fulfillment provider may offer Standard Shipping
and Express Shipping as fulfillment options, it is up to the store operator
to create shipping options in Medusa that are offered to the customer.

#### Returns

`Promise`<`any`[]\>

#### Defined in

packages/medusa/dist/interfaces/fulfillment-service.d.ts:24

___

### getIdentifier

▸ **getIdentifier**(): `string`

Return a unique identifier to retrieve the fulfillment plugin provider

#### Returns

`string`

#### Defined in

packages/medusa/dist/interfaces/fulfillment-service.d.ts:15

___

### getReturnDocuments

▸ **getReturnDocuments**(`data`): `Promise`<`any`\>

Used to retrieve documents related to a return order.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |

#### Returns

`Promise`<`any`\>

#### Defined in

packages/medusa/dist/interfaces/fulfillment-service.d.ts:70

___

### getShipmentDocuments

▸ **getShipmentDocuments**(`data`): `Promise`<`any`\>

Used to retrieve documents related to a shipment.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |

#### Returns

`Promise`<`any`\>

#### Defined in

packages/medusa/dist/interfaces/fulfillment-service.d.ts:74

___

### retrieveDocuments

▸ **retrieveDocuments**(`fulfillmentData`, `documentType`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fulfillmentData` | [`FulfillmentProviderData`](../modules/internal-8.md#fulfillmentproviderdata) |
| `documentType` | ``"label"`` \| ``"invoice"`` |

#### Returns

`Promise`<`any`\>

#### Defined in

packages/medusa/dist/interfaces/fulfillment-service.d.ts:75

___

### validateFulfillmentData

▸ **validateFulfillmentData**(`optionData`, `data`, `cart`): `Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\>\>

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
| `cart` | [`Cart`](../classes/internal-3.Cart.md) |

#### Returns

`Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\>\>

the data to populate `cart.shipping_methods.$.data` this
   is usually important for future actions like generating shipping labels

#### Defined in

packages/medusa/dist/interfaces/fulfillment-service.d.ts:34

___

### validateOption

▸ **validateOption**(`data`): `Promise`<`boolean`\>

Called before a shipping option is created in Admin. Use this to ensure
that a fulfillment option does in fact exist.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`ShippingOptionData`](../modules/internal-8.md#shippingoptiondata) |

#### Returns

`Promise`<`boolean`\>

#### Defined in

packages/medusa/dist/interfaces/fulfillment-service.d.ts:39
