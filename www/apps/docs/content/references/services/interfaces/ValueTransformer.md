# ValueTransformer

Interface for objects that deal with (un)marshalling data.

## Methods

### from

**from**(`value`): `any`

Used to unmarshal data when reading from the database.

#### Parameters

| Name |
| :------ |
| `value` | `any` |

#### Returns

`any`

-`any`: (optional) 

#### Defined in

node_modules/typeorm/decorator/options/ValueTransformer.d.ts:12

___

### to

**to**(`value`): `any`

Used to marshal data when writing to the database.

#### Parameters

| Name |
| :------ |
| `value` | `any` |

#### Returns

`any`

-`any`: (optional) 

#### Defined in

node_modules/typeorm/decorator/options/ValueTransformer.d.ts:8
