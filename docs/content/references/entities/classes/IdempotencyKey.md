---
displayed_sidebar: entitiesSidebar
---

# Class: IdempotencyKey

## Constructors

### constructor

• **new IdempotencyKey**()

## Properties

### created\_at

• **created\_at**: `Date`

#### Defined in

[models/idempotency-key.ts:23](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/idempotency-key.ts#L23)

___

### id

• **id**: `string`

#### Defined in

[models/idempotency-key.ts:16](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/idempotency-key.ts#L16)

___

### idempotency\_key

• **idempotency\_key**: `string`

#### Defined in

[models/idempotency-key.ts:20](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/idempotency-key.ts#L20)

___

### locked\_at

• **locked\_at**: `Date`

#### Defined in

[models/idempotency-key.ts:26](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/idempotency-key.ts#L26)

___

### recovery\_point

• **recovery\_point**: `string`

#### Defined in

[models/idempotency-key.ts:44](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/idempotency-key.ts#L44)

___

### request\_method

• **request\_method**: `string`

#### Defined in

[models/idempotency-key.ts:29](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/idempotency-key.ts#L29)

___

### request\_params

• **request\_params**: `Record`<`string`, `unknown`\>

#### Defined in

[models/idempotency-key.ts:32](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/idempotency-key.ts#L32)

___

### request\_path

• **request\_path**: `string`

#### Defined in

[models/idempotency-key.ts:35](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/idempotency-key.ts#L35)

___

### response\_body

• **response\_body**: `Record`<`string`, `unknown`\>

#### Defined in

[models/idempotency-key.ts:41](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/idempotency-key.ts#L41)

___

### response\_code

• **response\_code**: `number`

#### Defined in

[models/idempotency-key.ts:38](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/idempotency-key.ts#L38)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/idempotency-key.ts:46](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/idempotency-key.ts#L46)
