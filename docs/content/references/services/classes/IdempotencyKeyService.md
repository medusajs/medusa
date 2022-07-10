# Class: IdempotencyKeyService

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`IdempotencyKeyService`**

## Constructors

### constructor

• **new IdempotencyKeyService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

BaseService.constructor

#### Defined in

[services/idempotency-key.js:8](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/idempotency-key.js#L8)

## Methods

### create

▸ **create**(`payload`): `Promise`<`IdempotencyKeyModel`\>

Creates an idempotency key for a request.
If no idempotency key is provided in request, we will create a unique
identifier.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `any` | payload of request to create idempotency key for |

#### Returns

`Promise`<`IdempotencyKeyModel`\>

the created idempotency key

#### Defined in

[services/idempotency-key.js:52](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/idempotency-key.js#L52)

___

### initializeRequest

▸ **initializeRequest**(`headerKey`, `reqMethod`, `reqParams`, `reqPath`): `Promise`<`IdempotencyKeyModel`\>

Execute the initial steps in a idempotent request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `headerKey` | `string` | potential idempotency key from header |
| `reqMethod` | `string` | method of request |
| `reqParams` | `string` | params of request |
| `reqPath` | `string` | path of request |

#### Returns

`Promise`<`IdempotencyKeyModel`\>

the existing or created idempotency key

#### Defined in

[services/idempotency-key.js:26](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/idempotency-key.js#L26)

___

### lock

▸ **lock**(`idempotencyKey`): `Promise`<`any`\>

Locks an idempotency.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idempotencyKey` | `string` | key to lock |

#### Returns

`Promise`<`any`\>

result of the update operation

#### Defined in

[services/idempotency-key.js:90](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/idempotency-key.js#L90)

___

### retrieve

▸ **retrieve**(`idempotencyKey`): `Promise`<`IdempotencyKeyModel`\>

Retrieves an idempotency key

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idempotencyKey` | `string` | key to retrieve |

#### Returns

`Promise`<`IdempotencyKeyModel`\>

idempotency key

#### Defined in

[services/idempotency-key.js:73](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/idempotency-key.js#L73)

___

### update

▸ **update**(`idempotencyKey`, `update`): `Promise`<`any`\>

Locks an idempotency.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idempotencyKey` | `string` | key to update |
| `update` | `any` | update object |

#### Returns

`Promise`<`any`\>

result of the update operation

#### Defined in

[services/idempotency-key.js:117](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/idempotency-key.js#L117)

___

### workStage

▸ **workStage**(`idempotencyKey`, `func`): `IdempotencyKeyModel`

Performs an atomic work stage.
An atomic work stage contains some related functionality, that needs to be
transactionally executed in isolation. An idempotent request will
always consist of 2 or more of these phases. The required phases are
"started" and "finished".

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idempotencyKey` | `string` | current idempotency key |
| `func` | `Function` | functionality to execute within the phase |

#### Returns

`IdempotencyKeyModel`

new updated idempotency key

#### Defined in

[services/idempotency-key.js:144](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/idempotency-key.js#L144)
