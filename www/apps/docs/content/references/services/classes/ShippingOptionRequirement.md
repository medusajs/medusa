# ShippingOptionRequirement

A shipping option requirement defines conditions that a Cart must satisfy for the Shipping Option to be available for usage in the Cart.

## Constructors

### constructor

**new ShippingOptionRequirement**()

A shipping option requirement defines conditions that a Cart must satisfy for the Shipping Option to be available for usage in the Cart.

## Properties

### amount

 **amount**: `number`

The amount to compare the Cart subtotal to.

#### Defined in

[packages/medusa/src/models/shipping-option-requirement.ts:49](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-option-requirement.ts#L49)

___

### deleted\_at

 **deleted\_at**: `Date`

The date with timezone at which the resource was deleted.

#### Defined in

[packages/medusa/src/models/shipping-option-requirement.ts:52](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-option-requirement.ts#L52)

___

### id

 **id**: `string`

The shipping option requirement's ID

#### Defined in

[packages/medusa/src/models/shipping-option-requirement.ts:35](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-option-requirement.ts#L35)

___

### shipping\_option

 **shipping\_option**: [`ShippingOption`](ShippingOption.md)

The details of the shipping option that the requirements belong to.

#### Defined in

[packages/medusa/src/models/shipping-option-requirement.ts:43](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-option-requirement.ts#L43)

___

### shipping\_option\_id

 **shipping\_option\_id**: `string`

The ID of the shipping option that the requirements belong to.

#### Defined in

[packages/medusa/src/models/shipping-option-requirement.ts:39](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-option-requirement.ts#L39)

___

### type

 **type**: [`RequirementType`](../enums/RequirementType.md)

The type of the requirement, this defines how the value will be compared to the Cart's total. `min_subtotal` requirements define the minimum subtotal that is needed for the Shipping Option to be available, while the `max_subtotal` defines the maximum subtotal that the Cart can have for the Shipping Option to be available.

#### Defined in

[packages/medusa/src/models/shipping-option-requirement.ts:46](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-option-requirement.ts#L46)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/shipping-option-requirement.ts:58](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-option-requirement.ts#L58)
