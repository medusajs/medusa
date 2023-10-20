---
displayed_sidebar: jsClientSidebar
---

# Class: AdminCreateUserRequest

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminCreateUserRequest

**`Schema`**

AdminCreateUserRequest
type: object
required:
  - email
  - password
properties:
  email:
    description: "The User's email."
    type: string
    format: email
  first_name:
    description: "The first name of the User."
    type: string
  last_name:
    description: "The last name of the User."
    type: string
  role:
    description: "The role assigned to the user. These roles don't provide any different privileges."
    type: string
    enum: [admin, member, developer]
  password:
    description: "The User's password."
    type: string
    format: password

## Properties

### email

• **email**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/users/create-user.d.ts:94

___

### first\_name

• `Optional` **first\_name**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/users/create-user.d.ts:95

___

### last\_name

• `Optional` **last\_name**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/users/create-user.d.ts:96

___

### password

• **password**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/users/create-user.d.ts:98

___

### role

• `Optional` **role**: [`UserRoles`](../enums/internal-1.UserRoles.md)

#### Defined in

packages/medusa/dist/api/routes/admin/users/create-user.d.ts:97
