---
displayed_sidebar: entitiesSidebar
---

# Class: BatchJob

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`BatchJob`**

## Constructors

### constructor

• **new BatchJob**()

#### Inherited from

SoftDeletableEntity.constructor

## Properties

### canceled\_at

• `Optional` **canceled\_at**: `Date`

#### Defined in

[models/batch-job.ts:62](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/batch-job.ts#L62)

___

### completed\_at

• `Optional` **completed\_at**: `Date`

#### Defined in

[models/batch-job.ts:59](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/batch-job.ts#L59)

___

### confirmed\_at

• `Optional` **confirmed\_at**: `Date`

#### Defined in

[models/batch-job.ts:56](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/batch-job.ts#L56)

___

### context

• **context**: `Record`<`string`, `unknown`\>

#### Defined in

[models/batch-job.ts:33](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/batch-job.ts#L33)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

SoftDeletableEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### created\_by

• **created\_by**: ``null`` \| `string`

#### Defined in

[models/batch-job.ts:26](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/batch-job.ts#L26)

___

### created\_by\_user

• **created\_by\_user**: [`User`](User.md)

#### Defined in

[models/batch-job.ts:30](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/batch-job.ts#L30)

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

SoftDeletableEntity.deleted\_at

#### Defined in

[interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### dry\_run

• **dry\_run**: `boolean` = `false`

#### Defined in

[models/batch-job.ts:47](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/batch-job.ts#L47)

___

### failed\_at

• `Optional` **failed\_at**: `Date`

#### Defined in

[models/batch-job.ts:65](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/batch-job.ts#L65)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### pre\_processed\_at

• `Optional` **pre\_processed\_at**: `Date`

#### Defined in

[models/batch-job.ts:50](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/batch-job.ts#L50)

___

### processing\_at

• `Optional` **processing\_at**: `Date`

#### Defined in

[models/batch-job.ts:53](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/batch-job.ts#L53)

___

### result

• **result**: { `advancement_count?`: `number` ; `count?`: `number` ; `errors?`: `BatchJobResultError`[] ; `file_key?`: `string` ; `file_size?`: `number` ; `progress?`: `number` ; `stat_descriptors?`: `BatchJobResultStatDescriptor`[]  } & `Record`<`string`, `unknown`\>

#### Defined in

[models/batch-job.ts:36](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/batch-job.ts#L36)

___

### status

• **status**: `BatchJobStatus`

#### Defined in

[models/batch-job.ts:67](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/batch-job.ts#L67)

___

### type

• **type**: `string`

#### Defined in

[models/batch-job.ts:23](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/batch-job.ts#L23)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/batch-job.ts:94](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/batch-job.ts#L94)

___

### loadStatus

▸ **loadStatus**(): `void`

#### Returns

`void`

#### Defined in

[models/batch-job.ts:69](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/batch-job.ts#L69)

___

### toJSON

▸ **toJSON**(): [`BatchJob`](BatchJob.md)

#### Returns

[`BatchJob`](BatchJob.md)

#### Defined in

[models/batch-job.ts:99](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/batch-job.ts#L99)
