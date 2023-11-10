# FilterOperators

## Type parameters

| Name |
| :------ |
| `TValue` | `object` |

## Hierarchy

- [`NonObjectIdLikeDocument`](../types/NonObjectIdLikeDocument.md)

  ↳ **`FilterOperators`**

## Properties

### $all

 `Optional` **$all**: readonly `any`[]

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2706

___

### $bitsAllClear

 `Optional` **$bitsAllClear**: [`BitwiseFilter`](../types/BitwiseFilter.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2709

___

### $bitsAllSet

 `Optional` **$bitsAllSet**: [`BitwiseFilter`](../types/BitwiseFilter.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2710

___

### $bitsAnyClear

 `Optional` **$bitsAnyClear**: [`BitwiseFilter`](../types/BitwiseFilter.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2711

___

### $bitsAnySet

 `Optional` **$bitsAnySet**: [`BitwiseFilter`](../types/BitwiseFilter.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2712

___

### $elemMatch

 `Optional` **$elemMatch**: [`Document`](Document.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2707

___

### $eq

 `Optional` **$eq**: `TValue`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2679

___

### $exists

 `Optional` **$exists**: `boolean`

When `true`, `$exists` matches the documents that contain the field,
including documents where the field value is null.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2692

___

### $expr

 `Optional` **$expr**: Record<`string`, `any`\>

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2694

___

### $geoIntersects

 `Optional` **$geoIntersects**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `$geometry` | [`Document`](Document.md) |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2699

___

### $geoWithin

 `Optional` **$geoWithin**: [`Document`](Document.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2702

___

### $gt

 `Optional` **$gt**: `TValue`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2680

___

### $gte

 `Optional` **$gte**: `TValue`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2681

___

### $in

 `Optional` **$in**: readonly `TValue`[]

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2682

___

### $jsonSchema

 `Optional` **$jsonSchema**: Record<`string`, `any`\>

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2695

___

### $lt

 `Optional` **$lt**: `TValue`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2683

___

### $lte

 `Optional` **$lte**: `TValue`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2684

___

### $maxDistance

 `Optional` **$maxDistance**: `number`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2705

___

### $mod

 `Optional` **$mod**: `TValue` extends `number` ? [`number`, `number`] : `never`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2696

___

### $ne

 `Optional` **$ne**: `TValue`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2685

___

### $near

 `Optional` **$near**: [`Document`](Document.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2703

___

### $nearSphere

 `Optional` **$nearSphere**: [`Document`](Document.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2704

___

### $nin

 `Optional` **$nin**: readonly `TValue`[]

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2686

___

### $not

 `Optional` **$not**: `TValue` extends `string` ? `RegExp` \| [`FilterOperators`](FilterOperators.md)<`TValue`\> : [`FilterOperators`](FilterOperators.md)<`TValue`\>

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2687

___

### $options

 `Optional` **$options**: `TValue` extends `string` ? `string` : `never`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2698

___

### $rand

 `Optional` **$rand**: Record<`string`, `never`\>

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2713

___

### $regex

 `Optional` **$regex**: `TValue` extends `string` ? `string` \| `RegExp` \| [`BSONRegExp`](../classes/BSONRegExp.md) : `never`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2697

___

### $size

 `Optional` **$size**: `TValue` extends readonly `any`[] ? `number` : `never`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2708

___

### $type

 `Optional` **$type**: ``"string"`` \| ``"symbol"`` \| ``"undefined"`` \| ``"object"`` \| ``"double"`` \| ``"decimal"`` \| ``"timestamp"`` \| ``"int"`` \| ``"bool"`` \| ``"long"`` \| ``"date"`` \| ``"array"`` \| ``"null"`` \| ``"binData"`` \| ``"objectId"`` \| ``"regex"`` \| ``"dbPointer"`` \| ``"javascript"`` \| ``"javascriptWithScope"`` \| ``"minKey"`` \| ``"maxKey"`` \| [`BSONType`](../index.md#bsontype)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2693

___

### \_\_id

 `Optional` **\_\_id**: `undefined`

#### Inherited from

NonObjectIdLikeDocument.\_\_id

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:886

___

### id

 `Optional` **id**: `undefined`

#### Inherited from

NonObjectIdLikeDocument.id

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:885

## Methods

### toHexString

 `Optional` **toHexString**: `object`

#### Inherited from

NonObjectIdLikeDocument.toHexString

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:887
