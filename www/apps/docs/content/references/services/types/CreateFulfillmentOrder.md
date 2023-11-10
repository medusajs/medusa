# CreateFulfillmentOrder

 **CreateFulfillmentOrder**: [`Omit`](Omit.md)<[`ClaimOrder`](../classes/ClaimOrder.md), ``"beforeInsert"``\> & { `billing_address`: [`Address`](../classes/Address.md) ; `currency_code`: `string` ; `discounts`: [`Discount`](../classes/Discount.md)[] ; `display_id`: `number` ; `email?`: `string` ; `is_claim?`: `boolean` ; `is_swap?`: `boolean` ; `items`: [`LineItem`](../classes/LineItem.md)[] ; `no_notification`: `boolean` ; `payments`: [`Payment`](../classes/Payment.md)[] ; `region?`: [`Region`](../classes/Region.md) ; `region_id`: `string` ; `shipping_methods`: [`ShippingMethod`](../classes/ShippingMethod.md)[] ; `tax_rate`: `number` \| ``null``  }

#### Defined in

[packages/medusa/src/types/fulfillment.ts:27](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/fulfillment.ts#L27)
