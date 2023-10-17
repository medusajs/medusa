---
displayed_sidebar: jsClientSidebar
---

# Class: AddressCreatePayload

[internal](../modules/internal.md).AddressCreatePayload

**`Schema`**

AddressCreatePayload
type: object
description: "Address fields used when creating an address."
required:
  - first_name
  - last_name
  - address_1
  - city
  - country_code
  - postal_code
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

## Properties

### address\_1

• **address\_1**: `string`

#### Defined in

packages/medusa/dist/types/common.d.ts:231

___

### address\_2

• **address\_2**: `string`

#### Defined in

packages/medusa/dist/types/common.d.ts:232

___

### city

• **city**: `string`

#### Defined in

packages/medusa/dist/types/common.d.ts:233

___

### company

• **company**: `string`

#### Defined in

packages/medusa/dist/types/common.d.ts:230

___

### country\_code

• **country\_code**: `string`

#### Defined in

packages/medusa/dist/types/common.d.ts:234

___

### first\_name

• **first\_name**: `string`

#### Defined in

packages/medusa/dist/types/common.d.ts:226

___

### last\_name

• **last\_name**: `string`

#### Defined in

packages/medusa/dist/types/common.d.ts:227

___

### metadata

• **metadata**: `object`

#### Defined in

packages/medusa/dist/types/common.d.ts:229

___

### phone

• **phone**: `string`

#### Defined in

packages/medusa/dist/types/common.d.ts:228

___

### postal\_code

• **postal\_code**: `string`

#### Defined in

packages/medusa/dist/types/common.d.ts:236

___

### province

• **province**: `string`

#### Defined in

packages/medusa/dist/types/common.d.ts:235
