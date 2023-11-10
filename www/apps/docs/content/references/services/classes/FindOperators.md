# FindOperators

A builder object that is returned from [BulkOperationBase#find](OrderedBulkOperation.md#find).
Is used to build a write operation that involves a query filter.

## Constructors

### constructor

**new FindOperators**()

## Properties

### bulkOperation

 **bulkOperation**: [`BulkOperationBase`](BulkOperationBase.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2913

## Methods

### arrayFilters

**arrayFilters**(`arrayFilters`): [`FindOperators`](FindOperators.md)

Specifies arrayFilters for UpdateOne or UpdateMany bulk operations.

#### Parameters

| Name |
| :------ |
| `arrayFilters` | [`Document`](../interfaces/Document.md)[] |

#### Returns

[`FindOperators`](FindOperators.md)

-`FindOperators`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2929

___

### collation

**collation**(`collation`): [`FindOperators`](FindOperators.md)

Specifies the collation for the query condition.

#### Parameters

| Name |
| :------ |
| `collation` | [`CollationOptions`](../interfaces/CollationOptions.md) |

#### Returns

[`FindOperators`](FindOperators.md)

-`FindOperators`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2927

___

### delete

**delete**(): [`BulkOperationBase`](BulkOperationBase.md)

Add a delete many operation to the bulk operation

#### Returns

[`BulkOperationBase`](BulkOperationBase.md)

-`BulkOperationBase`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2923

___

### deleteOne

**deleteOne**(): [`BulkOperationBase`](BulkOperationBase.md)

Add a delete one operation to the bulk operation

#### Returns

[`BulkOperationBase`](BulkOperationBase.md)

-`BulkOperationBase`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2921

___

### hint

**hint**(`hint`): [`FindOperators`](FindOperators.md)

Specifies hint for the bulk operation.

#### Parameters

| Name |
| :------ |
| `hint` | [`Hint`](../index.md#hint) |

#### Returns

[`FindOperators`](FindOperators.md)

-`FindOperators`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2931

___

### replaceOne

**replaceOne**(`replacement`): [`BulkOperationBase`](BulkOperationBase.md)

Add a replace one operation to the bulk operation

#### Parameters

| Name |
| :------ |
| `replacement` | [`Document`](../interfaces/Document.md) |

#### Returns

[`BulkOperationBase`](BulkOperationBase.md)

-`BulkOperationBase`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2919

___

### update

**update**(`updateDocument`): [`BulkOperationBase`](BulkOperationBase.md)

Add a multiple update operation to the bulk operation

#### Parameters

| Name |
| :------ |
| `updateDocument` | [`Document`](../interfaces/Document.md) \| [`Document`](../interfaces/Document.md)[] |

#### Returns

[`BulkOperationBase`](BulkOperationBase.md)

-`BulkOperationBase`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2915

___

### updateOne

**updateOne**(`updateDocument`): [`BulkOperationBase`](BulkOperationBase.md)

Add a single update operation to the bulk operation

#### Parameters

| Name |
| :------ |
| `updateDocument` | [`Document`](../interfaces/Document.md) \| [`Document`](../interfaces/Document.md)[] |

#### Returns

[`BulkOperationBase`](BulkOperationBase.md)

-`BulkOperationBase`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2917

___

### upsert

**upsert**(): [`FindOperators`](FindOperators.md)

Upsert modifier for update bulk operation, noting that this operation is an upsert.

#### Returns

[`FindOperators`](FindOperators.md)

-`FindOperators`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2925
