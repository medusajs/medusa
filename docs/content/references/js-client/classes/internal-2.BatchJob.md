# Class: BatchJob

[internal](../modules/internal-2.md).BatchJob

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal.SoftDeletableEntity.md)

  ↳ **`BatchJob`**

## Properties

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

medusa/dist/models/batch-job.d.ts:27

___

### canceled\_at

• `Optional` **canceled\_at**: `Date`

#### Defined in

medusa/dist/models/batch-job.d.ts:23

___

### completed\_at

• `Optional` **completed\_at**: `Date`

#### Defined in

medusa/dist/models/batch-job.d.ts:22

___

### confirmed\_at

• `Optional` **confirmed\_at**: `Date`

#### Defined in

medusa/dist/models/batch-job.d.ts:21

___

### context

• **context**: `Record`<`string`, `unknown`\>

#### Defined in

medusa/dist/models/batch-job.d.ts:8

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[created_at](internal.SoftDeletableEntity.md#created_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:6

___

### created\_by

• **created\_by**: ``null`` \| `string`

#### Defined in

medusa/dist/models/batch-job.d.ts:6

___

### created\_by\_user

• **created\_by\_user**: [`User`](internal-1.User.md)

#### Defined in

medusa/dist/models/batch-job.d.ts:7

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[deleted_at](internal.SoftDeletableEntity.md#deleted_at)

#### Defined in

medusa/dist/interfaces/models/soft-deletable-entity.d.ts:3

___

### dry\_run

• **dry\_run**: `boolean`

#### Defined in

medusa/dist/models/batch-job.d.ts:18

___

### failed\_at

• `Optional` **failed\_at**: `Date`

#### Defined in

medusa/dist/models/batch-job.d.ts:24

___

### id

• **id**: `string`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[id](internal.SoftDeletableEntity.md#id)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:5

___

### pre\_processed\_at

• `Optional` **pre\_processed\_at**: `Date`

#### Defined in

medusa/dist/models/batch-job.d.ts:19

___

### processing\_at

• `Optional` **processing\_at**: `Date`

#### Defined in

medusa/dist/models/batch-job.d.ts:20

___

### result

• **result**: { `advancement_count?`: `number` ; `count?`: `number` ; `errors?`: [`BatchJobResultError`](../modules/internal-2.md#batchjobresulterror)[] ; `file_key?`: `string` ; `file_size?`: `number` ; `progress?`: `number` ; `stat_descriptors?`: [`BatchJobResultStatDescriptor`](../modules/internal-2.md#batchjobresultstatdescriptor)[]  } & `Record`<`string`, `unknown`\>

#### Defined in

medusa/dist/models/batch-job.d.ts:9

___

### status

• **status**: [`BatchJobStatus`](../enums/internal-2.BatchJobStatus.md)

#### Defined in

medusa/dist/models/batch-job.d.ts:25

___

### type

• **type**: `string`

#### Defined in

medusa/dist/models/batch-job.d.ts:5

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[updated_at](internal.SoftDeletableEntity.md#updated_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:7

## Methods

### loadStatus

▸ **loadStatus**(): `void`

#### Returns

`void`

#### Defined in

medusa/dist/models/batch-job.d.ts:26

___

### toJSON

▸ **toJSON**(): [`BatchJob`](internal-2.BatchJob.md)

#### Returns

[`BatchJob`](internal-2.BatchJob.md)

#### Defined in

medusa/dist/models/batch-job.d.ts:28
