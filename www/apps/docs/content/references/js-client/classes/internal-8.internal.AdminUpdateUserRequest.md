---
displayed_sidebar: jsClientSidebar
---

# Class: AdminUpdateUserRequest

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminUpdateUserRequest

**`Schema`**

AdminUpdateUserRequest
type: object
properties:
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
  api_token:
    description: "The API token of the User."
    type: string
  metadata:
    description: An optional set of key-value pairs with additional information.
    type: object
    externalDocs:
      description: "Learn about the metadata attribute, and how to delete and update it."
      url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"

## Properties

### api\_token

• `Optional` **api\_token**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/users/update-user.d.ts:95

___

### first\_name

• `Optional` **first\_name**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/users/update-user.d.ts:92

___

### last\_name

• `Optional` **last\_name**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/users/update-user.d.ts:93

___

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/users/update-user.d.ts:96

___

### role

• `Optional` **role**: [`UserRoles`](../enums/internal-1.UserRoles.md)

#### Defined in

packages/medusa/dist/api/routes/admin/users/update-user.d.ts:94
