# PlainObjectToNewEntityTransformer

Transforms plain old javascript object
Entity is constructed based on its entity metadata.

## Constructors

### constructor

**new PlainObjectToNewEntityTransformer**()

## Properties

### groupAndTransform

 `Private` **groupAndTransform**: `any`

Since db returns a duplicated rows of the data where accuracies of the same object can be duplicated
we need to group our result and we must have some unique id (primary key in our case)

#### Defined in

node_modules/typeorm/query-builder/transformer/PlainObjectToNewEntityTransformer.d.ts:13

## Methods

### transform

**transform**<`T`\>(`newEntity`, `object`, `metadata`, `getLazyRelationsPromiseValue?`): `T`

| Name | Type |
| :------ | :------ |
| `T` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `newEntity` | `T` |
| `object` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `metadata` | [`EntityMetadata`](EntityMetadata.md) |
| `getLazyRelationsPromiseValue?` | `boolean` |

#### Returns

`T`

#### Defined in

node_modules/typeorm/query-builder/transformer/PlainObjectToNewEntityTransformer.d.ts:8
