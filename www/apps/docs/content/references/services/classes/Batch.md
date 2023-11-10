# Batch

Keeps the state of a unordered batch so we can rewrite the results
correctly after command execution

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `object` |

## Constructors

### constructor

**new Batch**<`T`\>(`batchType`, `originalZeroIndex`)

| Name | Type |
| :------ | :------ |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `batchType` | [`BatchType`](../index.md#batchtype-1) |
| `originalZeroIndex` | `number` |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:674

## Properties

### batchType

 **batchType**: [`BatchType`](../index.md#batchtype-1)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:670

___

### currentIndex

 **currentIndex**: `number`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:668

___

### operations

 **operations**: `T`[]

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:671

___

### originalIndexes

 **originalIndexes**: `number`[]

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:669

___

### originalZeroIndex

 **originalZeroIndex**: `number`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:667

___

### size

 **size**: `number`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:672

___

### sizeBytes

 **sizeBytes**: `number`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:673
