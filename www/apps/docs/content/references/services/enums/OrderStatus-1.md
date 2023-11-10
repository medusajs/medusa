# OrderStatus

The status of an order.

## Enumeration Members

### archived

 **archived** = ``"archived"``

Order is archived.

#### Defined in

[packages/medusa/src/types/orders.ts:42](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/orders.ts#L42)

___

### canceled

 **canceled** = ``"canceled"``

Order is canceled.

#### Defined in

[packages/medusa/src/types/orders.ts:46](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/orders.ts#L46)

___

### completed

 **completed** = ``"completed"``

Order is completed. An order is completed when it's paid and fulfilled.

#### Defined in

[packages/medusa/src/types/orders.ts:38](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/orders.ts#L38)

___

### pending

 **pending** = ``"pending"``

Order is pending.

#### Defined in

[packages/medusa/src/types/orders.ts:34](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/orders.ts#L34)

___

### requires\_action

 **requires\_action** = ``"requires_action"``

Order requires an action. This status is applied when the order's payment or fulfillment requires an additional action.

#### Defined in

[packages/medusa/src/types/orders.ts:50](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/orders.ts#L50)
