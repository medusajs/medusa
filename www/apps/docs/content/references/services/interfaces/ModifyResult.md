# ModifyResult

**Deprecated**

This type will be completely removed and findOneAndUpdate,
            findOneAndDelete, and findOneAndReplace will then return the
            actual result document.

## Type parameters

| Name | Type |
| :------ | :------ |
| `TSchema` | `object` |

## Properties

### lastErrorObject

 `Optional` **lastErrorObject**: [`Document`](Document.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3429

___

### ok

 **ok**: ``0`` \| ``1``

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3430

___

### value

 **value**: ``null`` \| [`WithId`](../types/WithId.md)<`TSchema`\>

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3428
