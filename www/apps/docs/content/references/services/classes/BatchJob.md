# BatchJob

A Batch Job indicates an asynchronus task stored in the Medusa backend. Its status determines whether it has been executed or not.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`BatchJob`**

## Constructors

### constructor

**new BatchJob**()

A Batch Job indicates an asynchronus task stored in the Medusa backend. Its status determines whether it has been executed or not.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[constructor](SoftDeletableEntity.md#constructor)

## Properties

### canceled\_at

 `Optional` **canceled\_at**: `Date`

The date of the concellation.

#### Defined in

[packages/medusa/src/models/batch-job.ts:62](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/batch-job.ts#L62)

___

### completed\_at

 `Optional` **completed\_at**: `Date`

The date of the completion.

#### Defined in

[packages/medusa/src/models/batch-job.ts:59](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/batch-job.ts#L59)

___

### confirmed\_at

 `Optional` **confirmed\_at**: `Date`

The date when the confirmation has been done.

#### Defined in

[packages/medusa/src/models/batch-job.ts:56](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/batch-job.ts#L56)

___

### context

 **context**: Record<`string`, `unknown`\>

The context of the batch job, the type of the batch job determines what the context should contain.

#### Defined in

[packages/medusa/src/models/batch-job.ts:33](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/batch-job.ts#L33)

___

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[created_at](SoftDeletableEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### created\_by

 **created\_by**: ``null`` \| `string`

The unique identifier of the user that created the batch job.

#### Defined in

[packages/medusa/src/models/batch-job.ts:26](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/batch-job.ts#L26)

___

### created\_by\_user

 **created\_by\_user**: [`User`](User.md)

The details of the user that created the batch job.

#### Defined in

[packages/medusa/src/models/batch-job.ts:30](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/batch-job.ts#L30)

___

### deleted\_at

 **deleted\_at**: ``null`` \| `Date`

The date with timezone at which the resource was deleted.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[deleted_at](SoftDeletableEntity.md#deleted_at)

#### Defined in

[packages/medusa/src/interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### dry\_run

 **dry\_run**: `boolean` = `false`

Specify if the job must apply the modifications or not.

#### Defined in

[packages/medusa/src/models/batch-job.ts:47](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/batch-job.ts#L47)

___

### failed\_at

 `Optional` **failed\_at**: `Date`

The date when the job failed.

#### Defined in

[packages/medusa/src/models/batch-job.ts:65](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/batch-job.ts#L65)

___

### id

 **id**: `string`

The unique identifier for the batch job.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### pre\_processed\_at

 `Optional` **pre\_processed\_at**: `Date`

The date from which the job has been pre-processed.

#### Defined in

[packages/medusa/src/models/batch-job.ts:50](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/batch-job.ts#L50)

___

### processing\_at

 `Optional` **processing\_at**: `Date`

The date the job is processing at.

#### Defined in

[packages/medusa/src/models/batch-job.ts:53](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/batch-job.ts#L53)

___

### result

 **result**: { `advancement_count?`: `number` ; `count?`: `number` ; `errors?`: (`string` \| [`BatchJobResultError`](../index.md#batchjobresulterror))[] ; `file_key?`: `string` ; `file_size?`: `number` ; `progress?`: `number` ; `stat_descriptors?`: [`BatchJobResultStatDescriptor`](../index.md#batchjobresultstatdescriptor)[]  } & Record<`string`, `unknown`\>

The result of the batch job.

#### Defined in

[packages/medusa/src/models/batch-job.ts:36](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/batch-job.ts#L36)

___

### status

 **status**: [`BatchJobStatus`](../enums/BatchJobStatus.md) = `created`

The status of the batch job.

#### Defined in

[packages/medusa/src/models/batch-job.ts:67](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/batch-job.ts#L67)

___

### type

 **type**: `string`

The type of batch job.

#### Defined in

[packages/medusa/src/models/batch-job.ts:23](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/batch-job.ts#L23)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was last updated.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[updated_at](SoftDeletableEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/batch-job.ts:101](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/batch-job.ts#L101)

___

### loadStatus

**loadStatus**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/batch-job.ts:73](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/batch-job.ts#L73)

___

### toJSON

**toJSON**(): [`BatchJob`](BatchJob.md)

A Batch Job indicates an asynchronus task stored in the Medusa backend. Its status determines whether it has been executed or not.

#### Returns

[`BatchJob`](BatchJob.md)

-`BatchJob`: 

#### Defined in

[packages/medusa/src/models/batch-job.ts:105](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/batch-job.ts#L105)
