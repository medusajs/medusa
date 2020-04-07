# ShippingOptionService

In Medusa, ShippingOptions represent ways that the customer can have their order shipped. Shipping options are defined by the store operator and are linked to a fulfillment provider. When the customer places their order the fulfillment provider plugin will be notified. 

Shipping Options can have either flat rate prices or calculated prices. As the names suggest a flat rate price is a fixed amount, e.g. for Free Shipping, while calculated rates are prices that are calculated by the fulfillment provider.

## Creating ShippingOptions

Shipping options are created with POST calls to `/admin/shipping-options`. You can define requirements that the cart should meet in order to allow the shipping option to be applied to it. Furthermore, you should define what Region the shipping option is available in.

## Using Shipping Options

Your fulfillment provider may need additional data in order to validate the shipping option for use. For example, the store operator could make a shipping option called "ShopPickup" which is fulfilled by your warehouse and shipped with CarrierX. 

CarrierX sends the order to the customer's local store where the customer can pick up their order. In this case fulfillment provider needs some additional data about which store CarrierX is shipping to. The additional data should be provided in the data field when calling POST `/store/carts/:id/shipping-method`.

