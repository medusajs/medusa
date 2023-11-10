# IndexDescription

## Hierarchy

- [`Pick`](../index.md#pick)<[`CreateIndexesOptions`](CreateIndexesOptions.md), ``"background"`` \| ``"unique"`` \| ``"partialFilterExpression"`` \| ``"sparse"`` \| ``"hidden"`` \| ``"expireAfterSeconds"`` \| ``"storageEngine"`` \| ``"version"`` \| ``"weights"`` \| ``"default_language"`` \| ``"language_override"`` \| ``"textIndexVersion"`` \| ``"2dsphereIndexVersion"`` \| ``"bits"`` \| ``"min"`` \| ``"max"`` \| ``"bucketSize"`` \| ``"wildcardProjection"``\>

  ↳ **`IndexDescription`**

## Properties

### 2dsphereIndexVersion

 `Optional` **2dsphereIndexVersion**: `number`

#### Inherited from

Pick.2dsphereIndexVersion

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2302

___

### background

 `Optional` **background**: `boolean`

Creates the index in the background, yielding whenever possible.

#### Inherited from

Pick.background

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2281

___

### bits

 `Optional` **bits**: `number`

#### Inherited from

Pick.bits

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2303

___

### bucketSize

 `Optional` **bucketSize**: `number`

#### Inherited from

Pick.bucketSize

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2308

___

### collation

 `Optional` **collation**: [`CollationOptions`](CollationOptions.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3268

___

### default\_language

 `Optional` **default\_language**: `string`

#### Inherited from

Pick.default\_language

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2299

___

### expireAfterSeconds

 `Optional` **expireAfterSeconds**: `number`

Allows you to expire data on indexes applied to a data (MongoDB 2.2 or higher)

#### Inherited from

Pick.expireAfterSeconds

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2291

___

### hidden

 `Optional` **hidden**: `boolean`

Specifies that the index should exist on the target collection but should not be used by the query planner when executing operations. (MongoDB 4.4 or higher)

#### Inherited from

Pick.hidden

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2311

___

### key

 **key**: { `[key: string]`: [`IndexDirection`](../index.md#indexdirection);  } \| `Map`<`string`, [`IndexDirection`](../index.md#indexdirection)\>

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3270

___

### language\_override

 `Optional` **language\_override**: `string`

#### Inherited from

Pick.language\_override

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2300

___

### max

 `Optional` **max**: `number`

For geospatial indexes set the high bound for the co-ordinates.

#### Inherited from

Pick.max

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2307

___

### min

 `Optional` **min**: `number`

For geospatial indexes set the lower bound for the co-ordinates.

#### Inherited from

Pick.min

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2305

___

### name

 `Optional` **name**: `string`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3269

___

### partialFilterExpression

 `Optional` **partialFilterExpression**: [`Document`](Document.md)

Creates a partial index based on the given filter object (MongoDB 3.2 or higher)

#### Inherited from

Pick.partialFilterExpression

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2287

___

### sparse

 `Optional` **sparse**: `boolean`

Creates a sparse index.

#### Inherited from

Pick.sparse

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2289

___

### storageEngine

 `Optional` **storageEngine**: [`Document`](Document.md)

Allows users to configure the storage engine on a per-index basis when creating an index. (MongoDB 3.0 or higher)

#### Inherited from

Pick.storageEngine

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2293

___

### textIndexVersion

 `Optional` **textIndexVersion**: `number`

#### Inherited from

Pick.textIndexVersion

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2301

___

### unique

 `Optional` **unique**: `boolean`

Creates an unique index.

#### Inherited from

Pick.unique

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2283

___

### version

 `Optional` **version**: `number`

Specifies the index version number, either 0 or 1.

#### Inherited from

Pick.version

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2297

___

### weights

 `Optional` **weights**: [`Document`](Document.md)

#### Inherited from

Pick.weights

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2298

___

### wildcardProjection

 `Optional` **wildcardProjection**: [`Document`](Document.md)

#### Inherited from

Pick.wildcardProjection

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2309
