---
displayed_sidebar: jsClientSidebar
---

# Class: AddressPayload

[internal](../modules/internal.md).AddressPayload

**`Schema`**

AddressPayload
type: object
description: "Address fields used when creating/updating an address."
properties:
  first_name:
    description: First name
    type: string
    example: Arno
  last_name:
    description: Last name
    type: string
    example: Willms
  phone:
    type: string
    description: Phone Number
    example: 16128234334802
  company:
    type: string
  address_1:
    description: Address line 1
    type: string
    example: 14433 Kemmer Court
  address_2:
    description: Address line 2
    type: string
    example: Suite 369
  city:
    description: City
    type: string
    example: South Geoffreyview
  country_code:
    description: The 2 character ISO code of the country in lower case
    type: string
    externalDocs:
      url: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements
      description: See a list of codes.
    example: st
  province:
    description: Province
    type: string
    example: Kentucky
  postal_code:
    description: Postal Code
    type: string
    example: 72093
  metadata:
    type: object
    example: {car: "white"}
    description: An optional key-value map with additional details

## Hierarchy

- **`AddressPayload`**

  ↳ [`StorePostCustomersCustomerAddressesAddressReq`](internal.StorePostCustomersCustomerAddressesAddressReq.md)

## Properties

### address\_1

• `Optional` **address\_1**: `string`

#### Defined in

packages/medusa/dist/types/common.d.ts:160

___

### address\_2

• `Optional` **address\_2**: `string`

#### Defined in

packages/medusa/dist/types/common.d.ts:161

___

### city

• `Optional` **city**: `string`

#### Defined in

packages/medusa/dist/types/common.d.ts:162

___

### company

• `Optional` **company**: `string`

#### Defined in

packages/medusa/dist/types/common.d.ts:159

___

### country\_code

• `Optional` **country\_code**: `string`

#### Defined in

packages/medusa/dist/types/common.d.ts:163

___

### first\_name

• `Optional` **first\_name**: `string`

#### Defined in

packages/medusa/dist/types/common.d.ts:155

___

### last\_name

• `Optional` **last\_name**: `string`

#### Defined in

packages/medusa/dist/types/common.d.ts:156

___

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/types/common.d.ts:158

___

### phone

• `Optional` **phone**: `string`

#### Defined in

packages/medusa/dist/types/common.d.ts:157

___

### postal\_code

• `Optional` **postal\_code**: `string`

#### Defined in

packages/medusa/dist/types/common.d.ts:165

___

### province

• `Optional` **province**: `string`

#### Defined in

packages/medusa/dist/types/common.d.ts:164
