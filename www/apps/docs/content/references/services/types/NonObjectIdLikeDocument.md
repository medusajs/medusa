# NonObjectIdLikeDocument

 **NonObjectIdLikeDocument**: { [key in keyof ObjectIdLike]?: never } & [`Document`](../interfaces/Document.md)

A type that extends Document but forbids anything that "looks like" an object id.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4276
