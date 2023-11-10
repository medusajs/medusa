# InsertOneResult

## Type parameters

| Name | Type |
| :------ | :------ |
| `TSchema` | `object` |

## Properties

### acknowledged

 **acknowledged**: `boolean`

Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3318

___

### insertedId

 **insertedId**: [`InferIdType`](../index.md#inferidtype)<`TSchema`\>

The identifier that was inserted. If the server generated the identifier, this value will be null as the driver does not have access to that data

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3320
