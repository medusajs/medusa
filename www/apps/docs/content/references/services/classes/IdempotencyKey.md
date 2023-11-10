# IdempotencyKey

Idempotency Key is used to continue a process in case of any failure that might occur.

## Constructors

### constructor

**new IdempotencyKey**()

Idempotency Key is used to continue a process in case of any failure that might occur.

## Properties

### created\_at

 **created\_at**: `Date`

Date which the idempotency key was locked.

#### Defined in

[packages/medusa/src/models/idempotency-key.ts:23](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/idempotency-key.ts#L23)

___

### id

 **id**: `string`

The idempotency key's ID

#### Defined in

[packages/medusa/src/models/idempotency-key.ts:16](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/idempotency-key.ts#L16)

___

### idempotency\_key

 **idempotency\_key**: `string`

The unique randomly generated key used to determine the state of a process.

#### Defined in

[packages/medusa/src/models/idempotency-key.ts:20](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/idempotency-key.ts#L20)

___

### locked\_at

 **locked\_at**: `Date`

Date which the idempotency key was locked.

#### Defined in

[packages/medusa/src/models/idempotency-key.ts:26](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/idempotency-key.ts#L26)

___

### recovery\_point

 **recovery\_point**: `string` = `started`

Where to continue from.

#### Defined in

[packages/medusa/src/models/idempotency-key.ts:44](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/idempotency-key.ts#L44)

___

### request\_method

 **request\_method**: `string`

The method of the request

#### Defined in

[packages/medusa/src/models/idempotency-key.ts:29](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/idempotency-key.ts#L29)

___

### request\_params

 **request\_params**: Record<`string`, `unknown`\>

The parameters passed to the request

#### Defined in

[packages/medusa/src/models/idempotency-key.ts:32](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/idempotency-key.ts#L32)

___

### request\_path

 **request\_path**: `string`

The request's path

#### Defined in

[packages/medusa/src/models/idempotency-key.ts:35](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/idempotency-key.ts#L35)

___

### response\_body

 **response\_body**: Record<`string`, `unknown`\>

The response's body

#### Defined in

[packages/medusa/src/models/idempotency-key.ts:41](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/idempotency-key.ts#L41)

___

### response\_code

 **response\_code**: `number`

The response's code.

#### Defined in

[packages/medusa/src/models/idempotency-key.ts:38](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/idempotency-key.ts#L38)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/idempotency-key.ts:50](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/idempotency-key.ts#L50)
