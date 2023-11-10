# InferIdType

 **InferIdType**<`TSchema`\>: `TSchema` extends { `_id`: infer IdType  } ? Record<`any`, `never`\> extends `IdType` ? `never` : `IdType` : `TSchema` extends { `_id?`: infer IdType  } ? `unknown` extends `IdType` ? [`ObjectId`](../classes/ObjectId.md) : `IdType` : [`ObjectId`](../classes/ObjectId.md)

Given an object shaped type, return the type of the _id field or default to ObjectId

#### Type parameters

| Name |
| :------ |
| `TSchema` | `object` |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3287
