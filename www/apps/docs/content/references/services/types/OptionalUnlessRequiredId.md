# OptionalUnlessRequiredId

 **OptionalUnlessRequiredId**<`TSchema`\>: `TSchema` extends { `_id`: `any`  } ? `TSchema` : [`OptionalId`](OptionalId.md)<`TSchema`\>

Adds an optional _id field to an object shaped type, unless the _id field is required on that type.
In the case _id is required, this method continues to require_id.

#### Type parameters

| Name |
| :------ |
| `TSchema` | `object` |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4354
